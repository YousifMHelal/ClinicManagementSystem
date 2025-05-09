const patientName = document.getElementById('patientNameId')
const patientDegree = document.getElementById('patientDegreeId')
const patientMilitary = document.getElementById('patientMilitaryId')
const patientNotes = document.getElementById('patientNotesId')
const patientVisitsTableBody = document.getElementById('patientVisitsTableBodyId')
const patientPermissionsTableBody = document.getElementById('patientPermissionsTableBodyId')
const addPatientVisitButton = document.getElementById('addPatientVisitButtonId')
const addPatientVisitForm = document.getElementById('addPatientVisitFormId')
const closePatientVisitForm = document.getElementById('closePatientVisitFormId')
const overlayDiv = document.getElementById('overlayDivId')
const addVisitOpenionInput = document.getElementById('addVisitOpenionInputId')
const addVisitTypeSelect = document.getElementById('addVisitTypeSelectId')
const addVisitSpecialSelect = document.getElementById('addVisitSpecialSelectId')
const addVisitDoctorNameInput = document.getElementById('addVisitDoctorNameInputId')
const addVisitSecondVisitAtInput = document.getElementById('addVisitSecondVisitAtInputId')
const addVisitTimestampInput = document.getElementById('addVisitTimestampInputId')
const submitAddVisitButton = document.getElementById('submitAddVisitButtonId')
const updatePatientButton = document.getElementById('updatePatientButtonId')
const patientPersonalMedicineTableBody = document.getElementById('patientPersonalMedicineTableBodyId')
const addPatientPersonalMedicineButton = document.getElementById('addPatientPersonalMedicineButtonId')
const addPatientPersonalMedicineForm = document.getElementById('addPatientPersonalMedicineFormId')
const closeAddPatientPersonalMedicineButton = document.getElementById('closeAddPatientPersonalMedicineButtonId')
const addPatientPersonalMedicineSelect = document.getElementById('addPatientPersonalMedicineSelectId')
const addPatientPersonalMedicineCategorySelect = document.getElementById('addPatientPersonalMedicineCategorySelectId')
const addPatientPersonalMedicineTimestamp = document.getElementById('addPatientPersonalMedicineTimestampId')
const addPatientPersonalMedicineAmountInput = document.getElementById('addPatientPersonalMedicineAmountInputId')
const submitAddPatientPersonalMedicineButton = document.getElementById('submitAddPatientPersonalMedicineButtonId')

const updatePatientPersonalMedicineForm = document.getElementById('updatePatientPersonalMedicineFormId')
const closeUpdatePatientPersonalMedicineButton = document.getElementById('closeUpdatePatientPersonalMedicineButtonId')
const updatePatientPersonalMedicineCategorySelect = document.getElementById('updatePatientPersonalMedicineCategorySelectId')
const updatePatientPersonalMedicineSelect = document.getElementById('updatePatientPersonalMedicineSelectId')
const updatePatientPersonalMedicineTimestamp = document.getElementById('updatePatientPersonalMedicineTimestampId')
const updatePatientPersonalMedicineAmountInput = document.getElementById('updatePatientPersonalMedicineAmountInputId')
const submitUpdatePatientPersonalMedicineButton = document.getElementById('submitUpdatePatientPersonalMedicineButtonId')
const updatePatientPersonalMedicineIdSpan = document.getElementById('updatePatientPersonalMedicineIdSpanId')

var patientId
var visitsParams = {}
var permissionsParams = {}
var personalMedicineParams = {}

document.addEventListener('DOMContentLoaded', () => {

    location.pathname.split('/').forEach((urlPart) => {
        if (urlPart.trim().length > 0 && /^[0-9]*$/.test(urlPart)) {
            patientId = parseInt(urlPart)
            visitsParams.patientId = patientId
            permissionsParams.patientId = patientId
            personalMedicineParams.patientId = patientId
        }
    })

    fillPatientDetails()
    fillPatientVisitsTable()
    fillPatientPermissionsTable()
    fillPatientPersonalMedicineTable()
})

addPatientVisitButton.addEventListener('click', () => {
    toggleAddVisitForm()
    loadSpecialsSelectOptions(addVisitSpecialSelect)
    loadVisitsTypesSelectOptions(addVisitTypeSelect)
    addVisitTimestampInput.value = new Date().toISOString().substring(0, 16)
})

closeUpdatePatientForm.addEventListener('click', () => {
    updatePatientForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdatePatientButton.addEventListener('click', () => {
    submitUpdatePatient().then(() => {
        fillPatientDetails()
        updatePatientForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

closeUpdatePatientVisitForm.addEventListener('click', () => {
    updatePatientVisitForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdateVisitButton.addEventListener('click', () => {
    submitUpdateVisit().then(() => {
        fillPatientVisitsTable()
        updatePatientVisitForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

addPatientPersonalMedicineButton.addEventListener('click', () => {
    addPatientPersonalMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
    addPatientPersonalMedicineTimestamp.value = new Date().toISOString().substring(0, 10)
    addPatientPersonalMedicineAmountInput.value = ''
    loadMedicineCategorySelectOptions(addPatientPersonalMedicineCategorySelect).then(fillMedicineSelect)
})

closeAddPatientPersonalMedicineButton.addEventListener('click', () => {
    addPatientPersonalMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitAddPatientPersonalMedicineButton.addEventListener('click', () => {
    if (addPatientPersonalMedicineSelect.selectedIndex === -1) {
        return alert('دواء فارغ')
    }
    const medicineId = addPatientPersonalMedicineSelect.options[addPatientPersonalMedicineSelect.selectedIndex].value
    const timestamp = addPatientPersonalMedicineTimestamp.value.trim()
    const amount = addPatientPersonalMedicineAmountInput.value.trim()
    if (timestamp.length === 0) return alert('تاريخ اضافة فارغ')
    if (amount.length === 0) return alert('كمية فارغة')
    axios.post('/api/patients/persoanl/medicine', { medicineId, timestamp, amount, patientId }).then(() => {
        fillPatientPersonalMedicineTable()
        addPatientPersonalMedicineForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    }).catch(handleError)
})

updatePatientPersonalMedicineCategorySelect.addEventListener('change', () => {
    const categoryId = updatePatientPersonalMedicineCategorySelect.options[updatePatientPersonalMedicineCategorySelect.selectedIndex].value
    loadMedicineSelectOptions(updatePatientPersonalMedicineSelect, { categoryId })
})

closeUpdatePatientPersonalMedicineButton.addEventListener('click', () => {
    updatePatientPersonalMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdatePatientPersonalMedicineButton.addEventListener('click', () => {
    const id = updatePatientPersonalMedicineIdSpan.innerHTML
    if (updatePatientPersonalMedicineSelect.selectedIndex === -1) {
        return alert('دواء فارغ')
    }
    const medicineId = updatePatientPersonalMedicineSelect.options[updatePatientPersonalMedicineSelect.selectedIndex].value
    const timestamp = updatePatientPersonalMedicineTimestamp.value.trim()
    const amount = updatePatientPersonalMedicineAmountInput.value.trim()
    if (timestamp.length === 0) return alert('تاريخ اضافة فارغ')
    if (amount.length === 0) return alert('كمية فارغة')
    axios.put(`/api/patients/persoanl/medicine/${id}`, { medicineId, timestamp, amount }).then(() => {
        fillPatientPersonalMedicineTable()
        updatePatientPersonalMedicineForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    }).catch(handleError)
})

closeUpdatePatientPermissionButton.addEventListener('click', () => {
    updatePatientPermissionForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdatePatientPermissionButton.addEventListener('click', () => {
    submitUpdatePatientPermission().then(() => {
        fillPatientPermissionsTable()
        updatePatientPermissionForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    }).catch(handleError)
})

closePatientVisitForm.addEventListener('click', toggleAddVisitForm)
submitAddVisitButton.addEventListener('click', submitAddVisit)
updatePatientButton.addEventListener('click', updatePatientOnClick)
addPatientPersonalMedicineCategorySelect.addEventListener('change', fillMedicineSelect)

function fillPatientVisitsTable() {
    axios.get('/api/visits', { params: visitsParams }).then((response) => {
        const visits = response.data.data.content
        patientVisitsTableBody.innerHTML = visits.length === 0
            ? '<tr><td colspan="5">لا يوجد زيارات</td></tr>'
            : visits.reduce((body, visit) => {
                const row = `
                    <tr record-id="${visit.id}">
                        <td>${visit.type}</td>
                        <td>${visit.special}</td>
                        <td>${visit.openion}</td>
                        <td>${parseDateTime(visit.timestamp)}</td>
                        <td class="col-6 col-md-2" style="text-align: left">
                            <i title="حذف" onclick="deleteVisitOnClick(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updateVisitOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                            <a href='/visits/${visit.id}'><i title="عرض" class='bi bi-eye pointer ms-3' style='color: var(--sub)'></i></a>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function fillPatientPermissionsTable() {
    axios.get('/api/patients/permission', { params: permissionsParams }).then((response) => {
        const permissions = response.data.data.content
        patientPermissionsTableBody.innerHTML = permissions.length === 0 
            ? '<tr><td colspan="5">لا يوجد اورنيك</td></tr>'
            : permissions.reduce((body, permission) => {
                const row = `
                    <tr record-id="${permission.id}">
                        <td>${permission.permission_name}</td>
                        <td>${permission.description ?? 'لا يوجد'}</td>
                        <td>${permission.starts_at}</td>
                        <td>${permission.ends_at}</td>
                        <td class="col-6 col-md-2" style="text-align: left">
                            <i title="حذف" onclick="deletePatientPermission(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updateVisitPermissionOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                            <a href='/visits/${permission.visit_id}'><i title="عرض" class='bi bi-eye pointer ms-3' style='color: var(--sub)'></i></a>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function fillPatientDetails() {
    axios.get(`/api/patients/${patientId}`).then((response) => {
        const patient = response.data.data
        patientName.innerHTML = patient.name
        patientDegree.innerHTML = patient.degree ?? 'لا يوجد'
        patientMilitary.innerHTML = patient.military_id ?? 'لا يوجد'
        patientNotes.innerHTML = patient.notes ?? 'لا يوجد'
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function toggleAddVisitForm() {
    addPatientVisitForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
}

function submitAddVisit() {
    let doctorName = addVisitDoctorNameInput.value.trim()
    let secondVisitAt = addVisitSecondVisitAtInput.value.trim()
    const openion = addVisitOpenionInput.value.trim()
    const timestamp = addVisitTimestampInput.value.trim()
    const typeId = addVisitTypeSelect.options[addVisitTypeSelect.selectedIndex].value
    const specialId = addVisitSpecialSelect.options[addVisitSpecialSelect.selectedIndex].value
    
    if (openion.length === 0) return alert('تشخيص فارغ')
    if (timestamp.length === 0) return alert('وقت زيارة فارغ')
    if (doctorName.length === 0) doctorName = undefined
    if (secondVisitAt.length === 0) secondVisitAt = undefined

    axios.post('/api/visits', { openion, timestamp, doctorName, secondVisitAt, typeId, specialId, patientId }).then(() => (location.reload())).catch(handleError)
}

function updateVisitOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    updateVisitAction(id).then(() => {
        updatePatientVisitForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function updatePatientOnClick() {
    setUpdatePatientValues(patientId).then(() => {
        updatePatientForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function fillPatientPersonalMedicineTable() {
    axios.get('/api/patients/persoanl/medicine', { params: personalMedicineParams }).then((response) => {
        const medicineList = response.data.data.content
        patientPersonalMedicineTableBody.innerHTML = medicineList.length === 0
            ? '<tr><td colspan="5">لا يوجد دواء</td></tr>'
            : medicineList.reduce((body, medicine) => {
                const row = `
                    <tr record-id="${medicine.id}">
                        <td>${medicine.medicine_name}</td>
                        <td>${medicine.category_name}</td>
                        <td>${parseDateTime(medicine.timestamp)}</td>
                        <td>${medicine.amount} ${medicine.unit_name}</td>
                        <td class="col-6 col-md-1" style="text-align: left">
                            <i title="حذف" onclick="deletePatientPersonalMedicineOnClick(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updatePatientPersonalMedicineOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function fillMedicineSelect() {
    const categoryId = addPatientPersonalMedicineCategorySelect.options[addPatientPersonalMedicineCategorySelect.selectedIndex].value
    loadMedicineSelectOptions(addPatientPersonalMedicineSelect, { categoryId })
}

function updatePatientPersonalMedicineOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.get(`/api/patients/persoanl/medicine/${id}`).then((response) => {
        const data = response.data.data
        updatePatientPersonalMedicineIdSpan.innerHTML = data.id
        updatePatientPersonalMedicineTimestamp.value = data.timestamp
        updatePatientPersonalMedicineAmountInput.value = data.amount
        loadMedicineCategorySelectOptions(updatePatientPersonalMedicineCategorySelect, undefined, undefined, data.category_id)
        loadMedicineSelectOptions(updatePatientPersonalMedicineSelect, undefined, undefined, data.medicine_id)
        updatePatientPersonalMedicineForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function deletePatientPersonalMedicineOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/patients/persoanl/medicine/${id}`).then(fillPatientPersonalMedicineTable).catch(handleError)
}

function updateVisitPermissionOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    setUpdatePatientPermissionValues(id).then(() => {
        updatePatientPermissionForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function deletePatientPermission(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/patients/permission/${id}`).then(fillPatientPermissionsTable).catch(handleError)
}

function deleteVisitOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/visits/${id}`).then(fillPatientVisitsTable).catch(handleError)
}