export const isValidId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};
