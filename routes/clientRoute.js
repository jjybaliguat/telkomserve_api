import express from 'express'
import { checkBills, checkEmail, createSOAPdf, deleteClient, getAllApplicants, getAllClient, getSingleClient, registerClient, resendCode, sendOtp, updateClient, verifyAccountNumber, verifyCode } from '../controller/clientController.js'
import { adminProtect } from '../middleware/authMiddleware.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

const router = express.Router()

router.post("/register", registerClient)
router.get("/getclients",verifyJWT, getAllClient)
router.get("/getapplicants",verifyJWT, getAllApplicants)
router.get("/getclients/:id",verifyJWT, getSingleClient)
router.patch("/resend-code", resendCode)
router.patch("/verify-code", verifyCode)
router.post("/check-email", checkEmail)
// router.patch("/updatePhoto/:id", updateClientPhoto)
router.patch("/:id",verifyJWT, updateClient)
router.delete("/:id", verifyJWT, deleteClient)
router.post("/verify-accnum", verifyAccountNumber)
router.post("/send-otp", sendOtp)
router.post("/checkbills", checkBills)
router.post('/generate-pdf', createSOAPdf)


export default router