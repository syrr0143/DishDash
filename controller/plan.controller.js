import mongoose from 'mongoose';
import { Plan } from '../model/plans.model.js'
import dotenv from 'dotenv'
import { Review } from '../model/review.model.js';

dotenv.config()

const createPlan = async (req, res) => {
    try {
        const { name, duration, price, description, discount, ratingAverage } = req.body;
        if (![name, duration, price, description, discount, ratingAverage]) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const plan = await Plan.findOne({ name: name });
        if (plan) {
            return res.status(400).json({ message: "plan already exists" });
        }
        const newPlan = await Plan.create({
            name: name,
            duration: duration,
            price: price,
            description: description,
            discount: discount,
            ratingAverage: ratingAverage

        });
        const createdPlan = await Plan.findById(newPlan._id);
        if (!createdPlan) {
            return res.status(500).json({ message: 'something went wrong' });
        }
        return res.status(201).json({ message: "plan created successfully", plan: createdPlan });
    } catch (error) {
        return res.status(500).json({ message: "server error occured while creating the plan", error: error.message });

    }
}

const updatePlan = async (req, res) => {
    try {
        const { price, discount, ratingAverage } = req.body;
        if (price === 'undefined', discount === 'undefined', ratingAverage === 'undefined') {
            return res.status(400).json({ mesage: "at least one of field input arerequired" });
        }
        if (price < 0 || discount < 0 || discount > 100) {
            return res.status(400).json({ message: "price or discount value is invalid  " });
        }
        const plan = await Plan.findById(req.params._id);
        if (!plan) {
            return res.status(404).json({ message: "no plan found for the given details" });
        }
        const updatedPlan = await Plan.findByIdAndUpdate(req.params._id, { price: price, discount: discount, ratingAverage: ratingAverage }, { new: true });
        return res.status(200).json({ message: "details updated successfuly", updatedPlan: updatedPlan });

    } catch (error) {
        return res.status(500).json({ message: "server error ", error: error.message });
    }
}

const deletePlan = async (req, res) => {
    try {
        const _id = req.params._id;
        console.log(_id)
        if (!_id) {
            return res.status(400).json({ message: "plan id is required" });
        }
        const plan = await Plan.findById({ _id: _id });
        if (!plan) {
            return res.status(404).json({ message: "there is no such plan exists for the given id " });
        }
        await Plan.findByIdAndDelete(_id);
        const checkIfDeleted = await Plan.findById(_id);
        if (checkIfDeleted) {
            return res.status(500).json({ message: "plan was unable to deleted , there was an server error" });

        }
        return res.status(200).json({ message: "plan deleted successfully", deletedPlan: plan })
    } catch (error) {
        return res.status(500).json({ message: "server error occured", error: error.message });
    }
};
const getAllPlan = async (req, res) => {
    try {
        const allPlans = await Plan.find();
        if (!allPlans) {
            return res.status(500).json({ message: "something went wrong" });
        }
        return res.status(200).json({ message: "all plan fetched successfully", allPlan: allPlans });
    } catch (error) {
        return res.status(500).json({ message: "server error occured during the getting all plan", error: error.message })
    }
}

const specificPlan = async (req, res) => {
    try {
        const _id = req.params._id;
        if (!_id) {
            return res.status(404).json({ message: "please provide id to find the plan" });
        }
        const plan = await Plan.findById(_id);
        // plan.totalReviews = await Review.find({ plan: _id }).countDocuments()
        // console.log(plan.totalReviews)  already implemented in the create and delete route for the reviw
        if (!plan) {
            return res.status(404).json({ message: "there is no such plan exists for the given id " });
        }
        return res.status(200).json({ message: "plan fetched successfully ", plan: plan })

    } catch (error) {
        return res.status(500).json({ message: "server error occured while fetching the plan", error: error.message })
    }
}

const top3Plans = async (req, res) => {
    try {
        const top3Plan = await Plan.find().sort({ ratingAverage: -1 }).limit(3);
        return res.status(200).json({ message: "top 3 plan fetched successfully", plans: top3Plan })
    } catch (error) {
        return res.status(500).json({ message: "server error ", error: error.message })
    }
}
// const top3Plans = async (req, res) => {
//     try {
//         const top3Plan = await Plan.find().sort({ ratingAverage: 1 }).limit(3);
//         return res.status(200).json({ message: "top 3 plan fetched successfully", plans: top3Plan })
//     } catch (error) {
//         return res.status(500).json({ message: "server error ", error: error.message })
//     }
// }


export { createPlan, updatePlan, deletePlan, getAllPlan, specificPlan, top3Plans };