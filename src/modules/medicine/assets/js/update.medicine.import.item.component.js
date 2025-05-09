const updateMedicineImportItemForm = document.getElementById('updateMedicineImportItemFormId')
const closeUpdateMedicineImportItemForm = document.getElementById('closeUpdateMedicineImportItemFormId')
const updateMedicineImportItemCategorySelect = document.getElementById('updateMedicineImportItemCategorySelectId')
const updateMedicineImportItemMedicineSelect = document.getElementById('updateMedicineImportItemMedicineSelectId')
const updateMedicineImportItemAmountInput = document.getElementById('updateMedicineImportItemAmountInputId')
const updateMedicineImportItemIdSpan = document.getElementById('updateMedicineImportItemIdSpanId')
const submitUpdateMedicineImportItemButton = document.getElementById('submitUpdateMedicineImportItemButtonId')

var params = {}

updateMedicineImportItemCategorySelect.addEventListener('change', fillMedicineSelectForUpdate)

function fillMedicineSelectForUpdate() {
    params.categoryId = updateMedicineImportItemCategorySelect.options[updateMedicineImportItemCategorySelect.selectedIndex].value
    loadMedicineSelectOptions(updateMedicineImportItemMedicineSelect, params)
}

function setUpdateMedicineImportItemValues(id) {
    return axios.get(`/api/medicine/imports/items/${id}`).then((response) => {
        const data = response.data.data
        updateMedicineImportItemIdSpan.innerHTML = data.id
        updateMedicineImportItemAmountInput.value = data.amount
        loadMedicineCategorySelectOptions(updateMedicineImportItemCategorySelect, undefined, undefined, data.category_id).then(() => {
            params.categoryId = updateMedicineImportItemCategorySelect.options[updateMedicineImportItemCategorySelect.selectedIndex].value
            loadMedicineSelectOptions(updateMedicineImportItemMedicineSelect, params, undefined, data.medicine_id)
        })
}).catch(handleError)
}

function submitUpdateMedicineImportItem() {
    if (updateMedicineImportItemMedicineSelect.selectedIndex === -1) {
        return alert('دواء فارغة')
    }
    const id = updateMedicineImportItemIdSpan.innerHTML
    const amount = updateMedicineImportItemAmountInput.value.trim()
    const medicineId = updateMedicineImportItemMedicineSelect.options[updateMedicineImportItemMedicineSelect.selectedIndex].value
    if (amount.length === 0) {
        return alert('كمية فارغة')
    }
    return axios.put(`/api/medicine/imports/items/${id}`, { amount, medicineId }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}