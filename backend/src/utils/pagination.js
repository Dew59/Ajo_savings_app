const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);

  // Maximum 100 documents per request
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export default getPagination;