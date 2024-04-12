import mongoose from 'mongoose'

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: [20, 'exceeded length of plan name 20']
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        validate: function () {
            if (this.discount < 0 || this.discount > 100) {
                throw new Error("Discount should be between 0 and 100");
            }
        }
    },
    totalReviews: {
        type: Number,
        default: 0
    }
    , ratingAverage: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


export const Plan = mongoose.model("Plan", planSchema)