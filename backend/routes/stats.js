const express = require('express');
const router = express.Router();
const CompanyStats = require('../models/CompanyStats');
const auth = require('../middleware/auth');

// @route   GET /api/stats
// @desc    Get company stats
// @access  Public
router.get('/', async (req, res) => {
    try {
        let stats = await CompanyStats.findOne();
        if (!stats) {
            // Return defaults if not found, but don't create it yet to avoid side effects on GET
            return res.json({
                yearsOfExperience: 0,
                happyClients: 0,
                plotsSold: 0
            });
        }
        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/stats
// @desc    Update company stats
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        const { yearsOfExperience, happyClients, plotsSold } = req.body;

        let stats = await CompanyStats.findOne();

        if (stats) {
            // Update existing
            stats.yearsOfExperience = yearsOfExperience !== undefined ? yearsOfExperience : stats.yearsOfExperience;
            stats.happyClients = happyClients !== undefined ? happyClients : stats.happyClients;
            stats.plotsSold = plotsSold !== undefined ? plotsSold : stats.plotsSold;
        } else {
            // Create new
            stats = new CompanyStats({
                yearsOfExperience: yearsOfExperience || 0,
                happyClients: happyClients || 0,
                plotsSold: plotsSold || 0
            });
        }

        await stats.save();
        res.json(stats);
    } catch (error) {
        console.error('Update stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
