export const handleError = (err: any, message: string, status: number) => {
  const error = new Error();
  error.statusCode = status;
  error.error = err;
  error.message = message;
  throw error;
};
