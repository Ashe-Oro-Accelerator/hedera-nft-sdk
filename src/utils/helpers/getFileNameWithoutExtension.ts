export const getFileNameWithoutExtension = (fullFileName: string): string => {
  if (fullFileName.startsWith('.env')) return fullFileName;
  return fullFileName.split('.')[0];
};
