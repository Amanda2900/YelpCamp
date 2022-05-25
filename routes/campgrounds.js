const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');


router.get('/', campgrounds.index);

router.get('/new', isLoggedIn, campgrounds.newForm);

router.get('/:id', campgrounds.show);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.editForm);

router.post('/', isLoggedIn, validateCampground, campgrounds.create);

router.put('/:id', isLoggedIn, isAuthor, validateCampground, campgrounds.update);

router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampground);


module.exports = router;