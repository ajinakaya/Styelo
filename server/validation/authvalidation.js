const Joi = require('joi');


const AuthValidationSchema = Joi.object({
  username: Joi.string().required().min(3).max(255), 
  email: Joi.string().required().email(), 
  password: Joi.string().required().min(8).max(255), 
  role: Joi.string().valid('user', 'admin').default('user'), 
});

function AuthValidation(req, res, next) {
  const {  username, email, password, role } = req.body;
  
  const { error } = AuthValidationSchema.validate({  username, email, password, role });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

module.exports = AuthValidation;
