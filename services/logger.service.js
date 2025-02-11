import fs from 'fs'
import { asyncLocalStorage } from './als.service.js'

export const loggerService = {
    debug(...args) {
        doLog('DEBUG', ...args)
    },
    info(...args) {
        doLog('INFO', ...args)
    },
    warn(...args) {
        doLog('WARN', ...args)
    },
    error(...args) {
        doLog('ERROR', ...args)
    },
}

const logsDir = './logs'
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
}

//define the time format
function getTime() {
    let now = new Date()
    return now.toLocaleString('he')
}

function isError(e) {
    return e && e.stack && e.message
}

function doLog(level, ...args) {
    const store = asyncLocalStorage.getStore()
    const loggedinUserStr = store?.loggedinUser ? JSON.stringify(store?.loggedinUser) : ''

    const strs = args.map(arg =>
        typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg)
    )
    var line = strs.join(' | ')
    line = `${getTime()} - ${level} - ${line} - ${JSON.stringify(loggedinUserStr)}\n`
    console.log(line)
    fs.appendFile('./logs/backend.log', line, err => {
        if (err) console.log('FATAL: cannot write to log file')
    })
}
