exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Finance Tracker API is working!',
      timestamp: new Date().toISOString()
    })
  };
};
