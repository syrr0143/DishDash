import { getAllResataurant, resaturantById, addRestaurant, updateRestaurant, deleteRestaurant, addDishTMenu, resturantMenu, deleteDish, getAllReviews, uploadReview } from '../controller/restaurant.controller.js'
import { veriftJwt } from '../middleware/auth.middleware.js'

import express from 'express';
const router = express.Router();
router.route('/')
    .post(addRestaurant)
    .get(getAllResataurant)
router.route('/:id')
    .get(resaturantById)
    .patch(updateRestaurant)
    .delete(deleteRestaurant)
router.route('/reviews/:id')
    .get(getAllReviews)
    .post(uploadReview)
router.route('/dish/:id')
    .post(addDishTMenu)
    .get(resturantMenu)
router.route('/:id/:dishid')
    .delete(deleteDish)


export default router;
