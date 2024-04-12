import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    description: {
        type: String,
        required: true,
        trim: true,
        index: true,
        maxlength: [200, 'exceeded length of description 200']
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 0
    },
    reviews: [{
        type: String,
        trim: true,
        index: true,
        maxlength: [200, 'exceeded length of description 200']
    }],
    menu: [{
        dish: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['veg', 'non-veg'] // Define enum values here
        },
        avatar: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true,
            maxlength: [200, 'exceeded length of description 200']
        },
        rating: {
            type: Number,
            required: false,
            min: 1,
            max: 10
        }
    }],
    avatar: {
        type: String,
        required: false
    },
    openingHours: {
        monday: { type: String },
        tuesday: { type: String },
        wednesday: { type: String },
        thursday: { type: String },
        friday: { type: String },
        saturday: { type: String },
        sunday: { type: String }
    },
}, { timestamps: true });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);


