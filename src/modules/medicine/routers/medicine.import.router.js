import { Router } from 'express'
import { addMedicineImport, getMedicineImport, getMedicineImportItem, getMedicineImportItems, getMedicineImports, addMedicineImportItem, updateMedicineImport, viewMedicineImport, viewMedicineImports, updateMedicineImportItem, deleteMedicineImportItem, deleteMedicineImport } from '../controllers/medicine.import.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/medicine/imports', authenticatedPage, viewMedicineImports)
router.get('/medicine/imports/:id', authenticatedPage, viewMedicineImport)

// APIs
router.post('/api/medicine/imports', authenticatedApi, addMedicineImport)
router.get('/api/medicine/imports', authenticatedApi, getMedicineImports)
router.get('/api/medicine/imports/:id', authenticatedApi, getMedicineImport)
router.put('/api/medicine/imports/:id', authenticatedApi, updateMedicineImport)
router.delete('/api/medicine/imports/:id', authenticatedApi, deleteMedicineImport)
router.post('/api/medicine/imports/:id', authenticatedApi, addMedicineImportItem)
router.get('/api/medicine/imports/:id/items', authenticatedApi, getMedicineImportItems)
router.get('/api/medicine/imports/items/:id', authenticatedApi, getMedicineImportItem)
router.put('/api/medicine/imports/items/:id', authenticatedApi, updateMedicineImportItem)
router.delete('/api/medicine/imports/items/:id', authenticatedApi, deleteMedicineImportItem)

export default router