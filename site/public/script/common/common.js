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

function getFormFieldsFromModel(model, formItem) {
    var formFields = [];
    
    for (var fieldName in model) {
        var modelField = model[fieldName];
        var fieldValue = formItem && formItem[fieldName] || '';
        console.log('>>>', fieldName, modelField);
        var formField = getFormField(fieldName, modelField, fieldValue);
        formFields.push(formField);
    }
    
    /*
    formFields.push({
        type: "HtmlInput",
        data: {
            label: "Student",
            "placeholder": "Student Name"
        }
    });
    formFields.push({
        type: "HtmlSelect",
        data: {
            label: "Grade",
            value: "grade1",
            options: [
                { id:"blank", display:"" },
                { id:"grade1", display:"grade 1" },
                { id:"grade2", display:"grade 2" },
                { id:"grade3", display:"grade 3" }
            ]
        }
    });
    */
    
    return formFields;
}

function getFormField(fieldName, modelField, fieldValue) {
    var formField = null;
    
    formField = {
        type: 'HtmlInput',
        data: {
            label: fieldName,
            value: fieldValue,
            placeholder: ''
        }
    };
    
    return formField;
}