const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    subtitle: {
        type: String,
        default: '',
        trim: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
