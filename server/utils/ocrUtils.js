const _ = require("lodash");

// Helper function to extract text from a block
const getText = (result, blocksMap) => {
  let text = "";
  if (_.has(result, "Relationships")) {
    result.Relationships.forEach((relationship) => {
      if (relationship.Type === "CHILD") {
        relationship.Ids.forEach((childId) => {
          const word = blocksMap[childId];
          if (word.BlockType === "WORD") {
            text += `${word.Text} `;
          }
          if (word.BlockType === "SELECTION_ELEMENT" && word.SelectionStatus === "SELECTED") {
            text += "X";
          }
        });
      }
    });
  }
  return text.trim();
};

// Correct OCR errors (customizable)
const correctOcrErrors = (text) => {
  return text.replace(/([A-Z]) 1/g, "$1"); // Example of correcting specific OCR errors
};

// Correct OCR errors (customizable)
const correctOcrErrors1 = (text) => {
  return text.replace(/.*\/\s*/, "");
};

// Helper function to find the value block corresponding to a key block
const findValueBlock = (keyBlock, valueMap) => {
  let valueBlock;
  keyBlock.Relationships.forEach((relationship) => {
    if (relationship.Type === "VALUE") {
      relationship.Ids.every((valueId) => {
        if (_.has(valueMap, valueId)) {
          valueBlock = valueMap[valueId];
          return false; // Break loop when value block is found
        }
      });
    }
  });
  return valueBlock;
};

// Get key-value relationships from the keyMap, valueMap, and blockMap
const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
  const keyValues = {};
  const keyMapValues = _.values(keyMap);
  keyMapValues.forEach((keyMapValue) => {
    const valueBlock = findValueBlock(keyMapValue, valueMap);
    let key = getText(keyMapValue, blockMap);
    let value = getText(valueBlock, blockMap);
    key = correctOcrErrors1(key);
    value = correctOcrErrors(value);
    keyValues[key] = value;
  });
  return keyValues;
};

// Get keyMap, valueMap, and blockMap from blocks
const getKeyValueMap = (blocks) => {
  const keyMap = {};
  const valueMap = {};
  const blockMap = {};
  let blockId;
  blocks.forEach((block) => {
    blockId = block.Id;
    blockMap[blockId] = block;
    if (block.BlockType === "KEY_VALUE_SET") {
      if (_.includes(block.EntityTypes, "KEY")) {
        keyMap[blockId] = block;
      } else {
        valueMap[blockId] = block;
      }
    }
  });
  return { keyMap, valueMap, blockMap };
};

module.exports = { getText, correctOcrErrors, correctOcrErrors1, findValueBlock, getKeyValueRelationship, getKeyValueMap };
