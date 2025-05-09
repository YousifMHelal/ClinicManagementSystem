import { Router } from 'express'
import { addPatientMedicine, getAllPatientMedicine, getPatientMedicine, updatePatientMedicine, deletePatientMedicine } from '../controllers/patient.medicine.controller.js'
import { authenticatedApi } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// APIs
router.get('/api/patients/medicine', authenticatedApi, getAllPatientMedicine)
router.post('/api/patients/medicine', authenticatedApi, addPatientMedicine)
router.get('/api/patients/medicine/:id', authenticatedApi, getPatientMedicine)
router.put('/api/patients/medicine/:id', authenticatedApi, updatePatientMedicine)
router.delete('/api/patients/medicine/:id', authenticatedApi, deletePatientMedicine)

export default router