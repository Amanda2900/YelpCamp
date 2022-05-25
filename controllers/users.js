const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');

module.exports.registerForm = (req, res) => {
  res.render('users/register');
};

module.exports.register = catchAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    })
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
});

module.exports.loginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', `Welcome back!`);
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function(err) {
    if(err) return next(err);
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
};