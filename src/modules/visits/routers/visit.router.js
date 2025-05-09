import { Router } from 'express'
import { addVisit, deleteVisit, getVisit, getVisits, printVisits, updateVisit, viewVisitPage, viewVisitsPage } from '../controllers/visit.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/visits', authenticatedPage, viewVisitsPage)
router.get('/visits/:id', authenticatedPage, viewVisitPage)

// APIs
router.get('/api/visits', authenticatedApi, getVisits)
router.post('/api/visits', authenticatedApi, addVisit)
router.get('/api/visits/print', authenticatedApi, printVisits)
router.get('/api/visits/:id', authenticatedApi, getVisit)
router.put('/api/visits/:id', authenticatedApi, updateVisit)
router.delete('/api/visits/:id', authenticatedApi, deleteVisit)

export default router