import mongoose from 'mongoose'
import { User } from '../model/user.model.js'
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: ['true', 'review is required']
    },
    rating: {
        min: 1,
        max: 10,
        type: Number,
        required: ['true', 'rating is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: ['true', 'user is required']
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: ['true', 'plan is required']
    }
}, { timestamps: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name -_id' }).populate({ path: 'plan', select: 'name' })
    next();
});


export const Review = mongoose.model('Review', reviewSchema);