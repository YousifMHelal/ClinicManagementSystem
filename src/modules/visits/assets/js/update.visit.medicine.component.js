const updatePatientMedicineForm = document.getElementById('updatePatientMedicineFormId')
const closeUpdatePatientMedicineButton = document.getElementById('closeUpdatePatientMedicineButtonId')
const updatePatientMedicineCategorySelect = document.getElementById('updatePatientMedicineCategorySelectId')
const updatePatientMedicineSelect = document.getElementById('updatePatientMedicineSelectId')
const updatePatientMedicineAmount = document.getElementById('updatePatientMedicineAmountId')
const updatePatientMedicineIdSpan = document.getElementById('updatePatientMedicineIdSpanId')
const submitUpdatePatientMedicineButton = document.getElementById('submitUpdatePatientMedicineButtonId')

var params = {}

updatePatientMedicineCategorySelect.addEventListener('change', fillMedicineSelectForUpdate)

function fillMedicineSelectForUpdate() {
    params.categoryId = updatePatientMedicineCategorySelect.options[updatePatientMedicineCategorySelect.selectedIndex].value
    loadMedicineSelectOptions(updatePatientMedicineSelect, params)
}

function submitUpdatePatientMedicine() {
    const id = updatePatientMedicineIdSpan.innerHTML
    const amount = updatePatientMedicineAmount.value.trim()
    if (updatePatientMedicineSelect.selectedIndex === -1) {
        return alert('الدواء فارغة')
    }
    const medicineId = updatePatientMedicineSelect.options[updatePatientMedicineSelect.selectedIndex].value
    if (amount.length === 0) {
        return alert('الكمية فارغة')
    }
    return axios.put(`/api/patients/medicine/${id}`, { medicineId, amount }).catch(handleError)
}

function setUpdatePatientMedicineValues(id) {
    return axios.get(`/api/patients/medicine/${id}`).then((response) => {
        const data = response.data.data
        updatePatientMedicineIdSpan.innerHTML = data.id
        updatePatientMedicineAmount.value = data.amount
        loadMedicineCategorySelectOptions(updatePatientMedicineCategorySelect, undefined, undefined, data.category_id).then(() => {
            params.categoryId = updatePatientMedicineCategorySelect.options[updatePatientMedicineCategorySelect.selectedIndex].value
            loadMedicineSelectOptions(updatePatientMedicineSelect, params, undefined, data.medicine_id)
        })
    }).catch(handleError)
}
