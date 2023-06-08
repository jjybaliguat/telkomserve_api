import express from 'express'
import { getSmsAccount, retrieveSms, sendSms } from '../controller/smsController.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

const router = express.Router()

router.post('/', verifyJWT, sendSms)
router.get('/', verifyJWT, retrieveSms)
router.get('/account',verifyJWT, getSmsAccount)

export default router