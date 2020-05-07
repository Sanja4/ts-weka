import {DecisionTree} from '../model/decision-tree/decision-tree.model';
import {DecisionTreeLeaf} from '../model/decision-tree/decision-tree-leaf.model';
import {WekaTreeParserUtils} from './weka-tree-parser.utils';

describe('WekaTreeParserUtils', () => {

    describe('Binary Tree', () => {
        test('should parse a leaf (1)', () => {
            const testLeaf: string = `featureB >= 0.86 : classT (1.23/0.22)`;
            const result: DecisionTreeLeaf = WekaTreeParserUtils.parseLeaf(testLeaf);
            expect(result.predictedClass).toEqual('classT');
            expect(result.totalWeightCovered).toEqual(1.23);
            expect(result.totalWeightMisclassified).toEqual(0.22);
        });

        test('should parse a leaf (2)', () => {
            const testLeaf: string = `featureA < 0.49 : classT (71.53/0)`;
            const result: DecisionTreeLeaf = WekaTreeParserUtils.parseLeaf(testLeaf);
            expect(result.predictedClass).toEqual('classT');
            expect(result.totalWeightCovered).toEqual(71.53);
            expect(result.totalWeightMisclassified).toEqual(0);
        });

        test('should parse a tree (1)', () => {
            const result: DecisionTree = WekaTreeParserUtils.parse(binaryTreeString1);
            expect(result.splitValue).toEqual(0.86);
            expect(result.splitAttribute).toEqual('featureB');
            const leftChild: DecisionTree = result.children[0] as DecisionTree;
            expect(leftChild.splitAttribute).toEqual('featureA');
            expect(leftChild.splitValue).toEqual(0.49);
            expect((leftChild.children[0] as DecisionTreeLeaf).predictedClass).toEqual('classT');
            expect((leftChild.children[1] as DecisionTreeLeaf).predictedClass).toEqual('classB');

            const rightChild: DecisionTreeLeaf = result.children[1] as DecisionTreeLeaf;
            expect(rightChild.predictedClass).toEqual('classT');
            expect(rightChild.totalWeightCovered).toEqual(1.23);
            expect(rightChild.totalWeightMisclassified).toEqual(0.22);
        });

        test('should parse a tree (2)', () => {
            const result: DecisionTree = WekaTreeParserUtils.parse(binaryTreeString2);
            expect(result.splitValue).toEqual(4.99);
            expect(result.splitAttribute).toEqual('accumulatedTravelDistance');
            const leftChild: DecisionTree = result.children[0] as DecisionTree;
            expect(leftChild.splitAttribute).toEqual('accelerationFrequencyBandEnergy22To25Hz');
            expect(leftChild.splitValue).toEqual(0.09);
            expect((leftChild.children[0] as DecisionTreeLeaf).predictedClass).toEqual('classS');

            const rightChild: DecisionTree = result.children[1] as DecisionTree;
            expect(rightChild.splitAttribute).toEqual('trajectorySimilarityclassT');
            expect(rightChild.splitValue).toEqual(920.02);
        });
    });

    describe('Normal Tree', () => {
        test('should parse a leaf (1)', () => {
            const testLeaf: string = `humidity = HIGH : tennis (1.23/0.22)`;
            const result: DecisionTreeLeaf = WekaTreeParserUtils.parseLeaf(testLeaf);
            expect(result.predictedClass).toEqual('tennis');
            expect(result.totalWeightCovered).toEqual(1.23);
            expect(result.totalWeightMisclassified).toEqual(0.22);
        });

        test('should parse a tree (1)', () => {
            const root: DecisionTree = WekaTreeParserUtils.parse(normalTreeString1);
            expect(root.splitAttribute).toEqual('featureC');

            expect((root.splitValue as string[])[0]).toEqual('classS');
            expect((root.splitValue as string[])[1]).toEqual('classW');
            expect((root.splitValue as string[])[2]).toEqual('classB');
            expect((root.splitValue as string[])[3]).toEqual('classC');
            expect((root.splitValue as string[])[4]).toEqual('classB');
            expect((root.splitValue as string[])[5]).toEqual('classT2');
            expect((root.splitValue as string[])[6]).toEqual('classT');


            // ----- child1 -----
            const child1: DecisionTree = root.children[0] as DecisionTree;
            expect(child1.splitAttribute).toEqual('featureE');

            expect((child1.splitValue as string[])[0]).toEqual('classS');
            expect((child1.splitValue as string[])[1]).toEqual('classW');
            expect((child1.splitValue as string[])[2]).toEqual('classB');
            expect((child1.splitValue as string[])[3]).toEqual('classC');
            expect((child1.splitValue as string[])[4]).toEqual('classB');
            expect((child1.splitValue as string[])[5]).toEqual('classT2');
            expect((child1.splitValue as string[])[6]).toEqual('classT');

            expect((child1.children[0] as DecisionTreeLeaf).predictedClass).toEqual('classS');
            expect((child1.children[0] as DecisionTreeLeaf).totalWeightCovered).toEqual(361);
            expect((child1.children[0] as DecisionTreeLeaf).totalWeightMisclassified).toEqual(1);

            expect((child1.children[1] as DecisionTreeLeaf).predictedClass).toEqual('classS');
            expect((child1.children[1] as DecisionTreeLeaf).totalWeightCovered).toEqual(7);
            expect((child1.children[1] as DecisionTreeLeaf).totalWeightMisclassified).toEqual(2);

            expect((child1.children[3] as DecisionTree).splitAttribute).toEqual('featureD');
            expect((child1.children[3] as DecisionTree).children.length).toEqual(7);

            // ----- child2 -----
            const child2: DecisionTree = root.children[1] as DecisionTree;
            expect(child2.splitAttribute).toEqual('featureE');
            expect(child2.children.length).toEqual(7);
            expect(child2.splitValue[5]).toEqual('classT2');
            expect((child2.children[5] as DecisionTreeLeaf).predictedClass).toEqual('classB');
            expect((child2.children[5] as DecisionTreeLeaf).totalWeightCovered).toEqual(16);
            expect((child2.children[5] as DecisionTreeLeaf).totalWeightMisclassified).toEqual(2);
        });
    });
});

const binaryTreeString1: string = `featureB < 0.86
|   featureA < 0.49 : classT (71.53/0)
|   featureA >= 0.49 : classB (0.11/0)
featureB >= 0.86 : classT (1.23/0.22)`;

const binaryTreeString2: string = `accumulatedTravelDistance < 4.99
|   accelerationFrequencyBandEnergy22To25Hz < 0.09 : classS (431.61/0)
|   accelerationFrequencyBandEnergy22To25Hz >= 0.09
|   |   accelerationMean < 0.04
|   |   |   accelerationFrequencyBandEnergy25To30Hz < 0.14 : classS (12.74/1.78)
|   |   |   accelerationFrequencyBandEnergy25To30Hz >= 0.14 : classS (41.22/0)
|   |   accelerationMean >= 0.04 : classT (3.96/1)
accumulatedTravelDistance >= 4.99
|   trajectorySimilarityclassT < 920.02 : classT (27.28/18.02)
|   trajectorySimilarityclassT >= 920.02
|   |   accelerationFrequencyBandEnergy14To20Hz < 0.08
|   |   |   featureB < 0.07 : classS (26.12/0)
|   |   |   featureB >= 0.07 : classS (39/19)
|   |   accelerationFrequencyBandEnergy14To20Hz >= 0.08
|   |   |   accelerationFrequencyBandEnergy25To30Hz < 0.13 : classS (193.22/0)
|   |   |   accelerationFrequencyBandEnergy25To30Hz >= 0.13
|   |   |   |   accelerationMedian < 0.04
|   |   |   |   |   acceleration95Quantile < 0.07
|   |   |   |   |   |   accelerationFrequencyBandEnergy27To28Hz < 0.02 : classS (1.12/0.37)
|   |   |   |   |   |   accelerationFrequencyBandEnergy27To28Hz >= 0.02 : classS (46.1/0)
|   |   |   |   |   acceleration95Quantile >= 0.07 : classT (0.37/-0)
|   |   |   |   accelerationMedian >= 0.04 : classT (3.25/1)`;

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
