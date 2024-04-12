import express from 'express';
const router = express.Router();
import { veriftJwt } from '../middleware/auth.middleware.js'
import { createPlan, updatePlan, deletePlan, getAllPlan, specificPlan, top3Plans } from '../controller/plan.controller.js'

router.route('/plan')
    .get(veriftJwt, getAllPlan)
    .post(veriftJwt, createPlan)
router.route('/top3plans')
    .get(veriftJwt, top3Plans)
router.route('/plan/:_id')
    .get(veriftJwt, specificPlan)
router.route('/plan/:_id')
    .patch(veriftJwt, updatePlan)
    .delete(veriftJwt, deletePlan)

export default router;