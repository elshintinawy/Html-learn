function httpSuccessStatus(data = null) {
  return {
    status: "success",
    data: data,
  };
}

function httpFaliureStatus(data = null) {
  return {
    status: "fail",
    data: data,
  };
}

function httpErrorStatus(error) {
  return {
    status: "error",
    message: error,
  };
}


module.exports = {
  httpSuccessStatus,
  httpFaliureStatus,
  httpErrorStatus,
};