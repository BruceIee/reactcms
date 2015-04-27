// common script

getJsonFromText = function(inputText) {
    var jsonResult = null;
    if (inputText) {
        try {
            jsonResult = JSON.parse(inputText);
        } catch(e) {
            console.log('Error in getJsonFromText:', e, ',inputText:', inputText);
        }
    }
    return jsonResult;
};
