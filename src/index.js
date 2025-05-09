import cors from 'cors'
import dotenv from 'dotenv'
import cookie from 'cookie-parser'
import express from 'express'
import visitsRouter from './modules/visits/routers/visit.router.js'
import degreeRouter from './modules/degrees/routers/degree.router.js'
import patientRouter from './modules/patients/routers/patient.router.js'
import specialsRouter from './modules/specials/routers/special.router.js'
import medicineRouter from './modules/medicine/routers/medicine.router.js'
import categoriesRouter from './modules/home/routers/home.router.js'
import visitsTypesRouter from './modules/visits/routers/visit.type.router.js'
import permissionsRouter from './modules/permissions/routers/permission.router.js'
import medicineUnitsRouter from './modules/medicine/routers/medicine.unit.router.js'
import authenticationRouter from './modules/authentication/routers/authentication.router.js'
import medicineExportsRouter from './modules/medicine/routers/medicine.export.router.js'
import medicineImportsRouter from './modules/medicine/routers/medicine.import.router.js'
import patientMedicineRouter from './modules/patients/routers/patient.medicine.router.js'
import patientPermissionRouter from './modules/patients/routers/patient.permission.router.js'
import medicineCategoriesRouter from './modules/medicine/routers/medicine.category.router.js'
import patientPersonalMedicineRouter from './modules/patients/routers/patient.personal.medicine.router.js'
import { parseJsonwebtoken } from './modules/authentication/middlewares/authentication.middlewares.js'
import { initializeAdminUserIfNotExists } from './utils/starter.utils.js'
import * as logger from './utils/console.logger.js'

dotenv.config()

const port = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(cookie())
app.use(express.json())

app.use(express.static('src/modules/home/assets'))
app.use(express.static('src/modules/common/assets'))
app.use(express.static('src/modules/visits/assets'))
app.use(express.static('src/modules/degrees/assets'))
app.use(express.static('src/modules/specials/assets'))
app.use(express.static('src/modules/patients/assets'))
app.use(express.static('src/modules/medicine/assets'))
app.use(express.static('src/modules/permissions/assets'))
app.use(express.static('src/modules/authentication/assets'))

app.use(parseJsonwebtoken)
app.use(patientPersonalMedicineRouter)
app.use(categoriesRouter)
app.use(visitsTypesRouter)
app.use(visitsRouter)
app.use(degreeRouter)
app.use(permissionsRouter)
app.use(patientMedicineRouter)
app.use(patientPermissionRouter)
app.use(patientRouter)
app.use(specialsRouter)
app.use(medicineCategoriesRouter)
app.use(medicineExportsRouter)
app.use(medicineImportsRouter)
app.use(medicineUnitsRouter)
app.use(medicineRouter)
app.use(authenticationRouter)

app.get('*', (_, response) => (response.status(404).render('../src/modules/common/views/not.found.view.ejs')))

app.listen(port, () => (logger.info(`Server is running on port ${port}`)))

initializeAdminUserIfNotExists()