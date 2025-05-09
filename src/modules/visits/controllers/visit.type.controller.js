import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewVisitTypesPage = (request, response) => {

    response.render('../src/modules/visits/views/visit.types.view.ejs')

}

export const getVisitTypes = (request, response) => {

    run('SELECT * FROM visits_types').then((records) => {
        response.status(200).json({ success: true, message: '', data: { content: records, total: records.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getVisitType = (request, response) => {

    const { id } = request.params

    run('SELECT * FROM visits_types WHERE id = ?', [ id ]).then((records) => {
        response.status(200).json({ success: true, message: '', data: records[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addVisitType = (request, response) => {

    const { name } = request.body

    run('INSERT INTO visits_types (name) VALUES (?)', [ name ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updateVisitType = (request, response) => {

    const { id } = request.params
    const { name } = request.body

    run('UPDATE visits_types SET name = ? WHERE id = ?', [ name, id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deleteVisitType = async (request, response) => {

    const { id } = request.params

    const [ { count } ] = await run('SELECT COUNT(*) AS count FROM patients_visits WHERE type_id = ?', [ id ])
    if (count > 0) return response.status(400).json({ success: false, message: 'نوع العيادة يحتوي علي زيارات' })

    run('DELETE FROM visits_types WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}