const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(tempFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }

        res.send(tempFunc({ errors, ...data }));
      }

      next();
    };
  },

  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    next();
  },
};
