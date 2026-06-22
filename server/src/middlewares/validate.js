const ApiError = require('../utils/ApiError');

const formatValidationMessage = (error) => {
  const { fieldErrors } = error.flatten();
  const messages = Object.values(fieldErrors).flat();
  return messages.length ? messages.join('; ') : 'Validation failed';
};

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const message = formatValidationMessage(result.error);
    return next(new ApiError(400, message, result.error.flatten()));
  }

  req.validated = result.data;
  return next();
};

module.exports = validate;
