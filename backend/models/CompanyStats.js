const mongoose = require('mongoose');

const companyStatsSchema = new mongoose.Schema({
    yearsOfExperience: {
        type: Number,
        default: 0
    },
    happyClients: {
        type: Number,
        default: 0
    },
    plotsSold: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CompanyStats', companyStatsSchema);
