
import {DecisionTree} from '../model/decision-tree/decision-tree.model';
import {DecisionTreeLeaf} from '../model/decision-tree/decision-tree-leaf.model';
import {WekaTreeParserUtils} from './weka-tree-parser.utils.';

describe('WekaTreeParserUtils', () => {

    test('should parse a leaf (1)', () => {
        const testLeaf: string = `accelerationFrequencyBandEnergy10To14Hz >= 0.86 : train (1.23/0.22)`;
        const result: DecisionTreeLeaf = WekaTreeParserUtils.parseLeaf(testLeaf);
        expect(result.value).toEqual('train');
        expect(result.firstNumber).toEqual(1.23);
        expect(result.secondNumber).toEqual(0.22);
    });

    test('should parse a leaf (2)', () => {
        const testLeaf: string = `accelerationFrequencyBandEnergy8To10Hz < 0.49 : train (71.53/0)`;
        const result: DecisionTreeLeaf = WekaTreeParserUtils.parseLeaf(testLeaf);
        expect(result.value).toEqual('train');
        expect(result.firstNumber).toEqual(71.53);
        expect(result.secondNumber).toEqual(0);
    });

    test('should parse a tree (1)', () => {
        const result: DecisionTree = WekaTreeParserUtils.parse(treeString1);
        expect(result.splitValue).toEqual(0.86);
        expect(result.splitAttribute).toEqual('accelerationFrequencyBandEnergy10To14Hz');
        const leftChild: DecisionTree = result.leftChild as DecisionTree;
        expect(leftChild.splitAttribute).toEqual('accelerationFrequencyBandEnergy8To10Hz');
        expect(leftChild.splitValue).toEqual(0.49);
        expect((leftChild.leftChild as DecisionTreeLeaf).value).toEqual('train');
        expect((leftChild.rightChild as DecisionTreeLeaf).value).toEqual('bus');

        const rightChild: DecisionTreeLeaf = result.rightChild as DecisionTreeLeaf;
        expect(rightChild.value).toEqual('train');
        expect(rightChild.firstNumber).toEqual(1.23);
        expect(rightChild.secondNumber).toEqual(0.22);
    });

    test('should parse a tree (2)', () => {
        const result: DecisionTree = WekaTreeParserUtils.parse(treeString2);
        expect(result.splitValue).toEqual(4.99);
        expect(result.splitAttribute).toEqual('accumulatedTravelDistance');
        const leftChild: DecisionTree = result.leftChild as DecisionTree;
        expect(leftChild.splitAttribute).toEqual('accelerationFrequencyBandEnergy22To25Hz');
        expect(leftChild.splitValue).toEqual(0.09);
        expect((leftChild.leftChild as DecisionTreeLeaf).value).toEqual('stationary');

        const rightChild: DecisionTree = result.rightChild as DecisionTree;
        expect(rightChild.splitAttribute).toEqual('trajectorySimilarityTrain');
        expect(rightChild.splitValue).toEqual(920.02);
    });
});

const treeString1: string = `accelerationFrequencyBandEnergy10To14Hz < 0.86
|   accelerationFrequencyBandEnergy8To10Hz < 0.49 : train (71.53/0)
|   accelerationFrequencyBandEnergy8To10Hz >= 0.49 : bus (0.11/0)
accelerationFrequencyBandEnergy10To14Hz >= 0.86 : train (1.23/0.22)`;

const treeString2: string = `accumulatedTravelDistance < 4.99
|   accelerationFrequencyBandEnergy22To25Hz < 0.09 : stationary (431.61/0)
|   accelerationFrequencyBandEnergy22To25Hz >= 0.09
|   |   accelerationMean < 0.04
|   |   |   accelerationFrequencyBandEnergy25To30Hz < 0.14 : stationary (12.74/1.78)
|   |   |   accelerationFrequencyBandEnergy25To30Hz >= 0.14 : stationary (41.22/0)
|   |   accelerationMean >= 0.04 : train (3.96/1)
accumulatedTravelDistance >= 4.99
|   trajectorySimilarityTrain < 920.02 : train (27.28/18.02)
|   trajectorySimilarityTrain >= 920.02
|   |   accelerationFrequencyBandEnergy14To20Hz < 0.08
|   |   |   accelerationFrequencyBandEnergy10To14Hz < 0.07 : stationary (26.12/0)
|   |   |   accelerationFrequencyBandEnergy10To14Hz >= 0.07 : stationary (39/19)
|   |   accelerationFrequencyBandEnergy14To20Hz >= 0.08
|   |   |   accelerationFrequencyBandEnergy25To30Hz < 0.13 : stationary (193.22/0)
|   |   |   accelerationFrequencyBandEnergy25To30Hz >= 0.13
|   |   |   |   accelerationMedian < 0.04
|   |   |   |   |   acceleration95Quantile < 0.07
|   |   |   |   |   |   accelerationFrequencyBandEnergy27To28Hz < 0.02 : stationary (1.12/0.37)
|   |   |   |   |   |   accelerationFrequencyBandEnergy27To28Hz >= 0.02 : stationary (46.1/0)
|   |   |   |   |   acceleration95Quantile >= 0.07 : train (0.37/-0)
|   |   |   |   accelerationMedian >= 0.04 : train (3.25/1)`;


