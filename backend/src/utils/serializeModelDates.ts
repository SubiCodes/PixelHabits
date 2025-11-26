export function serializeModelDates(arr: any[]) {
  return arr.map(item => {
    const result = { ...item };
    Object.keys(result).forEach(key => {
      if (result[key] instanceof Date) {
        result[key] = result[key].toISOString();
      }
    });
    return result;
  });
}