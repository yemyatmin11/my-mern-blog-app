const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const AuthMiddleware = (req, res, next) => {
    let token = req.cookies.jwt;
    console.log('AuthMiddleware token:', token); 
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedValue) => {
            if (err) {
                console.error('Token verification failed:', err);
                return res.status(401).json({ message: 'unauthenticated' });
            } else {
                User.findById(decodedValue._id).then(user => {
                    req.user = user;
                    next();
                }).catch(err => {
                    console.error('User retrieval failed:', err);
                    return res.status(500).json({ message: 'internal server error' });
                });
            }
        });
    } else {
        console.error('Token not provided');
        return res.status(400).json({ message: 'token need to provide' });
    }
}

module.exports = AuthMiddleware
