const patientsTableBody = document.getElementById('patientsTableBodyId')
const addPatientForm = document.getElementById('addPatientFormId')
const overlayDiv = document.getElementById('overlayDivId')
const patientsSearchInput = document.getElementById('patientsSearchInputId')
const degreeSelect = document.getElementById('degreeSelectId')
const printButton = document.getElementById('printButtonId')

var params = {}

document.addEventListener('DOMContentLoaded', () => {

    loadDegreesSelectOptions(degreeSelect).then(() => (degreeSelect.innerHTML = `<option value="0">الدرجة</option>\n${degreeSelect.innerHTML}`))

    fillPatientsTable()

})

degreeSelect.addEventListener('change', () => {
    const degreeId = degreeSelect.options[degreeSelect.selectedIndex].value
    params.degreeId = parseInt(degreeId) > 0 ? degreeId : undefined
    fillPatientsTable()
})

printButton.addEventListener('click', () => {
    location.assign('/api/patients/print' + stringifyParams(params))
})

patientsSearchInput.addEventListener('input', () => {
    params.keyword = patientsSearchInput.value.trim()
    fillPatientsTable()
})

closeAddPatientForm.addEventListener('click', () => {
    addPatientForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

addNewPatientButton.addEventListener('click', () => {
    loadDegreesSelectOptions(addPatientDegreeSelect)
    addPatientNameInput.value = ''
    addPatientMIDInput.value = ''
    addPatientForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitAddPatientButton.addEventListener('click', () => {
    submitAddPatient().then(() => {
        addPatientForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
        fillPatientsTable()
    })
})

closeUpdatePatientForm.addEventListener('click', () => {
    updatePatientForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdatePatientButton.addEventListener('click', () => {
    submitUpdatePatient().then(() => {
        fillPatientsTable()
        updatePatientForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

function fillPatientsTable() {
    axios.get('/api/patients', { params }).then((response) => {
        const patients = response.data.data.content
        patientsTableBody.innerHTML = patients.length === 0
            ? '<tr><td colspan="5">لا يوجد مرضي</td></tr>'
            : patients.reduce((body, patient) => {
                const row = `
                    <tr record-id="${patient.id}">
                        <td>${patient.name}</td>
                        <td>${patient.degree}</td>
                        <td>${patient.military_id ?? 'لا يوجد'}</td>
                        <td>${patient.visits_count}</td>
                        <td class="col-6 col-md-2" style="text-align: left">
                            <i title="حذف" onclick="deletePatientOnClick(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updatePatientOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                            <a href='/patients/${patient.id}'><i title="عرض" class='bi bi-eye pointer ms-3' style='color: var(--sub)'></i></a>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function updatePatientOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    setUpdatePatientValues(id).then(() => {
        updatePatientForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function deletePatientOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/patients/${id}`).then(fillPatientsTable).catch(handleError)
}