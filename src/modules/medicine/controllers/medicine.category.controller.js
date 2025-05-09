import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewMedicineCategoriesPage = (request, response) => {

    response.render('../src/modules/medicine/views/medicine.categories.view.ejs')

}

export const getMedicineCategories = (request, response) => {

    run('SELECT * FROM medicine_categories').then((categories) => {
        response.status(200).json({ success: true, message: '', data: { content: categories, total: categories.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getMedicineCategory = (request, response) => {

    const { id } = request.params

    run('SELECT * FROM medicine_categories WHERE id = ?', [ id ]).then((categories) => {
        response.status(200).json({ success: true, message: '', data: categories[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const addMedicineCategory = (request, response) => {

    const { name } = request.body

    run('INSERT INTO medicine_categories (name) VALUES (?)', [ name ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updateMedicineCategory = (request, response) => {

    const { id } = request.params
    const { name } = request.body

    run('UPDATE medicine_categories SET name = ? WHERE id = ?', [ name, id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deleteMedicineCategory = async (request, response) => {

    const { id } = request.params

    const [ { medicineCount } ] = await run('SELECT COUNT(*) AS medicineCount FROM medicine WHERE category_id = ?', [ id ])
    if (medicineCount > 0) return response.status(400).json({ success: false, message: 'التصنيف يحتوي علي دواء' })

    run('DELETE FROM medicine_categories WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}