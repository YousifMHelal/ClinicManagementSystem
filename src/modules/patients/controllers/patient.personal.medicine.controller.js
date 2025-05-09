import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const getAllPatientMedicine = (request, response) => {

    const { patientId } = request.query

    const conditions = []

    try {
        // TODO: validation
        if (patientId) {
            conditions.push({ column: 'ppm.patient_id', operator: '=', value: '?', params: [ patientId ] })
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
        SELECT ppm.id, ppm.medicine_id, m.name AS medicine_name, ppm.amount, ppm.timestamp, mc.id AS category_id, mc.name AS category_name, mu.name AS unit_name
        FROM patients_personal_medicine AS ppm
        INNER JOIN medicine AS m ON m.id = ppm.medicine_id
        INNER JOIN medicine_categories AS mc ON mc.id = m.category_id
        INNER JOIN medicine_units AS mu ON mu.id = m.unit_id
        ${whereStatement}
    `, params).then((medicineList) => {
        response.status(200).json({ success: true, message: '', data: { content: medicineList, total: medicineList.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getPatientMedicine = (request, response) => {

    const { id } = request.params

    run(`
        SELECT ppm.id, ppm.medicine_id, m.name AS medicine_name, ppm.amount, ppm.timestamp, mc.id AS category_id, mc.name AS category_name, mu.name AS unit_name
        FROM patients_personal_medicine AS ppm
        INNER JOIN medicine AS m ON m.id = ppm.medicine_id
        INNER JOIN medicine_categories AS mc ON mc.id = m.category_id
        INNER JOIN medicine_units AS mu ON mu.id = m.unit_id
        WHERE ppm.id = ?
    `, [ id ]).then((medicineList) => {
        response.status(200).json({ success: true, message: '', data: medicineList[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addPatientMedicine = (request, response) => {

    const { patientId, medicineId, amount, timestamp } = request.body

    run(
        `INSERT INTO patients_personal_medicine (patient_id, medicine_id, amount, timestamp) VALUES (?, ?, ?, ?)`,
        [ patientId, medicineId, amount, timestamp ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updatePatientMedicine = (request, response) => {

    const { id } = request.params
    const { medicineId, amount, timestamp } = request.body

    run(
        `UPDATE patients_personal_medicine SET medicine_id = ?, amount = ?, timestamp = ? WHERE id = ?`,
        [ medicineId, amount, timestamp, id ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deletePatientMedicine = (request, response) => {

    const { id } = request.params

    run(`DELETE FROM patients_personal_medicine WHERE id = ?`, [ id ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}