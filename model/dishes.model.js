import mongoose from 'mongoose'

const dishesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Dish = mongoose.model('Dish', dishesSchema);