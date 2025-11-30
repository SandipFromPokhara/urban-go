const express = require('express');
const { rateEvent, getAverageRating } = require('../controllers/ratingController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Rate a single event
router.post('/events/:eventId/rate', auth, rateEvent);
// Get average rating for a single event
router.get('/events/:eventId/average', getAverageRating);

module.exports = router;
