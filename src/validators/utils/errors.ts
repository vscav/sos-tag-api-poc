const generateFieldErrors = (errorMessages: { [fieldName: string]: string }) => {
  const errorsMap = {
    errors: [],
  };

  for (const [field, message] of Object.entries(errorMessages)) {
    errorsMap.errors.push({
      field,
      message,
    });
  }

  return errorsMap;
};

export { generateFieldErrors };
