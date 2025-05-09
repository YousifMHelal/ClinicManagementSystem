const exportsTableBody = document.getElementById('exportsTableBodyId')
const degreeFilterSelect = document.getElementById('degreeFilterSelectId')
const categorySelect = document.getElementById('categorySelectId')
const toDayInput = document.getElementById('toDayInputId')
const fromDayInput = document.getElementById('fromDayInputId')
const printButton = document.getElementById('printButtonId')

var params = {}

document.addEventListener('DOMContentLoaded', () => {

    loadDegreesSelectOptions(degreeFilterSelect).then(() => (degreeFilterSelect.innerHTML = `<option value="0">الدرجة</option>\n${degreeFilterSelect.innerHTML}`))
    loadMedicineCategorySelectOptions(categorySelect).then(() => (categorySelect.innerHTML = `<option value="0">التصنيف</option>\n${categorySelect.innerHTML}`))

    fillMedicineExportsTable()

})

degreeFilterSelect.addEventListener('change', () => {
    const degreeId = degreeFilterSelect.options[degreeFilterSelect.selectedIndex].value
    params.degreeId = parseInt(degreeId) > 0 ? degreeId : undefined
    fillMedicineExportsTable()
})

categorySelect.addEventListener('change', () => {
    const categoryId = categorySelect.options[categorySelect.selectedIndex].value
    params.categoryId = parseInt(categoryId) > 0 ? categoryId : undefined
    fillMedicineExportsTable()
})

fromDayInput.addEventListener('change', () => {
    const fromDay = fromDayInput.value.trim()
    params.fromDay = fromDay.length > 0 ? fromDay : undefined
    fillMedicineExportsTable()
})

toDayInput.addEventListener('change', () => {
    const toDay = toDayInput.value.trim()
    params.toDay = toDay.length > 0 ? toDay : undefined
    fillMedicineExportsTable()
})

printButton.addEventListener('click', () => {
    location.assign('/api/medicine/exports/print' + stringifyParams(params))
})

function fillMedicineExportsTable() {
    axios.get('/api/medicine/exports', { params }).then((response) => {
        const items = response.data.data.content
        exportsTableBody.innerHTML = items.length === 0
            ? '<tr><td colspan="7">لا يوجد منصرف الدواء</td></tr>'
            : items.reduce((body, item) => {
                const row = `
                    <tr record-id="${item.id}">
                        <td>${item.patient_name}</td>
                        <td>${item.degree_name}</td>
                        <td>${item.medicine_name}</td>
                        <td>${item.category_name}</td>
                        <td>${item.amount} ${item.unit_name}</td>
                        <td>${parseDateTime(item.timestamp)}</td>
                        <td class="col-6 col-md-1" style="text-align: left">
                            <i title="حذف" onclick="deletePatientMedicine(this)" class="bi bi-trash-fill pointer ms-3" style="color: red"></i>
                            <a href="/visits/${item.visit_id}"><i title="عرض" class="bi bi-eye pointer ms-3" style="color: var(--sub)"></i></a>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function deletePatientMedicine(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/patients/medicine/${id}`).then(fillMedicineExportsTable).catch(handleError)
}