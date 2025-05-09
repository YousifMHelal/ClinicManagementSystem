import { Router } from 'express'
import { addUnit, deleteMedicineUnit, getUnit, getUnits, updateUnit, viewUnitsPage } from '../controllers/medicine.unit.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/medicine/units', authenticatedPage, viewUnitsPage)

// APIs
router.get('/api/medicine/units', authenticatedApi, getUnits)
router.post('/api/medicine/units', authenticatedApi, addUnit)
router.get('/api/medicine/units/:id', authenticatedApi, getUnit)
router.put('/api/medicine/units/:id', authenticatedApi, updateUnit)
router.delete('/api/medicine/units/:id', authenticatedApi, deleteMedicineUnit)

export default router