class Logger {

    /**
     * Logs INFO message with data
     * @param {string} message 
     * @param {any} data 
     */
    static log(message, data) {
        console.log(message, data);
    }

    /**
     * Logs ERROR message with data
     * @param {string} message 
     * @param {any} data 
     */
    static error(message, data) {
        console.error(message, data);
    }

}

export default Logger;