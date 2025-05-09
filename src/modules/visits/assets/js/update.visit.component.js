const updatePatientVisitForm = document.getElementById('updatePatientVisitFormId')
const closeUpdatePatientVisitForm = document.getElementById('closeUpdatePatientVisitFormId')
const submitUpdateVisitButton = document.getElementById('submitUpdateVisitButtonId')
const updateVisitIdSpan = document.getElementById('updateVisitIdSpanId')
const updateVisitOpenionInput = document.getElementById('updateVisitOpenionInputId')
const updateVisitTypeSelect = document.getElementById('updateVisitTypeSelectId')
const updateVisitSpecialSelect = document.getElementById('updateVisitSpecialSelectId')
const updateVisitDoctorNameInput = document.getElementById('updateVisitDoctorNameInputId')
const updateVisitSecondVisitAtInput = document.getElementById('updateVisitSecondVisitAtInputId')
const updateVisitTimestampInput = document.getElementById('updateVisitTimestampInputId')

function submitUpdateVisit() {
    let doctorName = updateVisitDoctorNameInput.value.trim()
    let secondVisitAt = updateVisitSecondVisitAtInput.value.trim()
    const id = updateVisitIdSpan.innerHTML
    const openion = updateVisitOpenionInput.value.trim()
    const timestamp = updateVisitTimestampInput.value.trim()
    const typeId = updateVisitTypeSelect.options[updateVisitTypeSelect.selectedIndex].value
    const specialId = updateVisitSpecialSelect.options[updateVisitSpecialSelect.selectedIndex].value
    
    if (openion.length === 0) return alert('تشخيص فارغ')
    if (timestamp.length === 0) return alert('وقت زيارة فارغ')
    if (doctorName.length === 0) doctorName = undefined
    if (secondVisitAt.length === 0) secondVisitAt = undefined

    return axios.put(`/api/visits/${id}`, { openion, timestamp, doctorName, secondVisitAt, typeId, specialId }).catch(handleError)
}

function updateVisitAction(id) {
    return axios.get(`/api/visits/${id}`).then((response) => {
        const visit = response.data.data
        updateVisitIdSpan.innerHTML = visit.id
        updateVisitOpenionInput.value = visit.openion
        updateVisitTimestampInput.value = visit.timestamp
        updateVisitDoctorNameInput.value = visit.doctor_name ?? ''
        updateVisitSecondVisitAtInput.value = visit.second_visit_at ?? ''
        loadSpecialsSelectOptions(updateVisitSpecialSelect, undefined, undefined, visit.special_id)
        loadVisitsTypesSelectOptions(updateVisitTypeSelect, undefined, undefined, visit.type_id)
    }).catch(handleError)
}