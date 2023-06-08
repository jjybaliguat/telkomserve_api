import express from 'express'
import { create, deleteOne, fetch } from '../controller/toCreateInvoiceController.js'

const router = express.Router()

router.post('/', create)
router.get('/', fetch)
router.delete('/:id', deleteOne)

export default router