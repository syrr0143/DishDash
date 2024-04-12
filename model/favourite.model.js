import mongoose from 'mongoose'

const favouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    }],
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        required: true
    }]
}, { timestamps: true })

export const Favourite = mongoose.model("Favourite", favouriteSchema)