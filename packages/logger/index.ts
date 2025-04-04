import coreInstance from '@my-monorepo/core'
import winston from 'winston'

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
})

coreInstance.on('moduleRegistered', (module) => {
    logger.info(`Module registered: ${module.name}`)
})

coreInstance.on('moduleUnregistered', (module) => {
    logger.warn(`Module unregistered: ${module.name}`)
})

export function initializeLogger() {
    logger.info('Logger initialized')
}
