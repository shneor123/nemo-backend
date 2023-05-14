const fs = require('fs')

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
    const strs = args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
    var line = strs.join(' | ')
    line = `${getTime()} - ${level} - ${line}\n`
    fs.appendFileSync('./logs/backend.log', line)
}

module.exports = {
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