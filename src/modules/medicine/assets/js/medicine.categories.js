const addRecordForm = document.getElementById('addRecordFormId')
const closeAddRecordFormButton = document.getElementById('closeAddRecordFormButtonId')
const addRecordNameInput = document.getElementById('addRecordNameInputId')
const submitAddRecordButton = document.getElementById('submitAddRecordButtonId')
const overlayDiv = document.getElementById('overlayDivId')
const addRecordButton = document.getElementById('addRecordButtonId')
const recordsTableBody = document.getElementById('recordsTableBodyId')
const updateRecordForm = document.getElementById('updateRecordFormId')
const closeUpdateRecordFormButton = document.getElementById('closeUpdateRecordFormButtonId')
const updateRecordNameInput = document.getElementById('updateRecordNameInputId')
const submitUpdateRecordButton = document.getElementById('submitUpdateRecordButtonId')
const updateRecirdIdSpan = document.getElementById('updateRecirdIdSpanId')

addRecordButton.addEventListener('click', () => {
    addRecordNameInput.value = ''
    toggleAddRecordForm()
})

submitAddRecordButton.addEventListener('click', () => {
    const name = addRecordNameInput.value.trim()
    if (name.length === 0) return alert('تصنيف فارغ')
    axios.post('/api/medicine/categories', { name }).then(() => {
        toggleAddRecordForm()
        fillRecordsInTable()
    }).catch(handleError)
})

submitUpdateRecordButton.addEventListener('click', () => {
    const id = updateRecirdIdSpan.innerHTML
    const name = updateRecordNameInput.value.trim()
    if (name.length === 0) return alert('تصنيف فارغ')
    axios.put(`/api/medicine/categories/${id}`, { name }).then(() => {
        toggleUpdateRecordForm()
        fillRecordsInTable()
    }).catch(handleError)
})

document.addEventListener('DOMContentLoaded', fillRecordsInTable)
closeAddRecordFormButton.addEventListener('click', toggleAddRecordForm)
closeUpdateRecordFormButton.addEventListener('click', toggleUpdateRecordForm)

function fillRecordsInTable() {
    axios.get('/api/medicine/categories').then((response) => {
        const items = response.data.data.content
        recordsTableBody.innerHTML = items.length === 0
            ? '<tr><td colspan="2">لا يوجد</td></tr>'
            : items.reduce((body, item) => {
                const row = `
                    <tr record-id="${item.id}">
                        <td>${item.name}</td>
                        <td class="col-6 col-md-1" style="text-align: left">
                            <i title="حذف" onclick="deleteRecordOnClick(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updateRecordOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function toggleAddRecordForm() {
    addRecordForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
}

function toggleUpdateRecordForm() {
    updateRecordForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
}

function handleError(error) {
    alert(error.response.data.message)
}

function updateRecordOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.get(`/api/medicine/categories/${id}`, { name }).then((response) => {
        const data = response.data.data
        updateRecirdIdSpan.innerHTML = data.id
        updateRecordNameInput.value = data.name
        toggleUpdateRecordForm()
    }).catch(handleError)
}

function deleteRecordOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/medicine/categories/${id}`).then(fillRecordsInTable).catch(handleError)
}