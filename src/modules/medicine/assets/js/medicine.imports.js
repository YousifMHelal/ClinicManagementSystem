const importsTableBody = document.getElementById('importsTableBodyId')
const addMedicineImportButton = document.getElementById('addMedicineImportButtonId')
const overlayDiv = document.getElementById('overlayDivId')
const searchInput = document.getElementById('searchInputId')
const dayInput = document.getElementById('dayInputId')

var params = {}

document.addEventListener('DOMContentLoaded', () => {
    fillMedicineImportsTable()
})

searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim()
    params.keyword = keyword.length === 0 ? undefined : keyword
    fillMedicineImportsTable()
})

dayInput.addEventListener('input', () => {
    const day = dayInput.value.trim()
    params.day = day.length === 0 ? undefined : day
    fillMedicineImportsTable()
})

addMedicineImportButton.addEventListener('click', () => {
    addMedicineImportDoctorNameInput.value = ''
    addMedicineImportTimestampInput.value = ''
    addMedicineImportForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

closeAddMedicineImportForm.addEventListener('click', () => {
    addMedicineImportForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

closeUpdateMedicineImportForm.addEventListener('click', () => {
    updateMedicineImportForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitAddMedicineImportButton.addEventListener('click', () => {
    submitAddMedicineImport().then(() => {
        addMedicineImportForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
        fillMedicineImportsTable()
    })
})

submitUpdateMedicineImportButton.addEventListener('click', () => {
    submitUpdateMedicineImport().then(() => {
        updateMedicineImportForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
        fillMedicineImportsTable()
    })
})

function fillMedicineImportsTable() {
    axios.get('/api/medicine/imports', { params }).then((response) => {
        const imports = response.data.data.content
        importsTableBody.innerHTML = imports.length === 0
            ? '<tr><td colspan="4">لا يوجد صرفيات الدواء</td></tr>'
            : imports.reduce((body, medicineImport) => {
                const row = `
                    <tr record-id="${medicineImport.id}">
                        <td>${medicineImport.doctor_name}</td>
                        <td>${medicineImport.timestamp}</td>
                        <td>${medicineImport.medicine_count}</td>
                        <td class="col-6 col-md-2" style="text-align: left">
                            <i title="حذف" onclick="deleteMedicineImportOnClick(this)" class="bi bi-trash-fill pointer ms-3" style="color: red"></i>
                            <i title="تعديل" onclick="updateMedicineImportOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                            <a href='/medicine/imports/${medicineImport.id}'><i title="عرض" class='bi bi-eye pointer ms-3' style='color: var(--sub)'></i></a>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function updateMedicineImportOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    setUpdateMedicineImportValues(id).then(() => {
        updateMedicineImportForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function deleteMedicineImportOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/medicine/imports/${id}`).then(fillMedicineImportsTable).catch(handleError)
}