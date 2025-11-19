// app/routes/cache.routes.js

const express = require('express');
const router = express.Router();
const cacheController = require('../controllers/cache.controller');
console.log('cache routes loaded');
// Protected API calls
router.post('/:userId/profile', cacheController.getProfile);
router.post('/:userId/engagements', cacheController.getEngagements);
router.post('/:userId/invoices&expenses', cacheController.getInvoices);

module.exports = router;
