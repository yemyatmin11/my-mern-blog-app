const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60 // 3 days
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {expiresIn : maxAge})
}

module.exports = createToken