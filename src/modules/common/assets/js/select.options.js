const loadDegreesSelectOptions = (select, params, choosenValue, choosenId) => {
    return axios.get('/api/degrees', { params }).then((response) => {
        const options = response.data.data.content
        let selectedIndex = 0
        select.innerHTML = options.reduce((previous, option, index) => {
            if (choosenValue === option.name || choosenId === option.id) {
                selectedIndex = index
            }
            return `${previous}\n<option value='${option.id}'>${option.name}</option>`
        }, '')
        select.selectedIndex = selectedIndex
    })
}

const loadMedicineCategorySelectOptions = (select, params, choosenValue, choosenId) => {
    return axios.get('/api/medicine/categories', { params }).then((response) => {
        const options = response.data.data.content
        let selectedIndex = 0
        select.innerHTML = options.reduce((previous, option, index) => {
            if (choosenValue === option.name || choosenId === option.id) {
                selectedIndex = index
            }
            return `${previous}\n<option value='${option.id}'>${option.name}</option>`
        }, '')
        select.selectedIndex = selectedIndex
    })
}

const loadSpecialsSelectOptions = (select, params, choosenValue, choosenId) => {
    return axios.get('/api/specials', { params }).then((response) => {
        const options = response.data.data.content
        let selectedIndex = 0
        select.innerHTML = options.reduce((previous, option, index) => {
            if (choosenValue === option.name || choosenId === option.id) {
                selectedIndex = index
            }
            return `${previous}\n<option value='${option.id}'>${option.name}</option>`
        }, '')
        select.selectedIndex = selectedIndex
    })
}

const loadVisitsTypesSelectOptions = (select, params, choosenValue, choosenId) => {
    return axios.get('/api/visits/types', { params }).then((response) => {
        const options = response.data.data.content
        let selectedIndex = 0
        select.innerHTML = options.reduce((previous, option, index) => {
            if (choosenValue === option.name || choosenId === option.id) {
                selectedIndex = index
            }
            return `${previous}\n<option value='${option.id}'>${option.name}</option>`
        }, '')
        select.selectedIndex = selectedIndex
    })
}

const loadMedicineSelectOptions = (select, params, choosenValue, choosenId) => {
    return axios.get('/api/medicine', { params }).then((response) => {
        const options = response.data.data.content
        let selectedIndex = 0
        select.innerHTML = options.reduce((previous, option, index) => {
            if (choosenValue === option.name || choosenId === option.id) {
                selectedIndex = index
            }
            return `${previous}\n<option value='${option.id}'>${option.name}</option>`
        }, '')
        select.selectedIndex = selectedIndex
    })
}

const loadPermissionsSelectOptions = (select, params, choosenValue, choosenId) => {
    return axios.get('/api/permissions', { params }).then((response) => {
        const options = response.data.data.content
        let selectedIndex = 0
        select.innerHTML = options.reduce((previous, option, index) => {
            if (choosenValue === option.name || choosenId === option.id) {
                selectedIndex = index
            }
            return `${previous}\n<option value='${option.id}'>${option.name}</option>`
        }, '')
        select.selectedIndex = selectedIndex
    })
}

const loadMedicineUnitsSelectOptions = (select, params, choosenValue, choosenId) => {
    return axios.get('/api/medicine/units', { params }).then((response) => {
        const options = response.data.data.content
        let selectedIndex = 0
        select.innerHTML = options.reduce((previous, option, index) => {
            if (choosenValue === option.name || choosenId === option.id) {
                selectedIndex = index
            }
            return `${previous}\n<option value='${option.id}'>${option.name}</option>`
        }, '')
        select.selectedIndex = selectedIndex
    })
}