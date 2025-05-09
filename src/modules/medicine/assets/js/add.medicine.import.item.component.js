const addMedicineImportItemForm = document.getElementById('addMedicineImportItemFormId')
const closeAddMedicineImportItemForm = document.getElementById('closeAddMedicineImportItemFormId')
const addMedicineImportItemCategorySelect = document.getElementById('addMedicineImportItemCategorySelectId')
const addMedicineImportItemMedicineSelect = document.getElementById('addMedicineImportItemMedicineSelectId')
const addMedicineImportItemAmountInput = document.getElementById('addMedicineImportItemAmountInputId')
const submitAddMedicineImportItemButton = document.getElementById('submitAddMedicineImportItemButtonId')

var params = {}

addMedicineImportItemCategorySelect.addEventListener('change', fillMedicineSelect)

function fillMedicineSelect() {
    params.categoryId = addMedicineImportItemCategorySelect.options[addMedicineImportItemCategorySelect.selectedIndex].value
    loadMedicineSelectOptions(addMedicineImportItemMedicineSelect, params)
}

function submitAddMedicineImportItem() {
    if (addMedicineImportItemMedicineSelect.selectedIndex === -1) {
        return alert('دواء فارغ')
    }
    const medicineId = addMedicineImportItemMedicineSelect.options[addMedicineImportItemMedicineSelect.selectedIndex].value
    const amount = addMedicineImportItemAmountInput.value
    if (amount.length === 0) {
        return alert('كمية فارغة')
    }
    return axios.post(`/api/medicine/imports/${importId}`, { medicineId, amount }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}