
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

const normalTreeString2: string = `predictionShort = stationary
|   predictionLong = stationary : stationary (361/1)
|   predictionLong = walk : stationary (7/2)
|   predictionLong = bike : stationary (3/0)
|   predictionLong = car
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : car (1/0)
|   |   predictionMedium = bus : stationary (26/7)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
|   predictionLong = bus : stationary (19/4)
|   predictionLong = tram
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : stationary (2/1)
|   |   predictionMedium = bus : stationary (41/10)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
|   predictionLong = train
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : stationary (2/0)
|   |   predictionMedium = bus : stationary (81/36)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
predictionShort = walk
|   predictionLong = stationary : walk (197/0)
|   predictionLong = walk : walk (640/2)
|   predictionLong = bike : walk (25/0)
|   predictionLong = car : walk (52/1)
|   predictionLong = bus : walk (11/0)
|   predictionLong = tram : bike (16/2)
|   predictionLong = train : bike (1/0)
predictionShort = bike : bike (65/0)
predictionShort = car
|   predictionLong = stationary : tram (2/0)
|   predictionLong = walk : stationary (0/0)
|   predictionLong = bike : bus (5/2)
|   predictionLong = car
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : car (438/15)
|   |   predictionMedium = bus : car (289/47)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
|   predictionLong = bus
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : bus (22/8)
|   |   predictionMedium = bus : bus (32/15)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
|   predictionLong = tram
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : bike (41/6)
|   |   predictionMedium = bus : stationary (11/8)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
|   predictionLong = train
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : bike (14/5)
|   |   predictionMedium = bus : train (12/2)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
predictionShort = bus
|   predictionMedium = stationary : stationary (0/0)
|   predictionMedium = walk : stationary (0/0)
|   predictionMedium = bike : stationary (0/0)
|   predictionMedium = car
|   |   predictionLong = stationary : train (3/1)
|   |   predictionLong = walk : stationary (3/1)
|   |   predictionLong = bike : bus (10/2)
|   |   predictionLong = car : bus (89/33)
|   |   predictionLong = bus : bus (69/6)
|   |   predictionLong = tram : bike (173/13)
|   |   predictionLong = train : bike (67/4)
|   predictionMedium = bus
|   |   predictionLong = stationary : stationary (8/4)
|   |   predictionLong = walk : stationary (0/0)
|   |   predictionLong = bike : stationary (3/0)
|   |   predictionLong = car : bus (172/51)
|   |   predictionLong = bus : bus (217/33)
|   |   predictionLong = tram : bus (66/44)
|   |   predictionLong = train : train (77/31)
|   predictionMedium = tram : stationary (0/0)
|   predictionMedium = train : stationary (0/0)
predictionShort = tram
|   predictionLong = stationary : stationary (0/0)
|   predictionLong = walk : stationary (0/0)
|   predictionLong = bike : stationary (0/0)
|   predictionLong = car : stationary (14/9)
|   predictionLong = bus
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : tram (1/0)
|   |   predictionMedium = bus : tram (30/10)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
|   predictionLong = tram : tram (104/11)
|   predictionLong = train
|   |   predictionMedium = stationary : stationary (0/0)
|   |   predictionMedium = walk : stationary (0/0)
|   |   predictionMedium = bike : stationary (0/0)
|   |   predictionMedium = car : tram (2/0)
|   |   predictionMedium = bus : tram (50/25)
|   |   predictionMedium = tram : stationary (0/0)
|   |   predictionMedium = train : stationary (0/0)
predictionShort = train
|   predictionMedium = stationary : stationary (0/0)
|   predictionMedium = walk : stationary (0/0)
|   predictionMedium = bike : stationary (0/0)
|   predictionMedium = car : car (19/10)
|   predictionMedium = bus
|   |   predictionLong = stationary : stationary (18/7)
|   |   predictionLong = walk : stationary (0/0)
|   |   predictionLong = bike : stationary (1/0)
|   |   predictionLong = car : train (13/0)
|   |   predictionLong = bus : train (17/8)
|   |   predictionLong = tram : stationary (20/9)
|   |   predictionLong = train : train (239/21)
|   predictionMedium = tram : stationary (0/0)
|   predictionMedium = train : stationary (0/0)`;


