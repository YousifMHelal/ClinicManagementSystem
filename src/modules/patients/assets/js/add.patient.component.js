const addNewPatientButton = document.getElementById('addNewPatientButtonId')
const closeAddPatientForm = document.getElementById('closeAddPatientFormId')
const addPatientNameInput = document.getElementById('addPatientNameInputId')
const addPatientMIDInput = document.getElementById('addPatientMIDInputId')
const submitAddPatientButton = document.getElementById('submitAddPatientButtonId')
const addPatientDegreeSelect = document.getElementById('addPatientDegreeSelectId')

function submitAddPatient() {
    const name = addPatientNameInput.value.trim()
    let militaryId = addPatientMIDInput.value.trim()
    const degreeId = addPatientDegreeSelect.options[addPatientDegreeSelect.selectedIndex].value
    if (name.length === 0) {
        return alert('اسم مريض فارغ')
    }
    militaryId = militaryId === '' ? undefined : militaryId
    return axios.post('/api/patients', { name, militaryId, degreeId }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}
