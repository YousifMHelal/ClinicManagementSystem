const addPatientPermissionForm = document.getElementById('addPatientPermissionFormId')
const closeAddPatientPermissionButton = document.getElementById('closeAddPatientPermissionButtonId')
const addPatientPermissionTypeSelect = document.getElementById('addPatientPermissionTypeSelectId')
const addPatientPermissionDescription = document.getElementById('addPatientPermissionDescriptionId')
const addPatientPermissionStartsAt = document.getElementById('addPatientPermissionStartsAtId')
const addPatientPermissionEndsAt = document.getElementById('addPatientPermissionEndsAtId')
const submitAddPatientPermissionButton = document.getElementById('submitAddPatientPermissionButtonId')

function submitAddPatientPermission(patientId, visitId) {
    if (addPatientPermissionTypeSelect.selectedIndex === -1) {
        return alert('الدواء فارغة')
    }
    const permissionId = addPatientPermissionTypeSelect.options[addPatientPermissionTypeSelect.selectedIndex].value
    const startsAt = addPatientPermissionStartsAt.value.trim()
    const endsAt = addPatientPermissionEndsAt.value.trim()
    let description = addPatientPermissionDescription.value.trim()
    if (startsAt.length === 0) {
        return alert('تاريخ بداية فارغ')
    }
    if (endsAt.length === 0) {
        return alert('تاريخ نهاية فارغ')
    }
    description = description.length === 0 ? undefined : description
    return axios.post('/api/patients/permission', { patientId, visitId, permissionId, startsAt, endsAt, description }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}