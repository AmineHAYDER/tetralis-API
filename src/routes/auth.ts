import { Router } from 'express'
import {authorize,generateToken} from "../lib/oath2Services";
const router = Router()

router.get("/google",authorize,async (req, res) => {
   res.redirect(req.body.url)                //redirect user to the api confirmations
})
router.get("/authorized",generateToken,async (req, res) => {//callback function to redirect back to the frontend with token in params
   const { token } = req.body
   if (!token) return res.send('no').status(400)
   return res.redirect("http://localhost:3000/token/"+token)
})

export default router
