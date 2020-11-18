import { Router } from 'express'
import {authorize } from "../lib/oath2Services";
import AuthRoutes from './auth'
import DriveRoutes from './drive'
import SpreadSheetRoutes from './spreadsheet'

const router = Router()

router.use('/auth',AuthRoutes)
router.use('/drive',DriveRoutes)
router.use('/spreadsheet',SpreadSheetRoutes)


export default router
