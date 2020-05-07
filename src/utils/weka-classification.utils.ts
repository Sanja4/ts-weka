import {Features} from '../model/features.model';
import {DecisionTree} from '../model/decision-tree/decision-tree.model';
import {DecisionTreeLeaf} from '../model/decision-tree/decision-tree-leaf.model';

export class WekaClassificationUtils {

    /**
     * Classifies the given instance (features) using the given decision trees
     * @param features - the features of the instance to classify
     * @param decisionTrees - the decision trees to use for classification
     * @returns the predicted class
     */
    public static classifyMultiple(features: Features,
                                   decisionTrees: DecisionTree[]): string {
        // use a majority vote of all decision trees
        const votes: string[] = decisionTrees.map((decisionTree) => this.classify(features, decisionTree));
        if(votes.length == 1) {
            return votes[0];
        }

        // count the weight of the votes per class
        const numberOfVotesPerClass: Map<string, number> = new Map<string, number>();
        for(const vote of votes) {
            if(numberOfVotesPerClass.has(vote)) {
                numberOfVotesPerClass.set(vote, numberOfVotesPerClass.get(vote) + 1);
            } else {
                numberOfVotesPerClass.set(vote, 1);
            }
        }

        return this.getMotionTypeWithMaxVotes(numberOfVotesPerClass);
    }

    /**
     * Classifies the given instance (features) using the given decision tree
     * @param features - the features of the instance to classify
     * @param decisionTree - the decision tree to use for classification
     * @returns the predicted class
     */
    public static classify(features: Features,
                           decisionTree: DecisionTree): string {
        // traverse the decision tree
        // use a majority vote of all paths
        const votes: DecisionTreeLeaf[] = this.traverseTreeOrLeaf(features, decisionTree);
        return this.getMajorityVotingResult(votes);
    }

    /**
     * Traverses the given decision tree (which can be a tree or a leaf) using the given features and returns all leaves that can be reached using the features.
     * @param features
     * @param decisionTree - a decision tree (which can also be a leaf)
     */
    public static traverseTreeOrLeaf(features: Features,
                                     decisionTree: DecisionTree | DecisionTreeLeaf): DecisionTreeLeaf[] {
        const isLeaf: boolean = (decisionTree as DecisionTree).splitAttribute == null;

        if(!isLeaf) {
           return this.traverseTree(features, decisionTree as DecisionTree);
        } else {
            // leaf
            return [(decisionTree as DecisionTreeLeaf)];
        }
    }

    /**
     * Traverses the given decision tree using the given features and returns all leaves that can be reached using the
     * features. Contrary to {@link traverseTreeOrLeaf} this method only handles decision trees that are not only a leaf.
     * @param features
     * @param decisionTree - a decision tree
     */
    private static traverseTree(features: Features, decisionTree: DecisionTree): DecisionTreeLeaf[] {
        // tree
        decisionTree = decisionTree as DecisionTree;
        // check the split
        const featureValue: number | string = features[decisionTree.splitAttribute] as number | string;

        // check if the feature value is known
        if(featureValue == null) {
            // feature value not given
            // traverse all children and collect the votes of all paths
            const resultsOfLeftChild: DecisionTreeLeaf[] = this.traverseTreeOrLeaf(features, decisionTree.children[0]);
            const resultsOfRightChild: DecisionTreeLeaf[] = this.traverseTreeOrLeaf(features, decisionTree.children[1]);
            // combine the results
            return resultsOfLeftChild.concat(resultsOfRightChild);
        } else {
            // recursive call
            if(typeof decisionTree.splitValue == 'number') {
                // numeric split attribute
                if((featureValue as number) < decisionTree.splitValue) {
                    // use the left child
                    return this.traverseTreeOrLeaf(features, decisionTree.children[0]);
                } else {
                    // use the right child
                    return this.traverseTreeOrLeaf(features, decisionTree.children[1]);
                }
            } else {
                // enum split attribute
                const index: number = (decisionTree.splitValue as string[]).findIndex((v) => v == featureValue);
                return this.traverseTreeOrLeaf(features, decisionTree.children[index]);
            }
        }
    }

    private static getMotionTypeWithMaxVotes(numberOfVotesPerMotionType: Map<string, number>): string {
        // find the maximum value
        let maxWeightOfVotes: number = 0;
        let classWithMaxVotes: string;

        for(const [motionType, numberOfVotes] of numberOfVotesPerMotionType) {
            if(numberOfVotes > maxWeightOfVotes) {
                maxWeightOfVotes = numberOfVotes;
                classWithMaxVotes = motionType;
            }
        }

        return classWithMaxVotes;
    }

    /**
     * For the majority voting the weight of the class of each leaf is used {@link DecisionTreeLeaf.totalWeightCovered}
     * @param votes
     */
    private static getMajorityVotingResult(votes: DecisionTreeLeaf[]): string {
        if(votes.length == 1) {
            return votes[0].predictedClass;
        }

        // count the weight of the votes per motion type
        const numberOfVotesPerClass: Map<string, number> = new Map<string, number>();
        for(const vote of votes) {
            if(numberOfVotesPerClass.has(vote.predictedClass)) {
                numberOfVotesPerClass.set(vote.predictedClass, numberOfVotesPerClass.get(vote.predictedClass) +
                    vote.totalWeightCovered);
            } else {
                numberOfVotesPerClass.set(vote.predictedClass, vote.totalWeightCovered);
            }
        }

        return this.getMotionTypeWithMaxVotes(numberOfVotesPerClass);
    }
}
