import { Router } from 'express'
import { addMedicine, deleteMedicine, getAllMedicine, getMedicine, printMedicine, updateMedicine, viewMedicinePage } from '../controllers/medicine.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/medicine', authenticatedPage, viewMedicinePage)

// APIs
router.post('/api/medicine', authenticatedApi, addMedicine)
router.get('/api/medicine', authenticatedApi, getAllMedicine)
router.get('/api/medicine/print', authenticatedApi, printMedicine)
router.get('/api/medicine/:id', authenticatedApi, getMedicine)
router.put('/api/medicine/:id', authenticatedApi, updateMedicine)
router.delete('/api/medicine/:id', authenticatedApi, deleteMedicine)

export default router