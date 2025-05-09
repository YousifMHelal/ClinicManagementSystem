import xlsx from 'xlsx' 
import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const viewMedicineExportsPage = (request, response) => {
    
    response.render('../src/modules/medicine/views/medicine.exports.view.ejs')

}

export const printMedicineExports = (request, response) => {

    const { patientId, degreeId, categoryId, fromDay, toDay } = request.query

    const conditions = []

    try {
        if (patientId) {
            conditions.push({ column: 'p.id', operator: '=', value: '?', params: [ patientId ] })
        }
        if (degreeId) {
            conditions.push({ column: 'd.id', operator: '=', value: '?', params: [ degreeId ] })
        }
        if (categoryId) {
            conditions.push({ column: 'mc.id', operator: '=', value: '?', params: [ categoryId ] })
        }
        if (fromDay) {
            conditions.push({ column: 'substr(pv.timestamp, 0, 11)', operator: '>=', value: '?', params: [ fromDay ] })
        }
        if (toDay) {
            conditions.push({ column: 'substr(pv.timestamp, 0, 11)', operator: '<=', value: '?', params: [ toDay ] })
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
        SELECT 
        p.name AS 'اسم المريض',
        d.name AS 'الدرجة',
        m.name AS 'اسم الدواء',
        mc.name AS 'التصنيف',
        CONCAT(pm.amount, ' ', mu.name) AS 'الكمية',
        pv.timestamp AS 'التاريخ والوقت'
        FROM patients_medicine AS pm
        INNER JOIN patients AS p ON pm.patient_id = p.id
        INNER JOIN patients_visits AS pv ON pm.visit_id = pv.id
        INNER JOIN medicine AS m ON pm.medicine_id = m.id
        INNER JOIN medicine_categories AS mc ON m.category_id = mc.id
        INNER JOIN degrees AS d ON d.id = p.degree_id
        INNER JOIN medicine_units AS mu ON mu.id = m.unit_id
        ${whereStatement}`, params
    ).then((data) => {

        const worksheet = xlsx.utils.json_to_sheet(data)
        const workbook = xlsx.utils.book_new()
        
        xlsx.utils.book_append_sheet(workbook, worksheet, 'الدواء المنصرف')
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        
        response.setHeader('Content-Disposition', 'attachment; filename="medicine-exports.xlsx"')
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
        response.send(buffer)

    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}

export const getMedicineExports = (request, response) => {

    const { patientId, degreeId, categoryId, fromDay, toDay } = request.query

    const conditions = []

    try {
        // TODO: validation
        if (patientId) {
            conditions.push({ column: 'p.id', operator: '=', value: '?', params: [ patientId ] })
        }
        if (degreeId) {
            conditions.push({ column: 'd.id', operator: '=', value: '?', params: [ degreeId ] })
        }
        if (categoryId) {
            conditions.push({ column: 'mc.id', operator: '=', value: '?', params: [ categoryId ] })
        }
        if (fromDay) {
            conditions.push({ column: 'substr(pv.timestamp, 0, 11)', operator: '>=', value: '?', params: [ fromDay ] })
        }
        if (toDay) {
            conditions.push({ column: 'substr(pv.timestamp, 0, 11)', operator: '<=', value: '?', params: [ toDay ] })
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
        SELECT m.name AS medicine_name, mc.name AS category_name, p.name AS patient_name, pv.timestamp, pm.amount, d.name AS degree_name, mu.name AS unit_name, pm.visit_id, pm.id
        FROM patients_medicine AS pm
        INNER JOIN patients AS p ON pm.patient_id = p.id
        INNER JOIN patients_visits AS pv ON pm.visit_id = pv.id
        INNER JOIN medicine AS m ON pm.medicine_id = m.id
        INNER JOIN medicine_categories AS mc ON m.category_id = mc.id
        INNER JOIN degrees AS d ON d.id = p.degree_id
        INNER JOIN medicine_units AS mu ON mu.id = m.unit_id
        ${whereStatement}`, params).then((exports) => {
        response.status(200).json({ success: true, message: '', data: { content: exports, total: exports.length } })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: error.message })
    })

}