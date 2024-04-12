import express from 'express'
const router = express.Router();
import { veriftJwt } from '../middleware/auth.middleware.js'
import { createReview, getAllReview, getreviewById, top3review, deleteReview, reviewByPlan, updateReview } from '../controller/review.controller.js'


router.route('/findReviews')
    .get(veriftJwt, getAllReview)
router.route('/reviews/:planId')
    .post(veriftJwt, createReview)
    .get(veriftJwt, reviewByPlan)
    .patch(veriftJwt, updateReview)
    .delete(veriftJwt, deleteReview)
router.route('/findReviews/:reviewId')
    .get(veriftJwt, getreviewById)
router.route('/findReviews/top3')
    .get(veriftJwt, top3review)
export default router;