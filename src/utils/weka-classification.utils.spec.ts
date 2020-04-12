import {WekaTreeParserUtils} from './weka-tree-parser.utils.';
import {WekaClassificationUtils} from './weka-classification.utils';
import {DecisionTree} from '../model/decision-tree/decision-tree.model';
import {Features} from '../model/features.model';

describe('WekaClassificationUtils', () => {

    test('should classify an instance as train', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(treeString1);
        const features: Features = new Features();
        features.accelerationFrequencyBandEnergy10To14Hz = 0.9;

        const result: string = WekaClassificationUtils.classify(features, decisionTree);
        expect(result).toEqual('train');
    });

    test('should classify an instance as bus', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(treeString1);
        const features: Features = new Features();
        features.accelerationFrequencyBandEnergy10To14Hz = 0.8;
        features.accelerationFrequencyBandEnergy8To10Hz = 0.5;

        const result: string = WekaClassificationUtils.classify(features, decisionTree);
        expect(result).toEqual('bus');
    });

    test('should classify an instance as stationary', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(normalTreeString1);
        const features: Features = new Features();
        features.predictionShort = 'stationary';
        features.predictionLong = 'stationary';

        const result: string = WekaClassificationUtils.classify(features, decisionTree);
        expect(result).toEqual('stationary');
    });

    test('should classify an instance as car', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(normalTreeString1);
        const features: Features = new Features();
        features.predictionShort = 'stationary';
        features.predictionLong = 'car';
        features.predictionMedium = 'car';

        const result: string = WekaClassificationUtils.classify(features, decisionTree);
        expect(result).toEqual('car');
    });
});

const treeString1: string = `accelerationFrequencyBandEnergy10To14Hz < 0.86
|   accelerationFrequencyBandEnergy8To10Hz < 0.49 : train (71.53/0)
|   accelerationFrequencyBandEnergy8To10Hz >= 0.49 : bus (0.11/0)
accelerationFrequencyBandEnergy10To14Hz >= 0.86 : train (1.23/0.22)`;

const normalTreeString1: string = `predictionShort = stationary
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




