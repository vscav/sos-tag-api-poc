const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const containsOnlySpaces = (str: string): boolean => {
  return str.trim().length === 0;
};

export { capitalizeFirstLetter, containsOnlySpaces };
