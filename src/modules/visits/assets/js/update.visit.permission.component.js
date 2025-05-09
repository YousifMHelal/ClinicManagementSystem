const updatePatientPermissionForm = document.getElementById('updatePatientPermissionFormId')
const closeUpdatePatientPermissionButton = document.getElementById('closeUpdatePatientPermissionButtonId')
const updatePatientPermissionTypeSelect = document.getElementById('updatePatientPermissionTypeSelectId')
const updatePatientPermissionDescription = document.getElementById('updatePatientPermissionDescriptionId')
const updatePatientPermissionStartsAt = document.getElementById('updatePatientPermissionStartsAtId')
const updatePatientPermissionEndsAt = document.getElementById('updatePatientPermissionEndsAtId')
const updatePatientPermissionIdSpan = document.getElementById('updatePatientPermissionIdSpanId')
const submitUpdatePatientPermissionButton = document.getElementById('submitUpdatePatientPermissionButtonId')

function submitUpdatePatientPermission() {
    const id = updatePatientPermissionIdSpan.innerHTML
    if (updatePatientPermissionTypeSelect.selectedIndex === -1) {
        return alert('الدواء فارغة')
    }
    const permissionId = updatePatientPermissionTypeSelect.options[updatePatientPermissionTypeSelect.selectedIndex].value
    const startsAt = updatePatientPermissionStartsAt.value.trim()
    const endsAt = updatePatientPermissionEndsAt.value.trim()
    let description = updatePatientPermissionDescription.value.trim()
    if (startsAt.length === 0) {
        return alert('تاريخ بداية فارغ')
    }
    if (endsAt.length === 0) {
        return alert('تاريخ نهاية فارغ')
    }
    description = description.length === 0 ? undefined : description
    return axios.put(`/api/patients/permission/${id}`, { permissionId, startsAt, endsAt, description }).catch(handleError)
}

function setUpdatePatientPermissionValues(id) {
    return axios.get(`/api/patients/permission/${id}`).then((response) => {
        const data = response.data.data
        updatePatientPermissionIdSpan.innerHTML = data.id
        updatePatientPermissionStartsAt.value = data.starts_at
        updatePatientPermissionEndsAt.value = data.ends_at
        updatePatientPermissionDescription.value = data.description
        loadPermissionsSelectOptions(updatePatientPermissionTypeSelect, undefined, undefined, data.permission_id)
    }).catch(handleError)
}