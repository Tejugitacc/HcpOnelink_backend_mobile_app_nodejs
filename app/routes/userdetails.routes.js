const express = require('express');
const router = express.Router();
const userController = require('../controllers/userdetails.controller');
const authMiddleware = require('../middleware/auth.middleware');


// Protected endpoints: client sends Bearer token
router.get('/:userId/profile', authMiddleware, userController.getProfile);
router.get('/:userId/engagements', authMiddleware, userController.getEngagements);
router.get('/:userId/invoicesExpenses', authMiddleware, userController.getInvoicesExpenses );

router.patch('/:userId/updateProfile', authMiddleware, userController.updateHcpProfile );

module.exports = router;
