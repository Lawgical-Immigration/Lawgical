const { fillPdfForm } = require("../utils/pdfUtils");

const processPdf = async (inputPdfPath, outputPdfPath, formData, fieldMapping) => {
  await fillPdfForm(inputPdfPath, outputPdfPath, formData, fieldMapping);
  return outputPdfPath;
};

module.exports = { processPdf };
