const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
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
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, PNG) and PDFs are allowed'));
        }
    }
});

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post('/', auth, (req, res, next) => {
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'brochure', maxCount: 1 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'File upload error', error: err.message });
        } else if (err) {
            console.error('Unknown upload error:', err);
            // Check for specific file type error
            if (err.message === 'Only images (JPEG, PNG) and PDFs are allowed') {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Unknown upload error', error: err.message });
        }
        // Continue to next middleware if no error
        next();
    });
}, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const { name, size, location, price, facing, status, description } = req.body;

        const projectData = {
            name,
            size,
            location,
            price,
            facing,
            status: status || 'ongoing',
            description: description || ''
        };

        // Add file paths if uploaded
        if (req.files) {
            if (req.files.image) {
                projectData.image = '/uploads/' + req.files.image[0].filename;
            }
            if (req.files.brochure) {
                projectData.brochure = '/uploads/' + req.files.brochure[0].filename;
            }
        }

        const project = new Project(projectData);
        await project.save();

        res.status(201).json(project);
    } catch (error) {
        console.error('Create project error details:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put('/:id', auth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, size, location, price, facing, status, description } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update fields
        project.name = name || project.name;
        project.size = size || project.size;
        project.location = location || project.location;
        project.price = price || project.price;
        project.facing = facing || project.facing;
        project.status = status || project.status;
        project.description = description || project.description;

        // Update file paths if new files uploaded
        if (req.files) {
            if (req.files.image) {
                project.image = '/uploads/' + req.files.image[0].filename;
            }
            if (req.files.brochure) {
                project.brochure = '/uploads/' + req.files.brochure[0].filename;
            }
        }

        await project.save();
        res.json(project);
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await project.deleteOne();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
