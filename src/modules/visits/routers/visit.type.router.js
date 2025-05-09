import { Router } from 'express'
import { addVisitType, deleteVisitType, getVisitType, getVisitTypes, updateVisitType, viewVisitTypesPage } from '../controllers/visit.type.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/visits/types', authenticatedPage, viewVisitTypesPage)

// APIs
router.get('/api/visits/types', authenticatedApi, getVisitTypes)
router.post('/api/visits/types', authenticatedApi, addVisitType)
router.get('/api/visits/types/:id', authenticatedApi, getVisitType)
router.put('/api/visits/types/:id', authenticatedApi, updateVisitType)
router.delete('/api/visits/types/:id', authenticatedApi, deleteVisitType)

export default router