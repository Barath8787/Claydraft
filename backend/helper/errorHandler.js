class HandleErorr extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HandleErorr";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HandleErorr;
