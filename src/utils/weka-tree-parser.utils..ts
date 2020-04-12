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

        const predictedClass: string = relevantSubstring.substring(0, relevantSubstring.indexOf('(') - 1) as string;
        const totalWeightCoveredString: string = relevantSubstring.substring(relevantSubstring.indexOf('(') +
            1, relevantSubstring.indexOf('/'));
        const totalWeightMisclassifiedString = relevantSubstring.substring(relevantSubstring.indexOf('/') +
            1, relevantSubstring.indexOf(')'));

        return {
            predictedClass: predictedClass,
            totalWeightCovered: Number.parseFloat(totalWeightCoveredString),
            totalWeightMisclassified: Number.parseFloat(totalWeightMisclassifiedString)
        };
    }

    /**
     * Parses a node consisting of multiple lines. A node can be a decision tree or a leaf.
     * @param splitTreeString - the decision tree or leaf of the nodes line by line
     * @returns the decision tree or leaf of the node
     */
    private static parseNode(splitTreeString: string[]): DecisionTree | DecisionTreeLeaf {
        let firstLine: string = splitTreeString[0];

        if(splitTreeString.length == 1) {
            // it is a single leaf
            return this.parseLeaf(firstLine);
        }

        // it is a tree
        const identifierRegex = /(?:\S\s)(\D{1,2})(?:\s\S)+/gm; // matches '<', ':' or '>='
        const identifierFirstLine = identifierRegex.exec(firstLine)[1];

        // ATTRIBUTE
        let splitAttributeEndIndex: number = firstLine.indexOf(identifierFirstLine) - 1;
        const splitAttribute: string = firstLine.substring(0, splitAttributeEndIndex);

        // VALUE
        const splitValueStartIndex: number = splitAttributeEndIndex + 3;

        let splitValueString: string;
        let splitValue: number | string[] = null;
        const children: Array<DecisionTree | DecisionTreeLeaf> = [];

        let isNumericAttribute: boolean = true;

        // numeric attribute
        const rootNodeStrings: { line: string, index: number }[] = this.extractAllRootNodeStrings(splitTreeString);

        rootNodeStrings.forEach(node => {
            const indexOfColon: number = node.line.indexOf(':');
            if(indexOfColon != -1) {
                // there is a colon --> the split attribute points to a leaf
                splitValueString = node.line.substring(splitValueStartIndex, indexOfColon - 1);
            } else {
                splitValueString = node.line.substring(splitValueStartIndex);
            }
            if(isNumericAttribute) {
                splitValue = Number.parseFloat(splitValueString);
                if(isNaN(splitValue)) {
                    // it was not a numeric attribute
                    isNumericAttribute = false;
                    splitValue = [];
                    (splitValue as string[]).push(splitValueString);
                }
            } else {
                (splitValue as string[]).push(splitValueString);
            }

            const childTree: string[] = this.getChild(node.index, splitTreeString);
            children.push(this.parseNode(childTree));
        });

        return new DecisionTree({
            splitAttribute: splitAttribute,
            splitValue: splitValue,
            children: children
        } as DecisionTree);
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

    /**
     * Returns all root lines/nodes from the given string array.
     * @param splitTreeString - array containing all lines of a tree or sub-tree.
     */
    private static extractAllRootNodeStrings(splitTreeString: string[]): { line: string, index: number }[] {
        const rootNodesLines: { line: string, index: number }[] = [];
        splitTreeString.forEach((line, index) => {
            const isRootNode: boolean = this.isRootNode(line);
            if(isRootNode) {
                rootNodesLines.push({
                    line: line,
                    index: index
                });
            }
        });
        return rootNodesLines;
    }

    /**
     * Determines if the given line forms a root node.
     * @param treeLine - the line to check.
     */
    private static isRootNode(treeLine: string): boolean {
        const identifierIndex: number = treeLine.indexOf('|');
        return identifierIndex === -1;
    }
}
