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
        var formField = getFormField(fieldName, modelField, fieldValue);
        formFields.push(formField);
    }
    return formFields;
}

function getFormField(fieldName, modelField, fieldValue) {
    var formField = null;
    if (modelField.values && modelField.values.length > 0) {
        // use HtmlSelect if model has values
        formField = {
            type: 'HtmlSelect',
            data: {
                label: fieldName,
                value: fieldValue,
                options: getSelectOptions(modelField.values)
            }
        };
    } else if (modelField.type === 'array' || modelField.type === 'object') {
        // use HtmlJsonEdit if model type is array or object
        formField = {
            type: 'HtmlJsonEdit',
            data: {
                label: fieldName,
                value: fieldValue
            }
        };
    } else {
        formField = {
            type: 'HtmlInput',
            data: {
                label: fieldName,
                value: fieldValue,
                placeholder: ''
            }
        };
    }
    return formField;
}

function getSelectOptions(fieldValues) {
    var selectOptions = [];
    for (var i = 0; i < fieldValues.length; i++) {
        var fieldValue = fieldValues[i];
        var selectOption = null;
        if (typeof fieldValue === 'string') {
            selectOption = { id:fieldValue, display:fieldValue };
        } else if (typeof fieldValue === 'object') {
            selectOption = fieldValue;
        }
        if (selectOption) {
            selectOptions.push(selectOption);
        }
    }
    return selectOptions;
}