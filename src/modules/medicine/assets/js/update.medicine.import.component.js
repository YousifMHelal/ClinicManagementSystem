const updateMedicineImportForm = document.getElementById('updateMedicineImportFormId')
const closeUpdateMedicineImportForm = document.getElementById('closeUpdateMedicineImportFormId')
const updateMedicineImportDoctorNameInput = document.getElementById('updateMedicineImportDoctorNameInputId')
const updateMedicineImportTimestampInput = document.getElementById('updateMedicineImportTimestampInputId')
const updateMedicineImportIdSpan = document.getElementById('updateMedicineImportIdSpanId')
const submitUpdateMedicineImportButton = document.getElementById('submitUpdateMedicineImportButtonId')

function setUpdateMedicineImportValues(id) {
    return axios.get(`/api/medicine/imports/${id}`).then((response) => {
        const data = response.data.data
        updateMedicineImportIdSpan.innerHTML = data.id
        updateMedicineImportDoctorNameInput.value = data.doctor_name
        updateMedicineImportTimestampInput.value = data.timestamp
    }).catch(handleError)
}

function submitUpdateMedicineImport() {
    const id = updateMedicineImportIdSpan.innerHTML
    const doctorName = updateMedicineImportDoctorNameInput.value.trim()
    const timestamp = updateMedicineImportTimestampInput.value.trim()
    if (doctorName.length === 0) {
        return alert('اسم دكتور فارغ')
    }
    if (timestamp.length === 0) {
        return alert('تاريخ ووقت فارغ')
    }
    return axios.put(`/api/medicine/imports/${id}`, { doctorName, timestamp }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}