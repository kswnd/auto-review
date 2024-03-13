import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs-extra'
import { Log } from '../lib/log.js'

export class ServerService {
    installingDependencies(submissionPath) {
        return new Promise((resolve) => {
            Log.start('Installing submission dependencies.')
            const process = spawn('npm', ['install'], { cwd: submissionPath })
            process.on('close', code => {
                if (code === 0) {
                    Log.success('Installing submission dependencies.')
                    resolve({ complete: true })
                } else {
                    Log.error('Installing submission dependencies.')
                    resolve({ complete: false })
                }
            })
        })
    }

    runningSubmission(submissionPath) {
        try {
            Log.start('Running submission.')
            function findMainJs(currentPath) {
                const files = fs.readdirSync(currentPath)
                if (files.includes('main.js')) {
                    const process = spawn('node', ['main.js'], {
                        cwd: currentPath,
                        detached: true,
                        stdio: 'ignore'
                    })

                    return {
                        complete: true,
                        processId: process.pid
                    }
                } else {
                    for (const file of files) {
                        const filePath = path.join(currentPath, file)
                        if (fs.statSync(filePath).isDirectory() && file !== 'node_modules') {
                            return findMainJs(filePath)
                        }
                    }
                }
            }
            return findMainJs(submissionPath)
        } catch (_) {
            Log.error('Running submission.')
        }
    }

    closeRunningSubmission(processId) {
        process.kill(processId)
    }
}
