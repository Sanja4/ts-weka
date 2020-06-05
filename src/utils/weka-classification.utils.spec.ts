import {WekaTreeParserUtils} from './weka-tree-parser.utils';
import {WekaClassificationUtils} from './weka-classification.utils';
import {DecisionTree} from '../model/decision-tree/decision-tree.model';
import {Features} from '../model/features.model';
import {Vote} from '../model/vote.model';

describe('WekaClassificationUtils', () => {

    test('should classify an instance as classT', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(treeString1);
        const features: Features = new Features();
        features.featureB = 0.9;

        const result: Vote = WekaClassificationUtils.classify(features, decisionTree);
        expect(result.class).toEqual('classT');
    });

    test('should classify an instance as classB', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(treeString1);
        const features: Features = new Features();
        features.featureB = 0.8;
        features.featureA = 0.5;

        const result: Vote = WekaClassificationUtils.classify(features, decisionTree);
        expect(result.class).toEqual('classB');
    });

    test('should classify an instance as classS', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(normalTreeString1);
        const features: Features = new Features();
        features.featureC = 'classS';
        features.featureE = 'classS';

        const result: Vote = WekaClassificationUtils.classify(features, decisionTree);
        expect(result.class).toEqual('classS');
    });

    test('should classify an instance as classC', () => {
        const decisionTree: DecisionTree = WekaTreeParserUtils.parse(normalTreeString1);
        const features: Features = new Features();
        features.featureC = 'classS';
        features.featureE = 'classC';
        features.featureD = 'classC';

        const result: Vote = WekaClassificationUtils.classify(features, decisionTree);
        expect(result.class).toEqual('classC');
    });
});

const treeString1: string = `featureB < 0.86
|   featureA < 0.49 : classT (71.53/0)
|   featureA >= 0.49 : classB (0.11/0)
featureB >= 0.86 : classT (1.23/0.22)`;

const normalTreeString1: string = `featureC = classS
|   featureE = classS : classS (361/1)
|   featureE = classW : classS (7/2)
|   featureE = classB : classS (3/0)
|   featureE = classC
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classC (1/0)
|   |   featureD = classB : classS (26/7)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
|   featureE = classB : classS (19/4)
|   featureE = classT2
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classS (2/1)
|   |   featureD = classB : classS (41/10)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
|   featureE = classT
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classS (2/0)
|   |   featureD = classB : classS (81/36)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
featureC = classW
|   featureE = classS : classW (197/0)
|   featureE = classW : classW (640/2)
|   featureE = classB : classW (25/0)
|   featureE = classC : classW (52/1)
|   featureE = classB : classW (11/0)
|   featureE = classT2 : classB (16/2)
|   featureE = classT : classB (1/0)
featureC = classB : classB (65/0)
featureC = classC
|   featureE = classS : classT2 (2/0)
|   featureE = classW : classS (0/0)
|   featureE = classB : classB (5/2)
|   featureE = classC
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classC (438/15)
|   |   featureD = classB : classC (289/47)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
|   featureE = classB
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classB (22/8)
|   |   featureD = classB : classB (32/15)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
|   featureE = classT2
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classB (41/6)
|   |   featureD = classB : classS (11/8)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
|   featureE = classT
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classB (14/5)
|   |   featureD = classB : classT (12/2)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
featureC = classB
|   featureD = classS : classS (0/0)
|   featureD = classW : classS (0/0)
|   featureD = classB : classS (0/0)
|   featureD = classC
|   |   featureE = classS : classT (3/1)
|   |   featureE = classW : classS (3/1)
|   |   featureE = classB : classB (10/2)
|   |   featureE = classC : classB (89/33)
|   |   featureE = classB : classB (69/6)
|   |   featureE = classT2 : classB (173/13)
|   |   featureE = classT : classB (67/4)
|   featureD = classB
|   |   featureE = classS : classS (8/4)
|   |   featureE = classW : classS (0/0)
|   |   featureE = classB : classS (3/0)
|   |   featureE = classC : classB (172/51)
|   |   featureE = classB : classB (217/33)
|   |   featureE = classT2 : classB (66/44)
|   |   featureE = classT : classT (77/31)
|   featureD = classT2 : classS (0/0)
|   featureD = classT : classS (0/0)
featureC = classT2
|   featureE = classS : classS (0/0)
|   featureE = classW : classS (0/0)
|   featureE = classB : classS (0/0)
|   featureE = classC : classS (14/9)
|   featureE = classB
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classT2 (1/0)
|   |   featureD = classB : classT2 (30/10)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
|   featureE = classT2 : classT2 (104/11)
|   featureE = classT
|   |   featureD = classS : classS (0/0)
|   |   featureD = classW : classS (0/0)
|   |   featureD = classB : classS (0/0)
|   |   featureD = classC : classT2 (2/0)
|   |   featureD = classB : classT2 (50/25)
|   |   featureD = classT2 : classS (0/0)
|   |   featureD = classT : classS (0/0)
featureC = classT
|   featureD = classS : classS (0/0)
|   featureD = classW : classS (0/0)
|   featureD = classB : classS (0/0)
|   featureD = classC : classC (19/10)
|   featureD = classB
|   |   featureE = classS : classS (18/7)
|   |   featureE = classW : classS (0/0)
|   |   featureE = classB : classS (1/0)
|   |   featureE = classC : classT (13/0)
|   |   featureE = classB : classT (17/8)
|   |   featureE = classT2 : classS (20/9)
|   |   featureE = classT : classT (239/21)
|   featureD = classT2 : classS (0/0)
|   featureD = classT : classS (0/0)`;




