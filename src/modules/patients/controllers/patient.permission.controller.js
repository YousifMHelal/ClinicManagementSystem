import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewPatientsPermissionsPage = (request, response) => {

    response.render('../src/modules/patients/views/permissions.view.ejs')

}

export const getPatientsPermissions = (request, response) => {

    const { patientId, visitId, degreeId, permissionTypeId } = request.query
    
    const conditions = []

    try {
        // TODO: validation
        if (patientId) {
            conditions.push({ column: 'pp.patient_id', operator: '=', value: '?', params: [ patientId ] })
        }
        if (visitId) {
            conditions.push({ column: 'pp.visit_id', operator: '=', value: '?', params: [ visitId ] })
        }
        if (degreeId) {
            conditions.push({ column: 'pat.degree_id', operator: '=', value: '?', params: [ degreeId ] })
        }
        if (permissionTypeId) {
            conditions.push({ column: 'pp.permission_id', operator: '=', value: '?', params: [ permissionTypeId ] })
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
        SELECT pp.id, pp.patient_id, pp.visit_id, pp.starts_at, pp.ends_at, pp.description, pp.permission_id,
        p.name AS permission_name, pat.name AS patient_name, d.name AS degree_name
        FROM patients_permissions AS pp
        INNER JOIN permissions AS p ON p.id = pp.permission_id
        INNER JOIN patients AS pat ON pat.id = pp.patient_id
        INNER JOIN degrees AS d ON d.id = pat.degree_id
        ${whereStatement}
    `, params).then((permissions) => {
        response.status(200).json({ success: true, message: '', data: { content: permissions, total: permissions.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addPatientPermission = (request, response) => {

    const { patientId, visitId, permissionId, startsAt, endsAt, description } = request.body

    run(
        `INSERT INTO patients_permissions (patient_id, visit_id, permission_id, starts_at, ends_at, description) VALUES (?, ?, ?, ?, ?, ?)`,
        [ patientId, visitId, permissionId, startsAt, endsAt, description ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getPatientsPermission = (request, response) => {

    const { id } = request.params

    run(`
        SELECT pp.id, pp.patient_id, pp.visit_id, pp.starts_at, pp.ends_at, pp.description, pp.permission_id, p.name AS permission_name
        FROM patients_permissions AS pp
        INNER JOIN permissions AS p ON p.id = pp.permission_id
        WHERE pp.id=?
    `, [ id ]).then((permissions) => {
        response.status(200).json({ success: true, message: '', data: permissions[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updatePatientPermission = (request, response) => {

    const { id } = request.params
    const { permissionId, startsAt, endsAt, description } = request.body

    run(
        `UPDATE patients_permissions SET permission_id = ?, starts_at = ?, ends_at = ?, description = ? WHERE id = ?`,
        [ permissionId, startsAt, endsAt, description, id ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deletePatientPermission = (request, response) => {

    const { id } = request.params

    run('DELETE FROM patients_permissions WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}