import {Matrix, MatrixService} from './matrix';
import {Logger} from './logger';

/*
    Find optimal choice by item total rate.

    ╔═══╦═══╗
    ║   ║   ║
    ╠═══╬═══╣
    ║   ║   ║
    ╚═══╩═══╝

    1. You need to provide a matrix with item parameters rate.
    ROWS: Items
    COLUMNS: Parameter rates
    [
        [10, 15, 10],
        [22, 20, 34],
    ]
    Example:
    ╔═════╦══════╦══════╦══════╦══════
    ║  №  ║  P1  ║  P2  ║  P3  ║  ..  
    ╠═════╬══════╬══════╣══════╣══════
    ║  1  ║  10  ║  15  ║  12  ║  ..  
    ╠═════╬══════╬══════╣══════╣══════
    ║  2  ║  22  ║  20  ║  18  ║  ..  
    ╠═════╬══════╬══════╣══════╣══════
    ║  .  ║  ..  ║  ..  ║  ..  ║  ..  


    2. You need to provide a list of parameter weights.
    [3, 1, 2]
    Example: (W — weight)
    ╔═════╦══════╦══════╦══════╦══════
    ║     ║  P1  ║  P2  ║  P3  ║  ..  
    ╠═════╬══════╬══════╣══════╣══════
    ║  W  ║  10  ║  15  ║  12  ║  ..  
    ╚═════╩══════╩══════╩══════╩══════

    3. It multiplies parameters with their weight

    4. It calculates total rate for item: the sum of all parameters values

    5. Returns the index of items with max total rate.

*/
export class AssessmentByTotalRateService {

    public static findOptimalChoice(itemsParameters: Matrix, parameterWeights: number[]): number {

        const s1 = `${this.name}.findOptimalChoice: Step 1 - Validation`;
        Logger.info(`${s1} - started`);
        if (!MatrixService.isValid(itemsParameters)) {
            const message = `${this.name}.findOptimalChoice: "itemsParameters" is not valid matrix.`;
            Logger.error(message, itemsParameters);
            throw new Error(message);
        }
        if (itemsParameters[0].length !== parameterWeights.length) {
            const message = `${this.name}.findOptimalChoice: number of parameters and "parameterWeights" are inconsistent`;
            Logger.error(message, itemsParameters);
            throw new Error(message);
        }
        Logger.info(`${s1} - done`);


        const s2 = `${this.name}.findOptimalChoice: Step 2 - Actual parameters`;
        Logger.info(`${s2} - started`);
        const actualItemParameters = this.calculateActualItemsParameters(
            itemsParameters, parameterWeights
        );
        Logger.info(`${s2} - done`, { actualItemParameters });


        const s3 = `${this.name}.findOptimalChoice: Step 3 - Total rates`;
        Logger.info(`${s3} - started`);
        const itemTotalRates = this.calculateItemsTotalRates(actualItemParameters);
        Logger.info(`${s3} - done`, { itemTotalRates });


        const s4 = `${this.name}.findOptimalChoice: Step 4 - Max total rate`;
        Logger.info(`${s4} - started`);
        const itemIndexWithMaxTotalRate = this.getItemIndexWithMaxTotalRate(itemTotalRates);
        Logger.info(`${s4} - done`, { itemIndexWithMaxTotalRate });

        return itemIndexWithMaxTotalRate;
    }

    private static getItemIndexWithMaxTotalRate(itemsTotalRates: number[]): number {
        let itemIndex = 0;
        let maxTotalRate = 0;

        itemsTotalRates.forEach((itemTotalRate, index) => {
            if (itemTotalRate > maxTotalRate) {
                maxTotalRate = itemTotalRate
                itemIndex = index;
            }
        })

        return itemIndex;
    }

    private static calculateItemsTotalRates(actualItemParameters: Matrix): number[] {
        return actualItemParameters.map((singleItemParameters: number[]) => 
            singleItemParameters.reduce((total, parameter) => total += parameter, 0)
        );
    }

    private static calculateActualItemsParameters(itemsParameters: Matrix, parameterWeights: number[]): Matrix {
        return itemsParameters.map((singleItemParameters) => 
            this.calculateActualSingleItemParameters(singleItemParameters, parameterWeights)
        );
    }

    private static calculateActualSingleItemParameters(itemParameters: number[], parameterWeights: number[]): number[] {
        return itemParameters.map((parameter, index) =>
            this.calculateActualParameter(parameter, parameterWeights[index])
        );
    }

    private static calculateActualParameter(parameter: number, weight: number): number {
        return parameter * weight;
    }
}