const ALLOWED_STRICT_TYPES = ['string', 'number'];

class MatrixService {

    /**
     * Create an empty matrix.
     * @param   {number} rows
     * @param   {number} cols
     * @returns {any[][]}
     */
    static createEmpty(rows, cols) {
        if (typeof rows !== 'number' || isNaN(rows) || rows <= 0) {
            throw new Error(`Matrix.createEmpty: "rows"(${rows}) should be positive number`);
        }

        if (typeof cols !== 'number' || isNaN(cols) || cols <= 0) {
            throw new Error(`Matrix.createEmpty: "cols"(${cols}) should be positive number`);
        }

        const matrix = new Array(rows);

        for (let i = 0; i < rows; i++) {
            matrix[i] = new Array(cols);
        }

        return matrix;
    }

    /**
     * Create a new matrix from provided matrix.
     * @param   {any[][]} matrix
     * @returns {any[][]}
     */
    static copy(matrix) {
        if (!MatrixService.isMatrixValid(matrix)) {
            throw new Error('MatrixService.copy: "matrix" is invalid.')
        }

        const rows = matrix.length;
        const cols = matrix[0].length;

        const result = MatrixService.createEmpty(rows, cols);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] = matrix[i][j];
            }
        }

        return result;
    }

    /**
     * Set matrix value.
     * @param {any[][]} matrix 
     * @param {any} value 
     * @param {number} row 
     * @param {number} col 
     */
    static setValue(matrix, value, row, col) {
        const matrixRows = matrix.length;
        const matrixCols = matrix[0].length;

        if (typeof row !== 'number' || isNaN(row) || row < 0 || row >= matrixRows) {
            throw new Error(`MatrixService.setValue: "row"(${row}) should be number in matrix range`);
        }

        if (typeof col !== 'number' || isNaN(col) || col < 0 || col >= matrixCols) {
            throw new Error(`MatrixService.setValue: "col"(${col}) should be number in matrix range`);
        }

        matrix[row][col] = value;
    }

    /**
     * Check if matrix valid.
     * @param {any[][]} matrix
     * @return {boolean}
     */
     static isValid(matrix) {
        if (!Array.isArray(matrix)) {
            return false;
        }

        for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
            if (!Array.isArray(matrix[rowIndex]) || matrix[rowIndex].length !== matrix[0].length) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if matrix valid.
     * @param {any[][]} matrix
     * @param {'number'|'string'} [STRICT_TYPE]
     * @return {boolean}
     */
     static isValidStrict(matrix, STRICT_TYPE) {
        if (!ALLOWED_STRICT_TYPES.includes(STRICT_TYPE)) {
            throw new Error(`MatrixService.isValid: "STRICT_TYPE"(${STRICT_TYPE}) is not valid. Allowed: ${ALLOWED_STRICT_TYPES}`)
        }

        if (!Array.isArray(matrix)) {
            return false;
        }

        for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
            if (!Array.isArray(matrix[rowIndex]) || matrix[rowIndex].length !== matrix[0].length) {
                return false;
            }

            for (let colIndex = 0; colIndex < matrix[rowIndex].length; colIndex++) {
                if (typeof matrix[rowIndex][colIndex] !== STRICT_TYPE) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Check if matrix includes value
     * @param {any[][]} matrix 
     * @param {any} value 
     */
    static includes(matrix, value) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === value) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Get normilized matrix.
     * @param {number[]} matrix
     * @returns {number[][]}
     */
    static normalize(matrix) {
        if (this.isValidStrict(matrix, "number")) {
            throw new Error(`MatrixService.normalize: "matrix" is not valid.`);
        }

        const colSum = matrix.map(r => 0);
        matrix.forEach(r => r.forEach((c, ci) => colSum[ci] += c));
        return matrix.map(r => r.map((c, ci) => Number(c / colSum[ci]).toFixed(2)));
    }

}

export default MatrixService;