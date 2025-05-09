import { Router } from 'express'
import { addSpecialType, deleteSpecialType, getSpecialType, getSpecialTypes, updateSpecialType, viewSpecialTypesPage } from '../controllers/special.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/specials', authenticatedPage, viewSpecialTypesPage)

// APIs
router.get('/api/specials', authenticatedApi, getSpecialTypes)
router.post('/api/specials', authenticatedApi, addSpecialType)
router.get('/api/specials/:id', authenticatedApi, getSpecialType)
router.put('/api/specials/:id', authenticatedApi, updateSpecialType)
router.delete('/api/specials/:id', authenticatedApi, deleteSpecialType)

export default router