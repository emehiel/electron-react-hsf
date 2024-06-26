// TO DO: Make sure file is in the correct directory
function validatePythonFile(pythonDirectoryPath, filePath) {
  return pythonDirectoryPath === filePath.slice(0, pythonDirectoryPath.length);
}

function findInvalidPythonFiles(pythonDirectoryPath, filePaths) {
  return filePaths.filter((file) => !validatePythonFile(pythonDirectoryPath, file));
}

export { findInvalidPythonFiles, validatePythonFile };