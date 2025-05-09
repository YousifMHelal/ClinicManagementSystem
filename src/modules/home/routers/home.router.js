import { Router } from 'express'
import { viewHomePage } from '../controllers/home.controller.js'
import { authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/', authenticatedPage, viewHomePage)

export default router