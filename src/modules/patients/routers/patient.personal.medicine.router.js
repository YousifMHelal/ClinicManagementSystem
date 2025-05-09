import { Router } from 'express'
import { addPatientMedicine, deletePatientMedicine, getAllPatientMedicine, getPatientMedicine, updatePatientMedicine } from '../controllers/patient.personal.medicine.controller.js'
import { authenticatedApi } from '../../authentication/middlewares/authentication.middlewares.js'

const router = Router()

// APIs
router.get('/api/patients/persoanl/medicine', authenticatedApi, getAllPatientMedicine)
router.post('/api/patients/persoanl/medicine', authenticatedApi, addPatientMedicine)
router.get('/api/patients/persoanl/medicine/:id', authenticatedApi, getPatientMedicine)
router.put('/api/patients/persoanl/medicine/:id', authenticatedApi, updatePatientMedicine)
router.delete('/api/patients/persoanl/medicine/:id', authenticatedApi, deletePatientMedicine)

export default router