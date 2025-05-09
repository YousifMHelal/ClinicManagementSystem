import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewSpecialTypesPage = (request, response) => {

    response.render('../src/modules/specials/views/special.view.ejs')

}

export const getSpecialTypes = (request, response) => {

    run('SELECT * FROM specials').then((records) => {
        response.status(200).json({ success: true, message: '', data: { content: records, total: records.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getSpecialType = (request, response) => {

    const { id } = request.params

    run('SELECT * FROM specials WHERE id = ?', [ id ]).then((records) => {
        response.status(200).json({ success: true, message: '', data: records[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addSpecialType = (request, response) => {

    const { name } = request.body

    run('INSERT INTO specials (name) VALUES (?)', [ name ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updateSpecialType = (request, response) => {

    const { id } = request.params
    const { name } = request.body

    run('UPDATE specials SET name = ? WHERE id = ?', [ name, id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deleteSpecialType = async (request, response) => {

    const { id } = request.params

    const [ { count } ] = await run('SELECT COUNT(*) AS count FROM patients_visits WHERE special_id = ?', [ id ])
    if (count > 0) return response.status(400).json({ success: false, message: 'التخصص يحتوي علي زيارات' })

    run('DELETE FROM specials WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}