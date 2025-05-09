import { Router } from 'express'
import { addMedicineCategory, deleteMedicineCategory, getMedicineCategories, getMedicineCategory, updateMedicineCategory, viewMedicineCategoriesPage } from '../controllers/medicine.category.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/medicine/categories', authenticatedPage, viewMedicineCategoriesPage)

// APIs
router.get('/api/medicine/categories', authenticatedApi, getMedicineCategories)
router.post('/api/medicine/categories', authenticatedApi, addMedicineCategory)
router.get('/api/medicine/categories/:id', authenticatedApi, getMedicineCategory)
router.put('/api/medicine/categories/:id', authenticatedApi, updateMedicineCategory)
router.delete('/api/medicine/categories/:id', authenticatedApi, deleteMedicineCategory)

export default router