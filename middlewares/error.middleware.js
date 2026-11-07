const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({
      error: "A record with this value already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
    });
  }

  const status =
    Number.isInteger(err.status) && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
};

export default errorMiddleware;
