import express from 'express'
import { addServiceableArea, getAreabymuncode } from '../controller/serviceableAreaController.js'
const router = express.Router()

router.post('/', addServiceableArea)
router.get('/:barangay', getAreabymuncode)

export default router