/**
 * Utils class to parse a decision tree from Weka.
 */

import {DecisionTree} from '../model/decision-tree/decision-tree.model';
import {DecisionTreeLeaf} from '../model/decision-tree/decision-tree-leaf.model';

/**
 * Helper class to parse a decision tree from Weka with numerical attributes.
 */
// TODO
export class WekaTreeParserUtils {

    /**
     * Parses the given decision tree
     * @param treeString - the string of the decision tree
     * @returns the decision tree object
     */
    public static parse(treeString: string): DecisionTree {
        // split by lines
        const splitTreeString: string[] = treeString.split('\n');

        return this.parseNode(splitTreeString) as DecisionTree;
    }

    /**
     * Parses the given leaf of a decision tree
     * @param leafString - the string of the leaf
     * @returns the leaf object
     */
    public static parseLeaf(leafString: string): DecisionTreeLeaf {
        let relevantSubstring: string;
        let startIndex: number;
        let identifier: string = ' : ';

        if(leafString.indexOf(identifier) == -1) {
            startIndex = 0;
        } else {
            startIndex = leafString.indexOf(identifier) + identifier.length;
        }

        relevantSubstring = leafString.substring(startIndex);

        const firstNumberString: string = relevantSubstring.substring(relevantSubstring.indexOf('(') +
            1, relevantSubstring.indexOf('/'));
        const secondNumberString = relevantSubstring.substring(relevantSubstring.indexOf('/') +
            1, relevantSubstring.indexOf(')'));

        return {
            value: relevantSubstring.substring(0, relevantSubstring.indexOf('(') - 1) as string,
            firstNumber: Number.parseFloat(firstNumberString),
            secondNumber: Number.parseFloat(secondNumberString)
        };
    }

    /**
     * Parses a node consisting of multiple lines. A node can be a decision tree or a leaf.
     * @param splitTreeString - the decision tree or leaf of the nodes line by line
     * @returns the decision tree or leaf of the node as object
     */
    private static parseNode(splitTreeString: string[]): DecisionTree | DecisionTreeLeaf {
        let firstLine: string = splitTreeString[0];
        let startIndex: number;
        let endIdentifier: string;

        if(splitTreeString.length == 1) {
            // it is a single leaf
            return this.parseLeaf(firstLine);
        } else {
            // it is a tree
            // ATTRIBUTE
            endIdentifier = ' < ';
            let endIndex: number = firstLine.indexOf(endIdentifier);
            const splitAttribute: string = firstLine.substring(0, endIndex);

            // VALUE
            startIndex = endIndex + endIdentifier.length;
            const splitValueString: string = firstLine.substring(startIndex);
            const splitValue: number = Number.parseFloat(splitValueString);

            // LEFT CHILD
            const leftChild: string[] = this.getChild(0, splitTreeString);

            let rightChildHeadIndex: number = leftChild.length;

            if(leftChild.length > 1) {
                rightChildHeadIndex++;
            }

            // RIGHT CHILD
            const rightChild: string[] = this.getChild(rightChildHeadIndex, splitTreeString);

            return {
                splitAttribute: splitAttribute,
                splitValue: splitValue,
                // recursive calls
                leftChild: this.parseNode(leftChild),
                rightChild: this.parseNode(rightChild)
            };
        }
    }

    /**
     * Returns the child tree or leaf line by line
     * @param startIndex - the index in the tree where the child starts
     * @param tree - the tree (line by line)
     * @returns the tree or leaf of the child
     */
    private static getChild(startIndex: number, tree: string[]): string[] {
        let firstLine = tree[startIndex];
        const child: string[] = [];
        const leafIdentifier: string = ' : ';
        const subTreeIdentifier: string = '|   ';
        let index: number = startIndex;

        if(firstLine.includes(leafIdentifier)) {
            // the child is a leaf
            child.push(firstLine);
        } else {
            let relevantSubstring: string;
            index++; // skip the first line

            while(index < tree.length && tree[index].includes(subTreeIdentifier)) {
                // remove one sub-tree identifier from each line
                relevantSubstring = tree[index];
                startIndex = relevantSubstring.indexOf(subTreeIdentifier) + subTreeIdentifier.length;
                relevantSubstring = relevantSubstring.substring(startIndex);
                child.push(relevantSubstring);
                index++;
            }
        }

        return child;
    }
}
