import {createLogger, format, transports} from 'winston'
import * as path from 'path'

const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)

export default createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                logFormat
            )
        }),
        // new transports.File({
        //     filename: 'logs/combined.log',
        //     format: format.combine(
        //         format.json() // Render in one line in your log file!
        //     )
        // })
    ],
    exitOnError: false
})
