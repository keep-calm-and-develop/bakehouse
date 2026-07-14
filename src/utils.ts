export const getParsedDocsFromQuerySnapShot = (querySnapShot) => {
  const collection = [];
  querySnapShot.forEach((doc) => {
    collection.push({ id: doc.id, ...doc.data() });
  });
  return collection;
};
