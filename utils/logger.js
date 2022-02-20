module.exports = class Logger {

    /**
     * Logs message with data
     * @param {string} message 
     * @param {any}    [data] 
     */
    static log(message, data) {
        console.log(message, data);
    }

    /**
     * Logs WARN message with data
     * @param {string} message 
     * @param {any}    [data] 
     */
    static warn(message, data) {
        console.warn(message, data);
    }

    /**
     * Logs INFO message with data
     * @param {string} message 
     * @param {any}    [data] 
     */
    static info(message, data) {
        console.info(message, data);
    }
    

    /**
     * Logs ERROR message with data
     * @param {string} message 
     * @param {any}    [data] 
     */
    static error(message, data) {
        console.error(message, data);
    }

}
