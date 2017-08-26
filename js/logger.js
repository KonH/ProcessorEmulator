var Logger = (function () {
    function Logger() {
    }
    Logger.write = function (context, msg) {
        console.log("[" + context + "] " + msg);
    };
    return Logger;
}());
