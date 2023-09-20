const processAssociatedQueries = (
  query: any[],
  foreignKey: string,
  foreignValue: any
) => {
  for (const q of query) {
    q[foreignKey] = foreignValue;
    q.id = undefined;
    q.createdAt = undefined;
    q.updatedAt = undefined;
  }

  return query;
};

export { processAssociatedQueries };
