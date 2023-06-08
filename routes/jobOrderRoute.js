import express from 'express'
import { createJobOrder, deleteJobOrder, getAllJobOrder, getJobOrderCount, getjobOrderById, updateJobOrder } from '../controller/jobOrderController.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

const router = express.Router()

router.post('/', verifyJWT, createJobOrder)
router.get('/', verifyJWT, getAllJobOrder)
router.get('/:id', getjobOrderById)
router.patch('/:id', verifyJWT, updateJobOrder)
router.delete('/:id', verifyJWT, deleteJobOrder)
router.get("/joborder/count", getJobOrderCount)

export default router