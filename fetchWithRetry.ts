export const fetchWithRetry = async (
  fetchApi,
  baseTimeout = 1000,
  retryCount = 1
) => {
  let result;

  const retryApi = async () => {
    if (retryCount === 0) {
      return {};
    }
    return new Promise((res) => {
      setTimeout(
        async () =>
          res(await fetchWithRetry(fetchApi, baseTimeout * 2, retryCount - 1)),
        baseTimeout
      );
    });
  };

  try {
    result = await fetchApi();
    if (!result || result.success === undefined) {
      throw new Error();
    }
  } catch (error) {
    return retryApi();
  }
  return result;
};
