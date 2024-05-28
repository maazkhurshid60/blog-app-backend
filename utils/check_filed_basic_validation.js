

const checkBasicValidation = (fieldName) => {

    if(fieldName === undefined || fieldName === null || fieldName === "") {
        return true;
    } 

    return false;

}

const checkStringDataType = (fieldName) => {
    return typeof fieldName === 'string' ? true : false
}

module.exports = {
    checkBasicValidation,
    checkStringDataType
}