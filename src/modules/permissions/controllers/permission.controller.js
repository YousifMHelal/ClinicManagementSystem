import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewPermissionTypesPage = (request, response) => {

    response.render('../src/modules/permissions/views/permission.types.view.ejs')

}

export const getPermissionTypes = (request, response) => {

    run('SELECT * FROM permissions').then((records) => {
        response.status(200).json({ success: true, message: '', data: { content: records, total: records.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getPermissionType = (request, response) => {

    const { id } = request.params

    run('SELECT * FROM permissions WHERE id = ?', [ id ]).then((records) => {
        response.status(200).json({ success: true, message: '', data: records[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addPermissionType = (request, response) => {

    const { name } = request.body

    run('INSERT INTO permissions (name) VALUES (?)', [ name ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updatePermissionType = (request, response) => {

    const { id } = request.params
    const { name } = request.body

    run('UPDATE permissions SET name = ? WHERE id = ?', [ name, id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deletePermissionType = async (request, response) => {

    const { id } = request.params

    const [ { count } ] = await run('SELECT COUNT(*) AS count FROM patients_permissions WHERE permission_id = ?', [ id ])
    if (count > 0) return response.status(400).json({ success: false, message: 'نوع الازرنيك يحتوي علي اورنيكات للمرضي' })

    run('DELETE FROM permissions WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}