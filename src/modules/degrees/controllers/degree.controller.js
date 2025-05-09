import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewDegreesPage = (request, response) => {

    response.render('../src/modules/degrees/views/degrees.view.ejs')

}

export const getDegrees = (request, response) => {

    run('SELECT * FROM degrees').then((records) => {
        response.status(200).json({ success: true, message: '', data: { content: records, total: records.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getDegree = (request, response) => {

    const { id } = request.params

    run('SELECT * FROM degrees WHERE id = ?', [ id ]).then((records) => {
        response.status(200).json({ success: true, message: '', data: records[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addDegree = (request, response) => {

    const { name } = request.body

    run('INSERT INTO degrees (name) VALUES (?)', [ name ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updateDegree = (request, response) => {

    const { id } = request.params
    const { name } = request.body

    run('UPDATE degrees SET name = ? WHERE id = ?', [ name, id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deleteDegree = async (request, response) => {

    const { id } = request.params

    const [ { count } ] = await run('SELECT COUNT(*) AS count FROM patients WHERE degree_id = ?', [ id ])
    if (count > 0) return response.status(400).json({ success: false, message: 'الدرجة تحتوي علي جنود' })

    run('DELETE FROM degrees WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}