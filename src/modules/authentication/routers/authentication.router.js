import { Router } from 'express'
import { login, logout, viewLoginPage } from '../controllers/authentication.controller.js'

const router = Router()

// Pages
router.get('/auth/login', viewLoginPage)

// APIs
router.post('/api/auth/login', login)
router.get('/api/auth/logout', logout)

export default router