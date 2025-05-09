import { Router } from 'express'
import { getMedicineExports, printMedicineExports, viewMedicineExportsPage } from '../controllers/medicine.export.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/medicine/exports', authenticatedPage, viewMedicineExportsPage)

// APIs
router.get('/api/medicine/exports', authenticatedApi, getMedicineExports)
router.get('/api/medicine/exports/print', authenticatedApi, printMedicineExports)

export default router