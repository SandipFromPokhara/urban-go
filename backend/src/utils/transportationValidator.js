// backend/src/utils/transportationValidator.js

const isValidInput = (text) => {
    if (!text || text.trim().length < 2) return false;
    
    const validText = /^[a-zA-ZäöåÄÖÅ0-9.,/' -]+$/;
    return validText.test(text.trim());
};

module.exports = { isValidInput} ;