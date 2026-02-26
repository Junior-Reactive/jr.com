const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let error = { ...err };
    error.message = err.message;

    if (err.name === 'ConnectionError' || err.name === 'RequestError') {
        error.message = 'Database error occurred';
        error.statusCode = 500;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;