const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    size: {
        type: String,
        required: [true, 'Project size is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    price: {
        type: String,
        required: [true, 'Price is required'],
        trim: true
    },
    facing: {
        type: String,
        required: [true, 'Facing direction is required'],
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    brochure: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['ongoing', 'upcoming', 'completed'],
        default: 'ongoing'
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
