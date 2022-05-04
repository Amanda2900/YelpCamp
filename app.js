require('dotenv').config();
const express = require('express');
const path = require('path');

require('./config/database.js');

const Campground = require('./models/campground.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('home')
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
});

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body);
  await campground.save();
  res.redirect(`campgrounds/${campground._id}`);
})

app.listen(3000, () => {
  console.log('Serving on port 3000');
});