
import { Plan } from '../model/plans.model.js';
import { User } from '../model/user.model.js';
import { Review } from '../model/review.model.js'



const getAllReview = async (req, res) => {
    try {
        const review = await Review.find();
        if (!review) {
            return res.status(404).json({ messsage: 'no review found' })
        }
        return res.status(200).json({ message: "review fetched successfully", review: review })
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}


const getreviewById = async (req, res) => {
    try {

        const _id = req.params.reviewId;
        if (!_id) {
            return res.status(400).json({ message: "provide review id, review id is required" });
        }
        const review = await Review.findById({ _id });
        if (!review) {
            return res.status(404).json({ message: "review not found" });
        }
        return res.status(200).json({ message: "review fetched successfully", review: review });
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}
const reviewByPlan = async (req, res) => {
    try {
        const planId = req.params.planId;
        console.log(planId)
        if (!planId) {
            return res.status(400).json({ message: "provide plan id, plan id is required" });
        }
        const reviews = await Review.find({ plan: planId });
        console.log(reviews)
        if (!reviews) {
            return res.status(404).json({ message: "no reviews found for given plan" });
        }
        return res.status(200).json({ message: "reviews for the given plan fetched successfully", planReviews: reviews })
    } catch (error) {
        return res.status(500).json({ message: "internal server error please try again", error: error.message })
    }
}

const top3review = async (req, res) => {
    try {
        const topreview = await Review.find().sort({ rating: -1 }).limit(3);
        if (!topreview) {
            return res.status(404).json({ message: 'no review found' })
        }
        return res.status(200).json({ message: "top 3 review fetched successfully", review: topreview })
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}

const createReview = async (req, res) => {
    try {
        const planId = req.params.planId;
        const user = req.user;
        if (!planId) {
            return res.status(400).json({ message: "provide plan id, plan id is required" });
        }
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: "plan not found" });
        }
        // making sure that customer has not added the comment already , if done so then throw an error 
        const reviewdone = await Review.findOne({ user: user._id, plan: planId });
        if (reviewdone) {
            return res.status(400).json({ message: "you have already added a review for this plan , you can edit your review or delete it to add a new one" });
        }
        const { review, rating } = req.body;
        if (!review || !rating) {
            return res.status(400).json({ message: "provide review and rating" });
        }
        const newReview = await Review.create({
            review: review,
            rating: rating,
            user: user._id,
            plan: plan._id
        });

        // Calculate new average rating for the plan
        const totalRatings = (plan.ratingAverage * plan.totalReviews) + rating;
        const averageRating = totalRatings / (plan.totalReviews + 1);

        // Update the average rating for the plan
        await Plan.findByIdAndUpdate(plan._id, { ratingAverage: averageRating, totalReviews: plan.totalReviews + 1 });

        return res.status(200).json({ message: 'review uploaded successfully', review: newReview });

    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const planId = req.params.planId;
        const user = req.user;
        if (!planId) {
            return res.status(400).json({ message: "provide plan id, plan id is required" })
        }
        const reviewFound = await Review.findOne({ user: user._id, plan: planId });
        if (!reviewFound) {
            return res.status(404).json({ message: "you have not added any review yet for this plan" })
        }
        const { review, rating } = req.body;
        if (!review || !rating) {
            return res.status(400).json({ message: "provide review and rating" });
        }
        const updateReview = await Review.findByIdAndUpdate(reviewFound._id, { review: review, rating: rating }, { new: true });
        return res.status(200).json({ message: "review updated successfully", review: updateReview });

    } catch (error) {
        return res.status(500).json({ message: "internal server error , please try again later", error: error.message })
    }
}

const deleteReview = async (req, res) => {
    try {
        const _id = req.params.planId;
        if (!_id) {
            return res.status(400).json({ message: "provide review id, review id is required" });
        }

        const review = await Review.findById(_id);
        if (!review) {
            return res.status(404).json({ message: "no review exists" });
        }
        const plan = await Plan.findById(review.plan._id);
        if (!plan) {
            return res.status(404).json({ message: "no plan exists" });
        }

        if (!review) {
            return res.status(404).json({ message: "review not found" });
        }
        const totalRating = (plan.ratingAverage * plan.totalReviews) - review.rating;
        const averageRating = totalRating / (plan.totalReviews - 1);;
        await Plan.findByIdAndUpdate(review.plan._id, { ratingAverage: averageRating, totalReviews: plan.totalReviews - 1 }, { new: true })
        await Review.findByIdAndDelete(_id);
        return res.status(200).json({ message: "review deleted successfully" });


    } catch (error) {
        return res.status(500).json({ message: "internal server error , please try again later", error: error.message })
    }
}




export { getAllReview, createReview, top3review, getreviewById, deleteReview, reviewByPlan, updateReview };