import express from 'express'
import { createInvoice, deleteInvoice, getAllInvoice, getInvoiceById, getTotalCount, updateInvoice } from '../controller/invoiceController.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

const router = express.Router()

router.post('/',verifyJWT, createInvoice)
router.get('/',verifyJWT, getAllInvoice)
router.get('/:id', getInvoiceById)
router.patch('/:id',verifyJWT, updateInvoice)
router.delete('/:id',verifyJWT, deleteInvoice)
router.get('/invoices/count', getTotalCount)

export default router