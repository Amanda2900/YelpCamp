const Campground = require('../models/campground.js');
const catchAsync = require('../utilities/catchAsync');


module.exports.index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

module.exports.newForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.show = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if(!campground) {
    req.flash('error', 'Campground does not exist');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground });
});

module.exports.editForm = catchAsync(async(req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground) {
    req.flash('error', 'Campground does not exist');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground });
});

module.exports.create = catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body);
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully added a new campground!');
  res.redirect(`campgrounds/${campground._id}`);
});

module.exports.update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body }, { new: true });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
});