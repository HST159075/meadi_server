import  express  from "express"
import { register, login } from "../controllers/auth.controller"
import { auth } from "../lib/auth"; 
import { toNodeHandler } from "better-auth/node"

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.all("/:path", toNodeHandler(auth));

export default router