class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  NotFoundError,
  errorHandler,
};
