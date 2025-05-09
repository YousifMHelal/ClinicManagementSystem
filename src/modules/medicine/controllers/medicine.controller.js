import xlsx from 'xlsx'
import { run } from '../../../utils/database.utils.js'
import { defined, greaterThanEqualOrThrow, matchOrThrow, notEmpty, notEmptyOrThrow, numberOrThrow } from '../../../utils/validation.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewMedicinePage = (request, response) => {

    response.render('../src/modules/medicine/views/medicine.view.ejs')

}

export const addMedicine = async (request, response) => {

    const { name, expiresAt, categoryId, unitId } = request.body

    try {
        notEmptyOrThrow(name, 'Missing or invalid name')
        const [ { count } ] = await run('SELECT COUNT(*) AS count FROM medicine WHERE name = ?', [ name.trim() ])
        if (count > 0) throw new Error('Name already exists')

        notEmptyOrThrow(expiresAt, 'Missing or invalid expires data')
        matchOrThrow(expiresAt, /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Invalid expires data')

        greaterThanEqualOrThrow(categoryId, 1, 'Missing or invalid category ID')
        const categories = await run('SELECT COUNT(*) AS count FROM medicine_categories WHERE id = ?', [ categoryId ])
        if (categories.length === 0) throw new Error('Category not found')

        greaterThanEqualOrThrow(unitId, 1, 'Missing or invalid unit ID')
        const units = await run('SELECT COUNT(*) AS count FROM medicine_units WHERE id = ?', [ unitId ])
        if (units.length === 0) throw new Error('Unit not found')
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    run('INSERT INTO medicine (name, expires_at, category_id, unit_id) VALUES (?, ?, ?, ?)', [ name.trim(), expiresAt, categoryId, unitId ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const printMedicine = (request, response) => {

    const { keyword, categoryId } = request.query
    const conditions = []
    let whereStatement = ''

    try {
        if (defined(keyword) && notEmpty(keyword)) {
            conditions.push({ column: 'm.name', operator: 'LIKE', value: `CONCAT('%', ?, '%')`, params: [ keyword ] })
        }

        if (defined(categoryId)) {
            conditions.push({ column: 'm.category_id', operator: '=', value: `?`, params: [ categoryId ] })
        }
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    let params = []
    if (conditions.length > 0) {
        whereStatement = conditions.reduce((statement, condition, index) => {
            const prefix = index === 0 ? '' : 'AND'
            params = params.concat(condition.params)
            return `${statement} ${prefix} ${condition.column} ${condition.operator} ${condition.value}`
        }, 'WHERE')
    }

    run(`
        SELECT
        m.name AS 'اسم الدواء',
        mc.name AS 'التصنيف',
        m.expires_at AS 'تاريخ الانتهاء',
        mu.name AS unit_name,
        ( SELECT SUM(pp.amount) FROM patients_medicine AS pp WHERE pp.medicine_id = m.id ) AS 'المستهلك',
        ( SELECT SUM(mii.amount) FROM medicine_imports_items AS mii WHERE mii.medicine_id = m.id ) AS 'المصروف'
        FROM medicine AS m
        INNER JOIN medicine_categories AS mc ON mc.id = m.category_id
        INNER JOIN medicine_units AS mu ON mu.id = m.unit_id
        ${whereStatement}
    `, params).then((data) => {

        data = data.map((dataItem) => ({
            'اسم الدواء': dataItem['اسم الدواء'],
            'التصنيف': dataItem['التصنيف'],
            'تاريخ الانتهاء': dataItem['تاريخ الانتهاء'],
            'المصروف': `${(dataItem['المصروف'] ?? 0)} ${dataItem.unit_name}`,
            'المستهلك': `${(dataItem['المستهلك'] ?? 0)} ${dataItem.unit_name}`,
            'المتاح': `${(dataItem['المصروف'] ?? 0) - (dataItem['المستهلك'] ?? 0)} ${dataItem.unit_name}`
        }))

        const worksheet = xlsx.utils.json_to_sheet(data)
        const workbook = xlsx.utils.book_new()
        
        xlsx.utils.book_append_sheet(workbook, worksheet, 'الدواء')
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        
        response.setHeader('Content-Disposition', 'attachment; filename="medicine.xlsx"')
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        response.send(buffer)

    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getAllMedicine = (request, response) => {

    const { keyword, categoryId } = request.query
    const conditions = []
    let whereStatement = ''

    try {
        if (defined(keyword) && notEmpty(keyword)) {
            conditions.push({ column: 'm.name', operator: 'LIKE', value: `CONCAT('%', ?, '%')`, params: [ keyword ] })
        }

        if (defined(categoryId)) {
            conditions.push({ column: 'm.category_id', operator: '=', value: `?`, params: [ categoryId ] })
        }
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    let params = []
    if (conditions.length > 0) {
        whereStatement = conditions.reduce((statement, condition, index) => {
            const prefix = index === 0 ? '' : 'AND'
            params = params.concat(condition.params)
            return `${statement} ${prefix} ${condition.column} ${condition.operator} ${condition.value}`
        }, 'WHERE')
    }

    run(`
        SELECT m.id, m.name, m.unit_id, m.expires_at, mu.name AS unit_name, m.category_id, mc.name AS category_name, (
            SELECT SUM(pp.amount) FROM patients_medicine AS pp WHERE pp.medicine_id = m.id
        ) AS used_amount, (
            SELECT SUM(mii.amount) FROM medicine_imports_items AS mii WHERE mii.medicine_id = m.id
        ) AS total_amount
        FROM medicine AS m
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

export const updateMedicine = async (request, response) => {

    const { id } = request.params
    const { name, categoryId, unitId, expiresAt } = request.body

    const changes = []

    try {
        greaterThanEqualOrThrow(id, 1, 'Missing or invalid medicine ID')
        const [ { count } ] = await run('SELECT COUNT(*) AS count FROM medicine WHERE id = ?', [ id ])
        if (count === 0) throw new Error('Medicine not found')

        if (defined(name)) {
            notEmptyOrThrow(name, 'Missing or invalid name')
            changes.push({ column: 'name', value: '?', params: [ name ] })
        }

        if (defined(categoryId)) {
            greaterThanEqualOrThrow(categoryId, 1, 'Missing or invalid category ID')
            const categories = await run('SELECT COUNT(*) AS count FROM medicine_categories WHERE id = ?', [ categoryId ])
            if (categories.length === 0) throw new Error('Category not found')
            changes.push({ column: 'category_id', value: '?', params: [ categoryId ] })
        }

        if (defined(unitId)) {
            greaterThanEqualOrThrow(unitId, 1, 'Missing or invalid unit ID')
            const units = await run('SELECT COUNT(*) AS count FROM medicine_units WHERE id = ?', [ unitId ])
            if (units.length === 0) throw new Error('Unit not found')
            changes.push({ column: 'unit_id', value: '?', params: [ unitId ] })
        }

        if (defined(expiresAt)) {
            notEmptyOrThrow(expiresAt, 'Missing or invalid expires data')
            matchOrThrow(expiresAt, /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Invalid expires data')
            changes.push({ column: 'expires_at', value: '?', params: [ expiresAt ] })
        }

        if (changes.length === 0) throw new Error('No changes found')
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    let params = []
    const updateStatement = changes.reduce((statement, change, index) => {
        const prefix = index === 0 ? '' : ', '
        params = params.concat(change.params ?? [])
        return `${statement} ${prefix} ${change.column} = ${change.value ?? '?'}`
    }, 'UPDATE medicine SET')
    
    params.push(id)
    run(`${updateStatement} WHERE id = ?`, params).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const getMedicine = async (request, response) => {

    const { id } = request.params

    try {
        greaterThanEqualOrThrow(id, 1, 'Missing or invalid medicine ID')
        const [ { count } ] = await run('SELECT COUNT(*) AS count FROM medicine WHERE id = ?', [ id ])
        if (count === 0) throw new Error('Medicine not found')
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    run(`
        SELECT m.id, m.name, m.unit_id, m.expires_at, mu.name AS unit_name, m.category_id, mc.name AS category_name, (
            SELECT SUM(pp.amount) FROM patients_medicine AS pp WHERE pp.medicine_id = m.id
        ) AS used_amount, (
            SELECT SUM(mii.amount) FROM medicine_imports_items AS mii WHERE mii.medicine_id = m.id
        ) AS total_amount
        FROM medicine AS m
        INNER JOIN medicine_categories AS mc ON mc.id = m.category_id
        INNER JOIN medicine_units AS mu ON mu.id = m.unit_id
        WHERE m.id = ?
    `, [ id ]).then((medicineList) => {
        response.status(200).json({ success: true, message: '', data: medicineList[0] })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deleteMedicine = async (request, response) => {

    const { id } = request.params

    try {
        greaterThanEqualOrThrow(id, 1, 'Missing or invalid medicine ID')
        const [ { count } ] = await run('SELECT COUNT(*) AS count FROM medicine WHERE id = ?', [ id ])
        if (count === 0) throw new Error('Medicine not found')
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    const [ { usedCount } ] = await run('SELECT COUNT(*) AS usedCount FROM patients_medicine WHERE medicine_id = ?', [ id ])
    if (usedCount > 0) return response.status(400).json({ success: false, message: 'الدواء يحتوي علي صرفيات سابق' })

    const [ { totalCount } ] = await run('SELECT COUNT(*) AS totalCount FROM medicine_imports_items WHERE medicine_id = ?', [ id ])
    if (totalCount > 0) return response.status(400).json({ success: false, message: 'الدواء يحتوي علي استهلاك سابق' })

    run('DELETE FROM medicine WHERE id = ?', [ id ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}