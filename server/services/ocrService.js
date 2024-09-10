const aws = require('../config/awsConfig');
const { getKeyValueMap, getKeyValueRelationship } = require("../utils/ocrUtils");

const textract = new aws.Textract();

const processPassport = async (buffer) => {
  const params = {
    Document: { Bytes: buffer },
    FeatureTypes: ["FORMS"],
  };

  const data = await textract.analyzeDocument(params).promise();
  if (data && data.Blocks) {
    const { keyMap, valueMap, blockMap } = getKeyValueMap(data.Blocks);
    const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);
    return keyValues;
  }
  return undefined;
};

module.exports = { processPassport };
