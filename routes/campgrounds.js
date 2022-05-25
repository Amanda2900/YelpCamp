const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const { isLoggedIn, validateCampground } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');


router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async (req, res) => {
  const campground = await (await Campground.findById(req.params.id).populate('reviews')).populate('author');
  if(!campground) {
    req.flash('error', 'Campground does not exist');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  if(!campground) {
    req.flash('error', 'Campground does not exist');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground });
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully added a new campground!');
  res.redirect(`campgrounds/${campground._id}`);
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body }, { new: true });
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
}));


module.exports = router;