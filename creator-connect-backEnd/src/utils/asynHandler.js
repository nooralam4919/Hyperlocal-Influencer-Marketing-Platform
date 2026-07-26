/**
 * Wraps an async route handler so that any thrown error is
 * forwarded to Express's next() error middleware automatically.
 *
 * Usage:  router.get("/route", asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };
