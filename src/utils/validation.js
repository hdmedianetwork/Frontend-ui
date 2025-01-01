export const isValidFileType = (file) => {
  // Define accepted MIME types
  const validTypes = [
    "application/pdf", // PDF
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];

  // Check if the file's type is valid
  return validTypes.includes(file.type);
};
