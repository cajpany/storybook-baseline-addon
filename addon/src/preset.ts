const previewAnnotations = async (entry = []) => {
  return [...entry, require.resolve("./preview")];
};

const managerEntries = async (entry = []) => {
  return [...entry, require.resolve("./manager")];
};

const previewAnnotationsVite = previewAnnotations;
const managerEntriesVite = managerEntries;

export { previewAnnotations, managerEntries, previewAnnotationsVite, managerEntriesVite };
