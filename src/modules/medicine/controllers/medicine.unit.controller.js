import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewUnitsPage = (request, response) => {

    response.render('../src/modules/medicine/views/medicine.units.view.ejs')

}

export const getUnits = (request, response) => {

    run('SELECT * FROM medicine_units').then((units) => {
        response.status(200).json({ success: true, message: '', data: { content: units, total: units.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getUnit = (request, response) => {

    const { id } = request.params

    run('SELECT * FROM medicine_units WHERE id = ?', [ id ]).then((units) => {
        response.status(200).json({ success: true, message: '', data: units[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addUnit = (request, response) => {

    const { name } = request.body

    run('INSERT INTO medicine_units (name) VALUES (?)', [ name ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updateUnit = (request, response) => {

    const { id } = request.params
    const { name } = request.body

    run('UPDATE medicine_units SET name = ? WHERE id = ?', [ name, id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deleteMedicineUnit = async (request, response) => {

    const { id } = request.params

    const [ { medicineCount } ] = await run('SELECT COUNT(*) AS medicineCount FROM medicine WHERE unit_id = ?', [ id ])
    if (medicineCount > 0) return response.status(400).json({ success: false, message: 'وحدة القياس تحتوي علي دواء' })

    run('DELETE FROM medicine_units WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}