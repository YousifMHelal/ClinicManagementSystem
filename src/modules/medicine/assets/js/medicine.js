const medicineTableBody = document.getElementById('medicineTableBodyId')
const addMedicineForm = document.getElementById('addMedicineFormId')
const addMedicineNameInput = document.getElementById('addMedicineNameInputId')
const addMedicineUnitSelect = document.getElementById('addMedicineUnitSelectId')
const addMedicineCategorySelect = document.getElementById('addMedicineCategorySelectId')
const addMedicineExpiresAtInput = document.getElementById('addMedicineExpiresAtInputId')
const submitAddMedicineButton = document.getElementById('submitAddMedicineButtonId')
const closeAddMedicineForm = document.getElementById('closeAddMedicineFormId')
const overlayDiv = document.getElementById('overlayDivId')
const addNewMedicineButton = document.getElementById('addNewMedicineButtonId')
const updateMedicineForm = document.getElementById('updateMedicineFormId')
const closeUpdateMedicineForm = document.getElementById('closeUpdateMedicineFormId')
const updateMedicineNameInput = document.getElementById('updateMedicineNameInputId')
const updateMedicineUnitSelect = document.getElementById('updateMedicineUnitSelectId')
const updateMedicineCategorySelect = document.getElementById('updateMedicineCategorySelectId')
const updateMedicineExpiresAtInput = document.getElementById('updateMedicineExpiresAtInputId')
const submitUpdateMedicineButton = document.getElementById('submitUpdateMedicineButtonId')
const updateMedicineIdSpan = document.getElementById('updateMedicineIdSpanId')
const medicineSearchInput = document.getElementById('medicineSearchInputId')
const categorySelect = document.getElementById('categorySelectId')
const printButton = document.getElementById('printButtonId')

var params = {}

document.addEventListener('DOMContentLoaded', () => {

    loadMedicineCategorySelectOptions(categorySelect).then(() => (categorySelect.innerHTML = `<option value="0">التصنيف</option>\n${categorySelect.innerHTML}`))
    
    fillMedicineTable()

})

medicineSearchInput.addEventListener('input', () => {
    params.keyword = medicineSearchInput.value.trim()
    fillMedicineTable()
})

categorySelect.addEventListener('change', () => {
    const categoryId = categorySelect.options[categorySelect.selectedIndex].value
    params.categoryId = parseInt(categoryId) > 0 ? categoryId : undefined
    fillMedicineTable()
})

printButton.addEventListener('click', () => {
    location.assign('/api/medicine/print' + stringifyParams(params))
})

addNewMedicineButton.addEventListener('click', toggleAddMedicineForm)
closeAddMedicineForm.addEventListener('click', toggleAddMedicineForm)
submitAddMedicineButton.addEventListener('click', submitAddMedicine)
submitUpdateMedicineButton.addEventListener('click', submitUpdateMedicine)
closeUpdateMedicineForm.addEventListener('click', toggleUpdateMedicineForm)

function fillMedicineTable() {
    axios.get('/api/medicine', { params }).then((response) => {
        const medicineList = response.data.data.content
        medicineTableBody.innerHTML = medicineList.length === 0
            ? '<tr><td colspan="7">لا يوجد دواء</td></tr>'
            : medicineList.reduce((body, medicine) => {
                const row = `
                    <tr record-id="${medicine.id}">
                        <td>${medicine.name}</td>
                        <td>${medicine.category_name}</td>
                        <td>${medicine.expires_at}</td>
                        <td>${(medicine.total_amount >> 0)} ${medicine.unit_name}</td>
                        <td>${(medicine.used_amount ?? 0)} ${medicine.unit_name}</td>
                        <td>${(medicine.total_amount >> 0) - (medicine.used_amount ?? 0)} ${medicine.unit_name}</td>
                        <td class="col-6 col-md-1" style="text-align: left">
                            <i title="حذف" onclick="deleteMedicineOnClick(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updateMedicineOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function toggleAddMedicineForm() {
    loadMedicineUnitsSelectOptions(addMedicineUnitSelect)
    loadMedicineCategorySelectOptions(addMedicineCategorySelect)
    addMedicineNameInput.value = ''
    addMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
}

function toggleUpdateMedicineForm() {
    updateMedicineUnitSelect.innerHTML = ''
    updateMedicineCategorySelect.innerHTML = ''
    updateMedicineNameInput.value = ''
    updateMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
}

function submitAddMedicine() {
    const name = addMedicineNameInput.value.trim()
    const expiresAt = addMedicineExpiresAtInput.value.trim()
    const categoryId = addMedicineCategorySelect.options[addMedicineCategorySelect.selectedIndex].value
    const unitId = addMedicineUnitSelect.options[addMedicineUnitSelect.selectedIndex].value

    if (name.length === 0) {
        return alert('اسم الدواء فارغ')
    }
    
    if (expiresAt.length === 0) {
        return alert('تاريخ الانتهاء فارغ')
    }
    
    axios.post('/api/medicine', { name, expiresAt, categoryId, unitId }).then(() => {
        fillMedicineTable()
        toggleAddMedicineForm()
    }).catch(handleError)
}

function submitUpdateMedicine() {
    const id = updateMedicineIdSpan.innerHTML
    const name = updateMedicineNameInput.value.trim()
    const expiresAt = updateMedicineExpiresAtInput.value.trim()
    const categoryId = updateMedicineCategorySelect.options[updateMedicineCategorySelect.selectedIndex].value
    const unitId = updateMedicineUnitSelect.options[updateMedicineUnitSelect.selectedIndex].value

    if (name.length === 0) {
        return alert('اسم الدواء فارغ')
    }
    
    if (expiresAt.length === 0) {
        return alert('تاريخ الانتهاء فارغ')
    }
    
    axios.put(`/api/medicine/${id}`, { name, categoryId, unitId, expiresAt }).then(() => {
        fillMedicineTable()
        toggleUpdateMedicineForm()
    }).catch(handleError)
}

function updateMedicineOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.get(`/api/medicine/${id}`).then((response) => {
        const medicine = response.data.data
        toggleUpdateMedicineForm()
        loadMedicineUnitsSelectOptions(updateMedicineUnitSelect, undefined, undefined, medicine.unit_id)
        loadMedicineCategorySelectOptions(updateMedicineCategorySelect, undefined, undefined, medicine.category_id)
        updateMedicineNameInput.value = medicine.name
        updateMedicineIdSpan.innerHTML = medicine.id
        updateMedicineExpiresAtInput.value = medicine.expires_at
    }).catch(handleError)
}

function deleteMedicineOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/medicine/${id}`).then(fillMedicineTable).catch(handleError)
}