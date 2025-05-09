function parseQuery(search) {
    search = search.substring(1)
    const parts = search.includes('&') ? search.split('&') : [ search ]
    return parts.reduce((previous, current) => {
        const [ key, value ] = current.split('=')
        const isUndefined = typeof previous[key] === 'undefined'
        const isArray = isUndefined ? false : Array.isArray(previous[key])
        if (isUndefined) {
            previous[key] = value
        } else if (isArray) {
            previous[key].push(value)
        } else {
            previous[key] = [ previous[key], value ]
        }
        return previous
    }, {})
}

function stringifyParams(params) {
    const keys = Object.keys(params)
    if (keys.length === 0) return ""
    return keys.reduce((previous, current, index) => {
        const prefix = index === 0 ? "" : "&"
        return `${previous}${prefix}${current}=${params[current]}`
    }, "?")
}

function parseDateTime(isoString) {
    return isoString.substring(0, 16).replace(/T/g, ' ')
}