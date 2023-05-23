const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')


const validateToken = async(req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401)
                throw new Error("User is not authorized")
            }
            req.user = decoded.user;
            next();
        });

        if(!token) {
            res.status(401);
            throw new Error("User is not authorized or token is not included in the request")
        }
    }
}

module.exports = validateToken








// const asyncHandler = require('express-async-handler');
// const jwt = require('jsonwebtoken');
// const { promisify } = require('util');

// const validateToken = async (req, res, next) => {
//   const verifyJwt = promisify(jwt.verify);
//   let token;
//   let authHeader = req.headers.authorization || req.headers.Authorization;
  
//   if (authHeader && authHeader.startsWith('Bearer')) {
//     token = authHeader.split(' ')[1];

//     try {
//       const decoded = await verifyJwt(token, process.env.ACCESS_TOKEN_SECRET);
//       req.user = decoded.user;
//       next();
//     } catch (err) {
//       res.status(401);
//       throw new Error('User is not authorized');
//     }
//   } else {
//     res.status(401);
//     throw new Error('User is not authorized or token is not included in the request');
//   }
// };

// module.exports = validateToken;
