import { Router } from 'express'
import { addPatientPermission, getPatientsPermission, getPatientsPermissions, updatePatientPermission, deletePatientPermission, viewPatientsPermissionsPage } from '../controllers/patient.permission.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// Pages
router.get('/patients/permission', authenticatedPage, viewPatientsPermissionsPage)

// APIs
router.get('/api/patients/permission', authenticatedApi, getPatientsPermissions)
router.post('/api/patients/permission', authenticatedApi, addPatientPermission)
router.get('/api/patients/permission/:id', authenticatedApi, getPatientsPermission)
router.put('/api/patients/permission/:id', authenticatedApi, updatePatientPermission)
router.delete('/api/patients/permission/:id', authenticatedApi, deletePatientPermission)

export default router