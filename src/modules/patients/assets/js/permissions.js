const patientVisitsTableBody = document.getElementById('patientVisitsTableBodyId')
const overlayDiv = document.getElementById('overlayDivId')
const degreeFilterSelect = document.getElementById('degreeFilterSelectId')
const permissionTypeSelect = document.getElementById('permissionTypeSelectId')
const printButton = document.getElementById('printButtonId')

var params = {}

document.addEventListener('DOMContentLoaded', () => {

    loadDegreesSelectOptions(degreeFilterSelect).then(() => (degreeFilterSelect.innerHTML = `<option value="0">الدرجة</option>\n${degreeFilterSelect.innerHTML}`))
    loadPermissionsSelectOptions(permissionTypeSelect).then(() => (permissionTypeSelect.innerHTML = `<option value="0">نوع الاورنيك</option>\n${permissionTypeSelect.innerHTML}`))
    
    fillPermissionsTable()

})

closeUpdatePatientPermissionButton.addEventListener('click', () => {
    updatePatientPermissionForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdatePatientPermissionButton.addEventListener('click', () => {
    submitUpdatePatientPermission().then(() => {
        fillPermissionsTable()
        updatePatientPermissionForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

degreeFilterSelect.addEventListener('change', () => {
    const degreeId = degreeFilterSelect.options[degreeFilterSelect.selectedIndex].value
    params.degreeId = parseInt(degreeId) > 0 ? degreeId : undefined
    fillPermissionsTable()
})

permissionTypeSelect.addEventListener('change', () => {
    const permissionTypeId = permissionTypeSelect.options[permissionTypeSelect.selectedIndex].value
    params.permissionTypeId = parseInt(permissionTypeId) > 0 ? permissionTypeId : undefined
    fillPermissionsTable()
})

// printButton.addEventListener('click', () => {
//     location.assign('/api/visits/print' + stringifyParams(params))
// })

function fillPermissionsTable() {
    axios.get('/api/patients/permission', { params }).then((response) => {
        const permissions = response.data.data.content
        patientVisitsTableBody.innerHTML = permissions.length === 0
            ? '<tr><td colspan="7">لا يوجد اورنيك</td></tr>'
            : permissions.reduce((body, permission) => {
                const row = `
                    <tr record-id="${permission.id}">
                        <td>${permission.patient_name}</td>
                        <td>${permission.degree_name}</td>
                        <td>${permission.permission_name}</td>
                        <td>${permission.description ?? 'لا يوجد'}</td>
                        <td>${permission.starts_at}</td>
                        <td>${permission.ends_at}</td>
                        <td class="col-6 col-md-2" style="text-align: left">
                            <i title="حذف" onclick="deletePatientPermission(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updatePermission(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                            <a href='/visits/${permission.visit_id}'><i title="عرض" class='bi bi-eye pointer ms-3' style='color: var(--sub)'></i></a>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function deletePatientPermission(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/patients/permission/${id}`).then(fillPermissionsTable).catch(handleError)
}

function updatePermission(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    return setUpdatePatientPermissionValues(id).then(() => {
        updatePatientPermissionForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}