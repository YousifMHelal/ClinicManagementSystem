import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewMedicineImports = (request, response) => {
    
    response.render('../src/modules/medicine/views/medicine.imports.view.ejs')

}

export const viewMedicineImport = (request, response) => {
    
    // TODO: parameter validation
    response.render('../src/modules/medicine/views/medicine.import.view.ejs')

}

export const addMedicineImport = (request, response) => {

    const { doctorName, timestamp } = request.body

    run(`
        INSERT INTO medicine_imports (doctor_name, timestamp) VALUES (?, ?)`,
        [ doctorName, timestamp ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const getMedicineImports = (request, response) => {

    const { keyword, day } = request.query

    const conditions = []

    try {
        // TODO: validation
        if (keyword) {
            conditions.push({ column: 'mi.doctor_name', operator: 'LIKE', value: `CONCAT('%', ?, '%')`, params: [ keyword ] })
        }
        if (day) {
            conditions.push({ column: 'substr(mi.timestamp, 0, 11)', operator: '=', value: '?', params: [ day ] })
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
        SELECT mi.id, mi.timestamp, mi.doctor_name, (
            SELECT COUNT(*) FROM medicine_imports_items AS mii WHERE mii.import_id = mi.id
        ) AS medicine_count FROM medicine_imports AS mi
        ${whereStatement}
    `, params).then((imports) => {
        response.status(200).json({ success: true, message: '', data: { content: imports, total: imports.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const getMedicineImport = (request, response) => {

    const { id } = request.params

    run(`
        SELECT mi.id, mi.timestamp, mi.doctor_name, (
            SELECT COUNT(*) FROM medicine_imports_items AS mii WHERE mii.import_id = mi.id
        ) AS medicine_count FROM medicine_imports AS mi
        WHERE id = ?`, [ id ]).then((imports) => {
        response.status(200).json({ success: true, message: '', data: imports[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const updateMedicineImport = (request, response) => {

    const { id } = request.params
    const { doctorName, timestamp } = request.body

    run(`UPDATE medicine_imports SET doctor_name = ?, timestamp = ? WHERE id = ?`,
        [ doctorName, timestamp, id ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const deleteMedicineImport = (request, response) => {

    const { id } = request.params

    Promise.all([
        run(`DELETE FROM medicine_imports WHERE id = ?`, [ id ]),
        run(`DELETE FROM medicine_imports_items WHERE import_id = ?`, [ id ])
    ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const getMedicineImportItems = (request, response) => {

    const { id } = request.params

    // TODO: validation

    run(`
        SELECT mii.id, mii.amount, mc.name AS medicine_category_name, m.name AS medicine_name, mu.name AS medicine_unit_name
        FROM medicine_imports_items AS mii 
        INNER JOIN medicine AS m ON m.id = mii.medicine_id 
        INNER JOIN medicine_categories AS mc ON m.category_id = mc.id
        INNER JOIN medicine_units AS mu ON m.unit_id = mu.id
        WHERE mii.import_id = ?    
    `, [ id ]).then((items) => {
        response.status(200).json({ success: true, message: '', data: { content: items, total: items.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const addMedicineImportItem = (request, response) => {

    const { id } = request.params
    const { medicineId, amount } = request.body

    run(
        `INSERT INTO medicine_imports_items (import_id, medicine_id, amount) VALUES (?, ?, ?)`, 
        [ id, medicineId, amount ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const getMedicineImportItem = (request, response) => {

    const { id } = request.params

    run(`
        SELECT mii.id, mii.amount, mc.name AS medicine_category_name, m.name AS medicine_name, mu.name AS medicine_unit_name, m.category_id, mii.medicine_id
        FROM medicine_imports_items AS mii 
        INNER JOIN medicine AS m ON m.id = mii.medicine_id
        INNER JOIN medicine_categories AS mc ON m.category_id = mc.id
        INNER JOIN medicine_units AS mu ON m.unit_id = mu.id
        WHERE mii.id = ?    
    `, [ id ]).then((items) => {
        response.status(200).json({ success: true, message: '', data: items[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const updateMedicineImportItem = (request, response) => {

    const { id } = request.params
    const { medicineId, amount } = request.body

    run(
        `UPDATE medicine_imports_items SET medicine_id = ?, amount = ? WHERE id = ?`, 
        [ medicineId, amount, id ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const deleteMedicineImportItem = (request, response) => {

    const { id } = request.params

    run(`DELETE FROM medicine_imports_items WHERE id = ?`, [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}