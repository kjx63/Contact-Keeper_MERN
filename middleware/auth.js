// Create a middleware
// At the end point, token has a user id inside the payload

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Check to see if there is a token in the header in the 'x-auth-token'
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify by pulling put the payload
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Payload is going to be put into "decoded", so take the user out from the decoded and assign it to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
