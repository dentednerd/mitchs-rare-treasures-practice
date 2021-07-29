const createRefTable = (arr, key, value) => {
  return arr.reduce((finalObj, current) => {
    finalObj[current[key]] = current[value];
    return finalObj;
  }, {});
};

module.exports = createRefTable;
