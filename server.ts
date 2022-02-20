import {AssesmentService} from './utils/assessment';
import { Matrix } from './utils/matrix';

const criteriaMatrix: Matrix = [
  [1, 0.333, 0.5, 0.5],   // Feature 1 Weight
  [3, 1,     2,   3  ],   // Feature 2 Weight
  [2, 0.5,   1,   0.5],   // Feature 3 Weight
  [2, 0.333, 2,   1  ]    // Feature 4 Weight
];

const featuresMatrix: Matrix = [
  [25,   24,   23,   23],  // Feature 1 values
  [10,   12,   4,    8 ],  // Feature 2 values
  [5,    3,    4,    5 ],  // Feature 3 values
  [4,    2,    7,    4 ]   // Feature 4 values
];

const result = AssesmentService.findOptimalChoice(criteriaMatrix, featuresMatrix);

console.log('Result', result);