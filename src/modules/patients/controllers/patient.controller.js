import xlsx from 'xlsx'
import * as logger from '../../../utils/console.logger.js'
import { run } from '../../../utils/database.utils.js'
import { defined, greaterThanEqualOrThrow, notEmpty, notEmptyOrThrow } from '../../../utils/validation.utils.js'

export const viewPatientsPage = (request, response) => {

    response.render('../src/modules/patients/views/patients.view.ejs')

}

export const viewPatientPage = (request, response) => {

    // TODO: validate id
    response.render('../src/modules/patients/views/patient.view.ejs')

}

export const printPatients = (request, response) => {

    const { keyword, degreeId } = request.query

    const conditions = []

    try {
        if (defined(keyword) && notEmpty(keyword)) {
            conditions.push({ column: '', operator: '', value: `(p.name LIKE CONCAT('%', ?, '%') OR p.military_id LIKE CONCAT('%', ?, '%'))`, params: [ keyword, keyword ] })
        }
        if (defined(degreeId)) {
            conditions.push({ column: 'p.degree_id', operator: '=', value: '?', params: [ degreeId ] })
        }
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    let params = []
    let whereStatement = ''
    if (conditions.length > 0) {
        whereStatement = conditions.reduce((statement, condition, index) => {
            const prefix = index === 0 ? '' : 'AND'
            params = params.concat(condition.params)
            return `${statement} ${prefix} ${condition.column} ${condition.operator} ${condition.value}`
        }, 'WHERE')
    }

    run(`
        SELECT
        p.name AS 'اسم المريض',
        d.name AS 'الدرجة',
        p.military_id AS 'الرقم العسكري',
        ( SELECT COUNT(*) FROM patients_visits AS pv WHERE pv.patient_id = p.id ) AS 'عدد الزيارات',
        p.notes AS 'ملاحظات'
        FROM patients AS p
        INNER JOIN degrees AS d ON d.id = p.degree_id
        ${whereStatement}
    `, params).then((data) => {

        const worksheet = xlsx.utils.json_to_sheet(data)
        const workbook = xlsx.utils.book_new()
        
        xlsx.utils.book_append_sheet(workbook, worksheet, 'المرضي')
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        
        response.setHeader('Content-Disposition', 'attachment; filename="patients.xlsx"')
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        response.send(buffer)

    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getPatients = (request, response) => {

    const { keyword, degreeId } = request.query
    const conditions = []
    let whereStatement = ''

    try {
        if (defined(keyword) && notEmpty(keyword)) {
            conditions.push({ column: '', operator: '', value: `(p.name LIKE CONCAT('%', ?, '%') OR p.military_id LIKE CONCAT('%', ?, '%'))`, params: [ keyword, keyword ] })
        }
        if (defined(degreeId)) {
            conditions.push({ column: 'p.degree_id', operator: '=', value: '?', params: [ degreeId ] })
        }
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    let params = []
    if (conditions.length > 0) {
        whereStatement = conditions.reduce((statement, condition, index) => {
            const prefix = index === 0 ? '' : 'AND'
            params = params.concat(condition.params)
            return `${statement} ${prefix} ${condition.column} ${condition.operator} ${condition.value}`
        }, 'WHERE')
    }

    run(`
        SELECT p.id, p.name, p.military_id, p.notes, p.degree_id, d.name AS degree, (
            SELECT COUNT(*) FROM patients_visits AS pv WHERE pv.patient_id = p.id
        ) AS visits_count
        FROM patients AS p
        INNER JOIN degrees AS d ON d.id = p.degree_id
        ${whereStatement}
    `, params).then((patients) => {
        response.status(200).json({ success: true, message: '', data: { content: patients, total: patients.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getPatient = (request, response) => {

    const { id } = request.params

    try {

    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    run(`
        SELECT p.id, p.name, p.military_id, p.notes, p.degree_id, d.name AS degree
        FROM patients AS p
        INNER JOIN degrees AS d ON d.id = p.degree_id
        WHERE p.id = ?
    `, [ id ]).then((patients) => {
        response.status(200).json({ success: true, message: '', data: patients[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addPatient = (request, response) => {

    const { name, militaryId = null, notes = null, degreeId } = request.body

    try {

    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    run(
        `INSERT INTO patients (name, military_id, notes, degree_id) VALUES (?, ?, ?, ?)`,
        [ name, militaryId, notes, degreeId ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updatePatient = async (request, response) => {

    const { id } = request.params
    const { name, militaryId = null, notes = null, degreeId } = request.body

    const changes = []

    try {
        greaterThanEqualOrThrow(id, 1, 'Missing or invalid patient ID')
        const [ { count } ] = await run('SELECT COUNT(*) AS count FROM patients WHERE id = ?', [ id ])
        if (count === 0) throw new Error('Patient not found')

        if (defined(name)) {
            notEmptyOrThrow(name, 'Missing or invalid name')
            changes.push({ column: 'name', value: '?', params: [ name ] })
        }

        if (defined(militaryId)) {
            changes.push({ column: 'military_id', value: '?', params: [ militaryId ] })
        }

        if (defined(notes)) {
            changes.push({ column: 'notes', value: '?', params: [ notes ] })
        }

        if (defined(degreeId)) {
            changes.push({ column: 'degree_id', value: '?', params: [ degreeId ] })
        }

        if (changes.length === 0) throw new Error('No changes found')
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    let params = []
    const updateStatement = changes.reduce((statement, change, index) => {
        const prefix = index === 0 ? '' : ', '
        params = params.concat(change.params ?? [])
        return `${statement} ${prefix} ${change.column} = ${change.value ?? '?'}`
    }, 'UPDATE patients SET')
    
    params.push(id)
    run(`${updateStatement} WHERE id = ?`, params).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deletePatient = async (request, response) => {

    const { id } = request.params

    const [ { visitsCount } ] = await run('SELECT COUNT(*) AS visitsCount FROM patients_visits WHERE patient_id = ?', [ id ])
    if (visitsCount > 0) return response.status(400).json({ success: false, message: 'المريض له زيارات سابقة' })

    const [ { count } ] = await run('SELECT COUNT(*) AS count FROM patients_personal_medicine WHERE patient_id = ?', [ id ])
    if (count > 0) return response.status(400).json({ success: false, message: 'المريض له دواء خاص' })

    run('DELETE FROM patients WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}