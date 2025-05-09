import { Router } from 'express'
import { addPatient, deletePatient, getPatient, getPatients, printPatients, updatePatient, viewPatientPage, viewPatientsPage } from '../controllers/patient.controller.js'
import { authenticatedApi, authenticatedPage } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

//Pages
router.get('/patients', authenticatedPage, viewPatientsPage)
router.get('/patients/:id', authenticatedPage, viewPatientPage)

// APIs
router.get('/api/patients', authenticatedApi, getPatients)
router.post('/api/patients', authenticatedApi, addPatient)
router.get('/api/patients/print', authenticatedApi, printPatients)
router.get('/api/patients/:id', authenticatedApi, getPatient)
router.put('/api/patients/:id', authenticatedApi, updatePatient)
router.delete('/api/patients/:id', authenticatedApi, deletePatient)

export default router