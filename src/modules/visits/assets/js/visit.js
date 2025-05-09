const patientMedicineTableBody = document.getElementById('patientMedicineTableBodyId')
const patientVisitsTableBody = document.getElementById('patientVisitsTableBodyId')
const patientPermissionsTableBody = document.getElementById('patientPermissionsTableBodyId')
const patientName = document.getElementById('patientNameId')
const patientDegree = document.getElementById('patientDegreeId')
const patientMilitary = document.getElementById('patientMilitaryId')
const patientNotes = document.getElementById('patientNotesId')
const patientActions = document.getElementById('patientActionsId')
const overlayDiv = document.getElementById('overlayDivId')
const addPatientMedicineButton = document.getElementById('addPatientMedicineButtonId')
const addPatientPermissionButton = document.getElementById('addPatientPermissionButtonId')
const updatePatientButton = document.getElementById('updatePatientButtonId')
const updatePatientVisitButton = document.getElementById('updatePatientVisitButtonId')

var visit
var visitId
var medicineParams = {}
var permissionsParams = {}

document.addEventListener('DOMContentLoaded', async () => {

    location.pathname.split('/').forEach((urlPart) => {
        if (urlPart.trim().length > 0 && /^[0-9]*$/.test(urlPart)) {
            visitId = parseInt(urlPart)
            medicineParams.visitId = visitId
            permissionsParams.visitId = visitId
        }
    })

    await axios.get(`/api/visits/${visitId}`).then((response) => {
        visit = response.data.data
    })
    
    fillPatientDetails()
    fillPatientVisitsTable()
    fillPatientMedicineTable()
    fillPatientPermissionsTable()

})

closeAddPatientMedicineButton.addEventListener('click', () => {
    addPatientMedicineAmount.value = ''
    addPatientMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

addPatientMedicineButton.addEventListener('click', () => {
    loadMedicineCategorySelectOptions(addPatientMedicineCategorySelect).then(fillMedicineSelect)
    addPatientMedicineAmount.value = ''
    addPatientMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitAddPatientMedicineButton.addEventListener('click', () => {
    submitAddPatientMedicine(visit.patient_id, visit.id).then(() => {
        fillPatientMedicineTable()
        addPatientMedicineForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

closeAddPatientPermissionButton.addEventListener('click', () => {
    addPatientPermissionDescription.value = ''
    addPatientPermissionStartsAt.value = ''
    addPatientPermissionEndsAt.value = ''
    addPatientPermissionForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

addPatientPermissionButton.addEventListener('click', () => {
    loadPermissionsSelectOptions(addPatientPermissionTypeSelect)
    addPatientPermissionDescription.value = ''
    addPatientPermissionStartsAt.value = ''
    addPatientPermissionEndsAt.value = ''
    addPatientPermissionForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitAddPatientPermissionButton.addEventListener('click', () => {
    submitAddPatientPermission(visit.patient_id, visit.id).then(() => {
        fillPatientPermissionsTable()
        addPatientPermissionForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
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

updatePatientVisitButton.addEventListener('click', () => {
    updateVisitAction(visitId).then(() => {
        updatePatientVisitForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

submitUpdateVisitButton.addEventListener('click', () => {
    submitUpdateVisit().then(() => {
        fillPatientVisitsTable()
        updatePatientVisitForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

closeUpdatePatientVisitForm.addEventListener('click', () => {
    updatePatientVisitForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

closeUpdatePatientMedicineButton.addEventListener('click', () => {
    updatePatientMedicineForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdatePatientMedicineButton.addEventListener('click', () => {
    submitUpdatePatientMedicine().then(() => {
        fillPatientMedicineTable()
        updatePatientMedicineForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

submitUpdatePatientPermissionButton.addEventListener('click', () => {
    submitUpdatePatientPermission().then(() => {
        fillPatientPermissionsTable()
        updatePatientPermissionForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

closeUpdatePatientPermissionButton.addEventListener('click', () => {
    updatePatientPermissionForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

updatePatientButton.addEventListener('click', updatePatientOnClick)

function fillPatientDetails() {
    axios.get(`/api/patients/${visit.patient_id}`).then((response) => {
        const patient = response.data.data
        patientName.innerHTML = patient.name
        patientDegree.innerHTML = patient.degree ?? 'لا يوجد'
        patientMilitary.innerHTML = patient.military_id ?? 'لا يوجد'
        patientNotes.innerHTML = patient.notes ?? 'لا يوجد'
        patientActions.innerHTML = `<a href='/patients/${patient.id}'><i title="عرض" class='bi bi-eye pointer' style='color: var(--sub)'></i></a>`
    }).catch(handleError)
}

function fillPatientVisitsTable() {
    axios.get(`/api/visits/${visitId}`).then((response) => {
        const visit = response.data.data
        patientVisitsTableBody.innerHTML = `
            <tr record-id="${visit.id}">
                <td>${visit.type}</td>
                <td>${visit.special}</td>
                <td>${visit.openion}</td>
                <td>${visit.doctor_name ?? 'لا يوجد'}</td>
                <td>${parseDateTime(visit.timestamp)}</td>
                <td>${visit.second_visit_at ?? 'لا يوجد'}</td>
            </tr>`
    }).catch(handleError)
}

function fillPatientMedicineTable() {
    axios.get('/api/patients/medicine', { params: medicineParams }).then((response) => {
        const medicineList = response.data.data.content
        patientMedicineTableBody.innerHTML = medicineList.length === 0
            ? '<tr><td colspan="4">لا يوجد دواء</td></tr>'
            : medicineList.reduce((body, medicine) => {
                const row = `
                    <tr record-id="${medicine.id}">
                        <td>${medicine.name}</td>
                        <td>${medicine.category_name}</td>
                        <td>${medicine.amount} ${medicine.unit_name}</td>
                        <td class="col-6 col-md-1">
                            <i title="حذف" onclick="deletePatientMedicine(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updateVisitMedicineOnClick(this)" class="bi bi-pencil-square pointer" style='color: rgb(85, 90, 98)'></i>
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
                        <td class="col-6 col-md-1">
                            <i title="حذف" onclick="deletePatientPermission(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updateVisitPermissionOnClick(this)" class="bi bi-pencil-square pointer" style='color: rgb(85, 90, 98)'></i>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function updateVisitOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    return axios.get(`/api/visits/${id}`).then((response) => {
        const visit = response.data.data
        updateVisitIdSpan.innerHTML = visit.id
        updateVisitOpenionInput.value = visit.openion
        updateVisitTimestampInput.value = visit.timestamp
        updateVisitDoctorNameInput.value = visit.doctor_name ?? ''
        updateVisitSecondVisitAtInput.value = visit.second_visit_at ?? ''
        loadSpecialsSelectOptions(updateVisitSpecialSelect, undefined, undefined, visit.special_id)
        loadVisitsTypesSelectOptions(updateVisitTypeSelect, undefined, undefined, visit.type_id)
        toggleUpdateVisitForm()
    }).catch(handleError)
}

function updatePatientOnClick() {
    setUpdatePatientValues(visit.patient_id).then(() => {
        updatePatientForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function updateVisitMedicineOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    return setUpdatePatientMedicineValues(id).then(() => {
        updatePatientMedicineForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function updateVisitPermissionOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    return setUpdatePatientPermissionValues(id).then(() => {
        updatePatientPermissionForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function deletePatientPermission(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/patients/permission/${id}`).then(fillPatientPermissionsTable).catch(handleError)
}

function deletePatientMedicine(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/patients/medicine/${id}`).then(fillPatientMedicineTable).catch(handleError)
}