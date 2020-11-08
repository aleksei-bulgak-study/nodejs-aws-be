export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const buildResponse = (statusCode, body, headers = CORS_HEADERS) => ({
  statusCode,
  body: JSON.stringify(body),
  headers,
});
