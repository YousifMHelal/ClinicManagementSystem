import { Router } from 'express'
import { addDegree, deleteDegree, getDegree, getDegrees, updateDegree, viewDegreesPage } from '../controllers/degree.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/degrees', authenticatedPage, viewDegreesPage)

// APIs
router.get('/api/degrees', authenticatedApi, getDegrees)
router.post('/api/degrees', authenticatedApi, addDegree)
router.get('/api/degrees/:id', authenticatedApi, getDegree)
router.put('/api/degrees/:id', authenticatedApi, updateDegree)
router.delete('/api/degrees/:id', authenticatedApi, deleteDegree)

export default router