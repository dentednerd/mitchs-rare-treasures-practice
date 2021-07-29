const formatData = (data, refTable, dataKey, newKey) => {
  return data.map((item) => {
    const newItem = { ...item };
    newItem[newKey] = refTable[item[dataKey]];
    delete newItem[dataKey];
    return newItem;
  });
};

module.exports = formatData;
