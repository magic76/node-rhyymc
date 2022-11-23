// const fetchWithRetry = async (fetchApi, baseTimeout = 1000, retryCount = 1) => {
//   let result;

//   const retryApi = async () => {
//     if (retryCount === 0) {
//       return {};
//     }
//     return new Promise((res) => {
//       setTimeout(
//         async () =>
//           res(await fetchWithRetry(fetchApi, baseTimeout * 2, retryCount - 1)),
//         baseTimeout
//       );
//     });
//   };

//   try {
//     result = await fetchApi();
//     if (!result || result.success === undefined) {
//       throw new Error();
//     }
//   } catch (error) {
//     return retryApi();
//   }
//   return result;
// };

import { fetchWithRetry } from './fetchWithRetry';

const callApiSuccess = async () => ({
  success: true,
});

const callApiResponseFail = async () => ({});
const callApiTimeoutFail = async () => {
  throw new Error('fail');
};
describe('api retry method', () => {
  it('should retry total time shoud be expect time', async () => {
    let startTime = Date.now();
    const res = await fetchWithRetry(
      () => {
        console.log(Date.now());
        return callApiTimeoutFail();
      },
      100,
      2
    );
    const totalTime = Date.now() - startTime;
    expect(totalTime > 300).toBe(true);
    expect(totalTime < 500).toBe(true);
  });

  it('should retry twice when api timeout', async () => {
    let retryCount = 0;
    const res = await fetchWithRetry(
      () => {
        retryCount++;
        return callApiTimeoutFail();
      },
      100,
      2
    );
    expect(retryCount).toBe(3);
  });

  it('should retry twice when api response fail', async () => {
    let retryCount = 0;
    const res = await fetchWithRetry(
      () => {
        retryCount++;
        return callApiResponseFail();
      },
      100,
      2
    );
    expect(retryCount).toBe(3);
  });

  it('should retry once then api success', async () => {
    let apiCallTimes = 0;
    const res = await fetchWithRetry(
      () => {
        apiCallTimes++;
        if (apiCallTimes === 2) {
          return callApiSuccess();
        }
        return callApiTimeoutFail();
      },
      1000,
      2
    );

    expect(apiCallTimes).toBe(2);
    expect(res.success).toBe(true);
  });
  it('should return api success without retry', async () => {
    let apiCallTimes = 0;
    const res = await fetchWithRetry(
      () => {
        apiCallTimes++;
        if (apiCallTimes === 1) {
          return callApiSuccess();
        }
        return callApiTimeoutFail();
      },
      1000,
      2
    );

    expect(apiCallTimes).toBe(1);
    expect(res.success).toBe(true);
  });
});
