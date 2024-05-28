const bcrypt = require('bcrypt');


const hashContent = async (content) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(content, salt);

    return hash;
}


const compareHashes = async (content, hashedContent) => {
    const isMatch = await bcrypt.compare(content, hashedContent);
    return isMatch;
}

module.exports = {
    hashContent,
    compareHashes
}