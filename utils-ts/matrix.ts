export type ALLOWED_STRICT_TYPES = 'number' | 'string';
export type Matrix = number[][];

export class MatrixService {

    /**
     * Create an empty matrix.
     */
    static createEmpty(rows: number, cols: number): Matrix {
        if (isNaN(rows) || rows <= 0) {
            throw new Error(`Matrix.createEmpty: "rows"(${rows}) should be positive number`);
        }

        if (isNaN(cols) || cols <= 0) {
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
     */
    static copy(matrix: Matrix): Matrix {
        if (!MatrixService.isValid(matrix)) {
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
     */
    static setValue(matrix: Matrix, value: any, row: number, col: number) {
        const matrixRows = matrix.length;
        const matrixCols = matrix[0].length;

        if (isNaN(row) || row < 0 || row >= matrixRows) {
            throw new Error(`MatrixService.setValue: "row"(${row}) should be number in matrix range`);
        }

        if (isNaN(col) || col < 0 || col >= matrixCols) {
            throw new Error(`MatrixService.setValue: "col"(${col}) should be number in matrix range`);
        }

        matrix[row][col] = value;
    }

    /**
     * Check if matrix valid.
     */
     static isValid(matrix: Matrix): boolean {
        for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
            if (!Array.isArray(matrix[rowIndex]) || matrix[rowIndex].length !== matrix[0].length) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if matrix includes value
     */
    static includes(matrix: Matrix, value: any): boolean {
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
     */
    static normalize(matrix: Matrix): Matrix {
        if (!MatrixService.isValid(matrix)) {
            throw new Error(`MatrixService.normalize: "matrix" is not valid.`);
        }

        const colSum = matrix.map(r => 0);
        matrix.forEach(r => r.forEach((c, ci) => colSum[ci] += c));
        return matrix.map(r => r.map((c, ci) => Number((c / colSum[ci]).toFixed(2)) ));
    }

}