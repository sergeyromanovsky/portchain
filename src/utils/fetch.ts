export const defaultQueryFn = (url: string) => {
  return fetch(
    `https://import-coding-challenge-api.portchain.com/api/v2/${url}`
  ).then((res) => res.json());
};
