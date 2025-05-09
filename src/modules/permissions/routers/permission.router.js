import { Router } from 'express'
import { addPermissionType, deletePermissionType, getPermissionType, getPermissionTypes, updatePermissionType, viewPermissionTypesPage } from '../controllers/permission.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/permissions', authenticatedPage, viewPermissionTypesPage)

// APIs
router.post('/api/permissions', authenticatedApi, addPermissionType)
router.get('/api/permissions', authenticatedApi, getPermissionTypes)
router.get('/api/permissions/:id', authenticatedApi, getPermissionType)
router.put('/api/permissions/:id', authenticatedApi, updatePermissionType)
router.delete('/api/permissions/:id', authenticatedApi, deletePermissionType)

export default router