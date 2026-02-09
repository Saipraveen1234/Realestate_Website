const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    photo: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5,
        default: 5
    },
    testimonial: {
        type: String,
        required: [true, 'Testimonial text is required'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
