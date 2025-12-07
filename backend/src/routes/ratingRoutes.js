const express = require('express');
const { rateEvent, getAverageRating } = require('../controllers/ratingController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// Rate a single event
router.post('/events/:apiId/rate', auth, rateEvent);
// Get average rating for a single event
router.get('/events/:apiId/average', getAverageRating);

module.exports = router;
