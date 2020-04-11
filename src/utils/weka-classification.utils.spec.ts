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
});

const treeString1: string = `accelerationFrequencyBandEnergy10To14Hz < 0.86
|   accelerationFrequencyBandEnergy8To10Hz < 0.49 : train (71.53/0)
|   accelerationFrequencyBandEnergy8To10Hz >= 0.49 : bus (0.11/0)
accelerationFrequencyBandEnergy10To14Hz >= 0.86 : train (1.23/0.22)`;




