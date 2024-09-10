const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const fillPdfForm = async (inputPdfPath, outputPdfPath, formData, fieldMapping) => {
  const existingPdfBytes = fs.readFileSync(inputPdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  Object.keys(formData).forEach((key) => {
    const fieldName = fieldMapping[key];
    if (fieldName) {
      const field = form.getTextField(fieldName);
      if (field) {
        field.setText(formData[key]);
      }
    }
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPdfPath, pdfBytes);
};

module.exports = { fillPdfForm };
