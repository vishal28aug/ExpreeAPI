// @desc Log req to console
const logger = (req, res, next) => {
    next();
}

module.exports = logger;