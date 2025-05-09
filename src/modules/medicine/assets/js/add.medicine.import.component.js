const addMedicineImportForm = document.getElementById('addMedicineImportFormId')
const closeAddMedicineImportForm = document.getElementById('closeAddMedicineImportFormId')
const addMedicineImportDoctorNameInput = document.getElementById('addMedicineImportDoctorNameInputId')
const addMedicineImportTimestampInput = document.getElementById('addMedicineImportTimestampInputId')
const submitAddMedicineImportButton = document.getElementById('submitAddMedicineImportButtonId')

function submitAddMedicineImport() {
    const doctorName = addMedicineImportDoctorNameInput.value.trim()
    const timestamp = addMedicineImportTimestampInput.value.trim()
    if (doctorName.length === 0) {
        return alert('اسم دكتور فارغ')
    }
    if (timestamp.length === 0) {
        return alert('تاريخ ووقت فارغ')
    }
    return axios.post('/api/medicine/imports', { doctorName, timestamp }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}