function addCorsHeaders(response) {
  return {
    ...response,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Access-Token",
    },
  };
}

/** Wraps all API Lambda handlers with common middleware */
function wrap(handler) {
  return async (event, context) => {
    try {
      // make user context available to each request
      const result = await handler(event, context);
      return addCorsHeaders({
        ...result,
        body: JSON.stringify({
          ...result.body,
          status: "ok",
        }),
      });
    } catch (e) {
      console.error("Unhandled error", e.message);
      return addCorsHeaders({
        statusCode: 500,
        body: JSON.stringify({
          status: false,
          error: "Server error",
        }),
      });
    }
  };
}

module.exports = { wrap };
