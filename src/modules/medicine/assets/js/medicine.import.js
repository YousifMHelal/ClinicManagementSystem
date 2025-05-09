const importItemsTableBody = document.getElementById('importItemsTableBodyId')
const importsTableBody = document.getElementById('importsTableBodyId')
const updateMedicineImportButton = document.getElementById('updateMedicineImportButtonId')
const overlayDiv = document.getElementById('overlayDivId')
const addMedicineImportItemButton = document.getElementById('addMedicineImportItemButtonId')

var importId
var params = {}

document.addEventListener('DOMContentLoaded', () => {

    location.pathname.split('/').forEach((urlPart) => {
        if (urlPart.trim().length > 0 && /^[0-9]*$/.test(urlPart)) {
            importId = parseInt(urlPart)
            params.importId = importId
        }
    })

    fillMedicineImportsTable()
    fillImportsItemsTable()
})

updateMedicineImportButton.addEventListener('click', () => {
    setUpdateMedicineImportValues(importId).then(() => {
        updateMedicineImportForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

closeUpdateMedicineImportForm.addEventListener('click', () => {
    updateMedicineImportForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdateMedicineImportButton.addEventListener('click', () => {
    submitUpdateMedicineImport().then(() => {
        updateMedicineImportForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
        fillMedicineImportsTable()
    })
})

addMedicineImportItemButton.addEventListener('click', () => {
    loadMedicineCategorySelectOptions(addMedicineImportItemCategorySelect).then(fillMedicineSelect)
    addMedicineImportItemAmountInput.value = ''
    addMedicineImportItemForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

closeAddMedicineImportItemForm.addEventListener('click', () => {
    addMedicineImportItemForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitAddMedicineImportItemButton.addEventListener('click', () => {
    submitAddMedicineImportItem(importId).then(() => {
        fillMedicineImportsTable()
        fillImportsItemsTable()
        addMedicineImportItemForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none') 
    })
})

closeUpdateMedicineImportItemForm.addEventListener('click', () => {
    updateMedicineImportItemForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdateMedicineImportItemButton.addEventListener('click', () => {
    submitUpdateMedicineImportItem().then(() => {
        updateMedicineImportItemForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
        fillImportsItemsTable()
    })
})

function fillImportsItemsTable() {
    axios.get(`/api/medicine/imports/${importId}/items`, { params }).then((response) => {
        const items = response.data.data.content
        importItemsTableBody.innerHTML = items.reduce((body, item) => {
            const row = `
                <tr record-id="${item.id}">
                    <td>${item.medicine_name}</td>
                    <td>${item.medicine_category_name}</td>
                    <td>${item.amount} ${item.medicine_unit_name}</td>
                    <td class="col-6 col-md-1" style="text-align: left">
                        <i title="حذف" onclick="deleteMedicineImportItemOnClick(this)" class="bi bi-trash-fill pointer ms-3" style="color: red"></i>
                        <i title="تعديل" onclick="updateMedicineImportItemOnClick(this)" class="bi bi-pencil-square pointer ms-3" style="color: rgb(85, 90, 98)"></i>
                    </td>
                </tr>`
            return `${body}\n${row}`
        }, '')
    }).catch(handleError)
}

function fillMedicineImportsTable() {
    axios.get(`/api/medicine/imports/${importId}`, { params }).then((response) => {
        const medicineImport = response.data.data
        importsTableBody.innerHTML = `
            <tr record-id="${medicineImport.id}">
                <td>${medicineImport.doctor_name}</td>
                <td>${medicineImport.timestamp}</td>
                <td>${medicineImport.medicine_count}</td>
            </tr>`
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function updateMedicineImportItemOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    setUpdateMedicineImportItemValues(id).then(() => {
        updateMedicineImportItemForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function deleteMedicineImportItemOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/medicine/imports/items/${id}`).then(() => {
        fillImportsItemsTable()
        fillMedicineImportsTable()
    }).catch(handleError)
}