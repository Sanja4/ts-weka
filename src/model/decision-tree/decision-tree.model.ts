import {DecisionTreeLeaf} from './decision-tree-leaf.model';
// TODO
export class DecisionTree {

    /** The attribute/feature to use for the split */
    splitAttribute: string;

    /** The value of the feature to split at */
    splitValue: number;

    /** splitAttribute < splitValue */
    leftChild: DecisionTree | DecisionTreeLeaf;

    /** splitAttribute >= splitValue */
    rightChild: DecisionTree | DecisionTreeLeaf;
}
