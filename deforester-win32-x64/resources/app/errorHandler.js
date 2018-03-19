//this allows us to write to the same log file as the main process, but we only want to use it if we are running
//the index file with electron. If we call it without checking if require is undefined it will throw an
//error in the web browser
var logger;
if(typeof require != "undefined") {
    logger = require("electron-log");
}
function electronLog(level, message) {
    if(typeof require != "undefined") {
        switch(level) {
            case "info":
                logger.info(message);
                break;
            case "error":
                logger.error(message);
                break;
        }
    }
}

window.onerror = function(msg, url, line, col, error) {
    //some browsers dont have the col and error
    var extra = !col ? '' : ' -column: ' + col;
    extra += !error ? '' : ' -error: ' + error;
    var errorMessage = "Error: " + msg + " -url: " + url + " -line: " + line + extra
    //even though this is the renderer process, game does not exist yet so we will just load in the electron log here first
    //There could possibly be an error with the game, so better to have this early
    electronLog("error", errorMessage);
    vex.dialog.open({
        message: errorMessage,
		input: '<input type="hidden" name="errorMessage" value="' + errorMessage + '">',
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: 'Send and Exit' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Exit' })
        ],
        callback: function (data) {
            if(typeof require != "undefined") {
				//data is false if they click the no button
                if (data) {
					require('./mailer').sendErrorEmailAndQuit(data.errorMessage);
                } else {
                	require('electron').remote.app.quit();
				}
            }
        }
    });

    var suppressErrorAlert = true;
    //supresses error messages in old browsers
    return suppressErrorAlert;
};