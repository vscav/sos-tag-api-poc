const formatObject = (obj: Object) => {
  return trimObjectValues(obj);
};

const trimObjectValues = (obj: Object) => {
  return Object.keys(obj).reduce((acc, curr) => {
    acc[curr] = obj[curr].trim();
    return acc;
  }, {});
};

export { formatObject, trimObjectValues };
