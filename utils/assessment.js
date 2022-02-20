import MatrixService from "./matrix";
import Logger from "./logger";

class AssesmentService {

    /**
     * Finds index of optimal choice (column number).
     * @param {number[][]} criteriaMatrix
     * @param {number[][]} featuresMatrix
     * 
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
    static findOptimalChoice(criteriaMatrix, featuresMatrix) {
        if (!MatrixService.isValidStrict(featuresMatrix, 'number') || MatrixService.includes(featuresMatrix, 0)) {
            const message = `AssesmentService.run: "featuresMatrix" is not valid matrix.`;
            Logger.error(message, featuresMatrix);
            throw new Error(message);
        }

        if (!MatrixService.isValidStrict(criteriaMatrix, 'number')) {
            const message = `AssesmentService.run: "criteriaMatrix" is not valid matrix.`;
            Logger.error(message, criteriaMatrix);
            throw new Error(message);
        }
        Logger.log(`AssessmentService.findOptimalChoice: Step 1 - Validation: Done`);

        const criteriaOPRVector = AssesmentService._buildOPRVector(criteriaMatrix);
        const featureOPRVectors = featuresMatrix.map((feature) => {
            const featureMatrix = AssesmentService._buildFeatureMatrix(feature);
            return AssesmentService._buildOPRVector(featureMatrix);
        });
        Logger.log(`AssessmentService.findOptimalChoice: Step 2 - Building OPR vectors: Done`, {
            criteriaOPRVector,
            featureOPRVectors,
        });


        const W = AssesmentService._getRelWeightFactorsOfAlt(
            featuresMatrix[0].length,
            criteriaOPRVector,
            featureOPRVectors,
        );
        Logger.log(`AssessmentService.findOptimalChoice: Step 3 - Alternatives calculation: Done`, {
            result: W
        });

        const optimalChoiceIndex = AssesmentService._findMaxValueIdx(W)
        Logger.log(`AssessmentService.findOptimalChoice: Step 4 - Optimal choice search: Done`, {
            result: optimalChoiceIndex
        });

        return optimalChoiceIndex;
    }

    /**
     * Calculates real weight factor of alternatives.
     * @param   {number}     numberOfAlternatives 
     * @param   {number[]}   criteriaOPRVector 
     * @param   {number[][]} featureOPRVectors 
     * @returns {number[]}   Result
     */
    static _getRelWeightFactorsOfAlt(numberOfAlternatives, criteriaOPRVector, featureOPRVectors,) {
        const W = [];
        for (let i = 0; i < numberOfAlternatives; i++) {
            const value = criteriaOPRVector.reduce((p, c, idx) => p + c * featureOPRVectors[idx][i], 0);
            W.push(value);
        }
        return W;
    }

    /**
     * Find index of max value in a row.
     * @param   {number[]} row 
     * @returns {number}
     */
    static _findMaxValueIdx(row) {
        const max = Math.max(...row);
        return row.indexOf(max);
    }

    /**
     * Builds OPR vector from matrix.
     * @param   {number[][]} matrix
     * @returns {number[]}
     */
    static _buildOPRVector(matrix) {
        const normalizedMatrix = MatrixService.normalize(matrix);
        return normalizedMatrix.map(row => AssesmentService._getAvg(row));
    }

    /**
     * Calculates AVG for row.
     * @param   {number[]} row
     * @returns {number}
     */
    static _getAvg(row) {
        const avg = row.reduce((prev, cur) => prev + cur) / row.length;
        return avg.toFixed(2);
    }

    /**
     * Builds features matrix from feature row.
     * @param   {number[]} row
     * @returns {number[][]}
     */
    static _buildFeatureMatrix(row) {
        return row.map(cur => row.map(val => Number(cur / val).toFixed(2)));
    }

}

export default AssesmentService;