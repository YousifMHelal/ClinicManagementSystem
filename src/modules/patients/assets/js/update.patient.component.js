const updatePatientIdSpan = document.getElementById('updatePatientIdSpanId')
const updatePatientForm = document.getElementById('updatePatientFormId')
const closeUpdatePatientForm = document.getElementById('closeUpdatePatientFormId')
const updatePatientNameInput = document.getElementById('updatePatientNameInputId')
const updatePatientMIDInput = document.getElementById('updatePatientMIDInputId')
const updatePatientDegreeSelect = document.getElementById('updatePatientDegreeSelectId')
const submitUpdatePatientButton = document.getElementById('submitUpdatePatientButtonId')
const updatePatientNotesInput = document.getElementById('updatePatientNotesInputId')

function setUpdatePatientValues(patientId) {
    return axios.get(`/api/patients/${patientId}`).then((response) => {
        const patient = response.data.data
        loadDegreesSelectOptions(updatePatientDegreeSelect, undefined, undefined, patient.degree_id)
        updatePatientIdSpan.innerHTML = patient.id
        updatePatientNameInput.value = patient.name
        updatePatientMIDInput.value = patient.military_id ?? ''
        updatePatientNotesInput.value = patient.notes ?? ''
    }).catch(handleError)
}

function submitUpdatePatient() {
    const id = updatePatientIdSpan.innerHTML
    const name = updatePatientNameInput.value.trim()
    let notes = updatePatientNotesInput.value.trim()
    let militaryId = updatePatientMIDInput.value.trim()
    const degreeId = updatePatientDegreeSelect.options[updatePatientDegreeSelect.selectedIndex].value
    if (name.length === 0) {
        return alert('اسم مريض فارغ')
    }
    militaryId = militaryId === '' ? undefined : militaryId
    notes = notes === '' ? undefined : notes
    return axios.put(`/api/patients/${id}`, { name, militaryId, degreeId, notes }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}