import express from 'express'
import { createAdmin, deleteAdmin, forgotPassword, getAdmin, getAllAdmin, getSingleAdmin, login, loginStatus, logout, refresh, resetPassword, updateAdmin } from '../controller/adminController.js'
import { adminProtect } from '../middleware/authMiddleware.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

const router = express.Router()

router.post("/create", createAdmin)
router.post("/login", login)
router.get("/getadmin",verifyJWT, getAdmin)
router.get("/getadmin/:id",verifyJWT, getSingleAdmin)
router.get("/getalladmin",verifyJWT, getAllAdmin)
router.get("/loggedin", loginStatus)
router.patch("/updateadmin", verifyJWT, updateAdmin)
router.patch("/updateadmin/:id", verifyJWT, updateAdmin)
router.get("/logout", logout)
router.post("/forgotpassword", forgotPassword)
router.delete("/:id", verifyJWT, deleteAdmin)
router.put("/resetpassword/:resetToken", resetPassword)
router.get("/refresh", refresh)

export default router
