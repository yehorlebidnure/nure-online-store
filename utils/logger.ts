export class Logger {

    static log(message: string, data?: any) {
        console.log(message, data);
    }

    static warn(message: string, data?: any) {
        console.warn(message, data);
    }

    static info(message: string, data?: any) {
        console.info(message, data);
    }

    static error(message: string, data?: any) {
        console.error(message, data);
    }

}
