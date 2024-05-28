

const extensionValidator = (ext) => {
    const arrayOfValidExtensions = ['jpg', 'png', 'jpeg', 'gif'];
    return arrayOfValidExtensions.find((ex) => ex === ext) !== undefined ? true : false;
}


module.exports = {
    extensionValidator
}