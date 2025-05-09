const patientVisitsTableBody = document.getElementById('patientVisitsTableBodyId')
const degreeFilterSelect = document.getElementById('degreeFilterSelectId')
const visitTypeSelect = document.getElementById('visitTypeSelectId')
const specialSelect = document.getElementById('specialSelectId')
const fromDayInput = document.getElementById('fromDayInputId')
const toDayInput = document.getElementById('toDayInputId')
const printButton = document.getElementById('printButtonId')

var params = {}

document.addEventListener('DOMContentLoaded', () => {

    loadDegreesSelectOptions(degreeFilterSelect).then(() => (degreeFilterSelect.innerHTML = `<option value="0">الدرجة</option>\n${degreeFilterSelect.innerHTML}`))
    loadVisitsTypesSelectOptions(visitTypeSelect).then(() => (visitTypeSelect.innerHTML = `<option value="0">نوع العيادة</option>\n${visitTypeSelect.innerHTML}`))
    loadSpecialsSelectOptions(specialSelect).then(() => (specialSelect.innerHTML = `<option value="0">التخصص</option>\n${specialSelect.innerHTML}`))
    
    fillVisitsTable()

})

degreeFilterSelect.addEventListener('change', () => {
    const degreeId = degreeFilterSelect.options[degreeFilterSelect.selectedIndex].value
    params.degreeId = parseInt(degreeId) > 0 ? degreeId : undefined
    fillVisitsTable()
})

visitTypeSelect.addEventListener('change', () => {
    const visitTypeId = visitTypeSelect.options[visitTypeSelect.selectedIndex].value
    params.visitTypeId = parseInt(visitTypeId) > 0 ? visitTypeId : undefined
    fillVisitsTable()
})

specialSelect.addEventListener('change', () => {
    const specialId = specialSelect.options[specialSelect.selectedIndex].value
    params.specialId = parseInt(specialId) > 0 ? specialId : undefined
    fillVisitsTable()
})

fromDayInput.addEventListener('change', () => {
    const fromDay = fromDayInput.value.trim()
    params.fromDay = fromDay.length > 0 ? fromDay : undefined
    fillVisitsTable()
})

toDayInput.addEventListener('change', () => {
    const toDay = toDayInput.value.trim()
    params.toDay = toDay.length > 0 ? toDay : undefined
    fillVisitsTable()
})

printButton.addEventListener('click', () => {
    location.assign('/api/visits/print' + stringifyParams(params))
})

closeUpdatePatientVisitForm.addEventListener('click', () => {
    updatePatientVisitForm.classList.toggle('d-none')
    overlayDiv.classList.toggle('d-none')
})

submitUpdateVisitButton.addEventListener('click', () => {
    submitUpdateVisit().then(() => {
        fillVisitsTable()
        updatePatientVisitForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
})

function fillVisitsTable() {
    axios.get('/api/visits', { params }).then((response) => {
        const visits = response.data.data.content
        patientVisitsTableBody.innerHTML = visits.length === 0
            ? '<tr><td colspan="9">لا يوجد زيارات</td></tr>'
            : visits.reduce((body, visit) => {
                const row = `
                    <tr record-id="${visit.id}">
                        <td>${visit.patient_name}</td>
                        <td>${visit.degree_name}</td>
                        <td>${visit.type}</td>
                        <td>${visit.special}</td>
                        <td>${visit.openion}</td>
                        <td>${visit.doctor_name ?? 'لايوجد'}</td>
                        <td>${parseDateTime(visit.timestamp)}</td>
                        <td>${visit.second_visit_at ?? 'لايوجد'}</td>
                        <td class="col-6 col-md-2" style="text-align: left">
                            <i title="حذف" onclick="deleteVisitOnClick(this)" class="bi bi-trash-fill pointer ms-3" style='color: red'></i>
                            <i title="تعديل" onclick="updateVisitOnClick(this)" class="bi bi-pencil-square pointer ms-3" style='color: rgb(85, 90, 98)'></i>
                            <a href='/visits/${visit.id}'><i title="عرض" class='bi bi-eye pointer ms-3' style='color: var(--sub)'></i></a>
                        </td>
                    </tr>`
                return `${body}\n${row}`
            }, '')
    }).catch(handleError)
}

function handleError(error) {
    alert(error.response.data.message)
}

function updateVisitOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    updateVisitAction(id).then(() => {
        updatePatientVisitForm.classList.toggle('d-none')
        overlayDiv.classList.toggle('d-none')
    })
}

function deleteVisitOnClick(element) {
    const id = element.parentElement.parentElement.attributes.getNamedItem('record-id').value
    axios.delete(`/api/visits/${id}`).then(fillVisitsTable).catch(handleError)
}