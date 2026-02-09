const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const HeroSlide = require('../models/HeroSlide');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, PNG, WEBP) are allowed'));
        }
    }
});

// @route   GET /api/hero
// @desc    Get all hero slides
// @access  Public
router.get('/', async (req, res) => {
    try {
        const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
        res.json(slides);
    } catch (error) {
        console.error('Get slides error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/hero
// @desc    Create new hero slide
// @access  Private (Admin only)
router.post('/', auth, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const { title, subtitle, order } = req.body;

        const slide = new HeroSlide({
            image: '/uploads/' + req.file.filename,
            title: title || '',
            subtitle: subtitle || '',
            order: order || 0
        });

        await slide.save();
        res.status(201).json(slide);
    } catch (error) {
        console.error('Create slide error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/hero/:id
// @desc    Update hero slide
// @access  Private (Admin only)
router.put('/:id', auth, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const slide = await HeroSlide.findById(req.params.id);
        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }

        const { title, subtitle, order } = req.body;

        slide.title = title !== undefined ? title : slide.title;
        slide.subtitle = subtitle !== undefined ? subtitle : slide.subtitle;
        slide.order = order !== undefined ? order : slide.order;

        if (req.file) {
            slide.image = '/uploads/' + req.file.filename;
        }

        await slide.save();
        res.json(slide);
    } catch (error) {
        console.error('Update slide error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/hero/:id
// @desc    Delete hero slide
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const slide = await HeroSlide.findById(req.params.id);
        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }

        await slide.deleteOne();
        res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
        console.error('Delete slide error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
