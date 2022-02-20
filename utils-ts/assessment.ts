import {MatrixService, Matrix} from './matrix';
import {Logger} from './logger';

export class AssesmentService {

    /**
     * Finds index of optimal choice (column number).
     * @description
     * criteriaMatrix = [
     *   [1, 0.333, 0.5, 0.5],   // Feature 1 Weight
     *   [3, 1,     2,   3  ],   // Feature 2 Weight
     *   [2, 0.5,   1,   0.5],   // Feature 3 Weight
     *   [2, 0.333, 2,   1  ]    // Feature 4 Weight
     * ];
     *
     * featuresMatrix = [
     *   |Alt 1|Alt 2|Alt 3|Alt 4
     *   [25,   24,   23,   23],  // Feature 1 values
     *   [10,   12,   4,    8 ],  // Feature 2 values
     *   [5,    3,    4,    5 ],  // Feature 3 values
     *   [4,    2,    7,    4 ]   // Feature 4 values
     * ];
     */
    static findOptimalChoice(criteriaMatrix: Matrix, featuresMatrix: Matrix): number {
        if (!MatrixService.isValid(featuresMatrix) || MatrixService.includes(featuresMatrix, 0)) {
            const message = `AssesmentService.run: "featuresMatrix" is not valid matrix.`;
            Logger.error(message, featuresMatrix);
            throw new Error(message);
        }

        if (!MatrixService.isValid(criteriaMatrix)) {
            const message = `AssesmentService.run: "criteriaMatrix" is not valid matrix.`;
            Logger.error(message, criteriaMatrix);
            throw new Error(message);
        }
        Logger.info(`AssessmentService.findOptimalChoice: Step 1 - Validation: Done`);

        const criteriaOPRVector = AssesmentService._buildOPRVector(criteriaMatrix);
        const featureOPRVectors = featuresMatrix.map((feature) => {
            const featureMatrix = AssesmentService._buildFeatureMatrix(feature);
            return AssesmentService._buildOPRVector(featureMatrix);
        });
        Logger.info(`AssessmentService.findOptimalChoice: Step 2 - Building OPR vectors: Done`, {
            criteriaOPRVector,
            featureOPRVectors,
        });


        const W = AssesmentService._getRelWeightFactorsOfAlt(
            featuresMatrix[0].length,
            criteriaOPRVector,
            featureOPRVectors,
        );
        Logger.info(`AssessmentService.findOptimalChoice: Step 3 - Alternatives calculation: Done`, {
            result: W
        });

        const optimalChoiceIndex = AssesmentService._findMaxValueIdx(W)
        Logger.info(`AssessmentService.findOptimalChoice: Step 4 - Optimal choice search: Done`, {
            result: optimalChoiceIndex
        });

        return optimalChoiceIndex;
    }

    /**
     * Calculates real weight factor of alternatives.
     */
    static _getRelWeightFactorsOfAlt(
        numberOfAlternatives: number,
        criteriaOPRVector: number[],
        featureOPRVectors: Matrix
    ): number[] {
        const W = [];
        for (let i = 0; i < numberOfAlternatives; i++) {
            const value = criteriaOPRVector.reduce((p, c, idx) => p + c * featureOPRVectors[idx][i], 0);
            W.push(value);
        }
        return W;
    }

    /**
     * Find index of max value in a row.
     */
    static _findMaxValueIdx(row: number[]): number {
        const max = Math.max(...row);
        return row.indexOf(max);
    }

    /**
     * Builds OPR vector from matrix.
     */
    static _buildOPRVector(matrix: Matrix): number[] {
        const normalizedMatrix = MatrixService.normalize(matrix);
        return normalizedMatrix.map(row => AssesmentService._getAvg(row));
    }

    /**
     * Calculates AVG for row.
     */
    static _getAvg(row: number[]): number {
        const avg = row.reduce((prev, cur) => prev + cur) / row.length;
        return Number(avg.toFixed(2));
    }

    /**
     * Builds features matrix from feature row.
     */
    static _buildFeatureMatrix(row: number[]): Matrix {
        return row.map(cur => row.map(val => Number((cur / val).toFixed(2)) ));
    }

}