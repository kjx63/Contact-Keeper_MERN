const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
  '/',
  [
    body('name', 'Please add name').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // Check to see if there's a user with that email and if there is, return the error message
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      // If the user does not exist, take the user variable(initialized above) and set it to a new user
      user = new User({
        name: name,
        email: email,
        password: password,
      });

      // encrypt the password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // [SEND BACK the JSON web Token TO THE USER ]
      // Generate jwt and send this to the user once they are registered and once they are logged in.
      // https://jwt.io/
      // With that userId, we can access all the contacts
      const payload = {
        user: { id: user.id },
      };
      // To generate a token, we have to sign it
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000000,
        },
        (err, token) => {
          if (err) throw err;
          // return the token
          // the returned token includes the userId
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
