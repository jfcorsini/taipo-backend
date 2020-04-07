const AWS = require('aws-sdk');

const translator = new AWS.Translate();

const translate = async (content, sourceLang = 'en', destLang = 'fi') => {
  const params = {
    Text: content,
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: destLang,
  };

  try {
    const translated = await translator.translateText(params).promise();
    
    return {
      text: translated.TranslatedText,
      language: destLang,
    };
  } catch (error) {
    console.error(error, 'Failed to translate');
    return null;
  }
};

module.exports = {
  translate,
};
