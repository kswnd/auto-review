import chalk from 'chalk'

export const Log = {
    start: (message) => console.log(chalk.yellow('[ START ]', message)),
    success: (message) => console.log(chalk.green('[SUCCESS]', message)),
    error: (message) => console.log(chalk.red('[ ERROR ]', message))
}
