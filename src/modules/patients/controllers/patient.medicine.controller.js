import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const getAllPatientMedicine = (request, response) => {

    const { visitId } = request.query

    const conditions = []

    try {
        // TODO: validation
        if (visitId) {
            conditions.push({ column: 'visit_id', operator: '=', value: '?', params: [ visitId ] })
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

    // TODO: pagination

    run(`
        SELECT pm.id, m.name, mu.name AS unit_name, pm.amount, m.category_id, mc.name AS category_name
        FROM patients_medicine AS pm
        INNER JOIN medicine AS m ON m.id = pm.medicine_id
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

export const addPatientMedicine = (request, response) => {

    const { patientId, visitId, medicineId, amount } = request.body

    run(
        `INSERT INTO patients_medicine (patient_id, visit_id, medicine_id, amount) VALUES (?, ?, ?, ?)`,
        [ patientId, visitId, medicineId, amount ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updatePatientMedicine = (request, response) => {

    const { id } = request.params
    const { medicineId, amount } = request.body

    run(
        `UPDATE patients_medicine SET medicine_id = ?, amount = ? WHERE id = ?`,
        [ medicineId, amount, id ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getPatientMedicine = (request, response) => {

    const { id } = request.params

    run(`
        SELECT pm.id, m.name, mu.name AS unit_name, pm.amount, m.category_id, mc.name AS category_name, pm.medicine_id
        FROM patients_medicine AS pm
        INNER JOIN medicine AS m ON m.id = pm.medicine_id
        INNER JOIN medicine_categories AS mc ON mc.id = m.category_id
        INNER JOIN medicine_units AS mu ON mu.id = m.unit_id
        WHERE pm.id = ?
    `, [ id ]).then((medicineList) => {
        response.status(200).json({ success: true, message: '', data: medicineList[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deletePatientMedicine = (request, response) => {

    const { id } = request.params

    run('DELETE FROM patients_medicine WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}