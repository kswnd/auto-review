import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import { Constants } from '../lib/constants.js'
import { Log } from '../lib/log.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class ResourceService {
    async createTemporaryFiles(sourcePath) {
        try {
            Log.start('Creating temporary files.')
            const submissionPath = path.join(__dirname, '../../res', Constants.tmpPath)
            await fs.copy(
                path.join(__dirname, '../../', sourcePath),
                submissionPath
            )
            Log.success('Creating temporary files.')
            this._normalizeTemporaryFolder(submissionPath)
            return submissionPath
        } catch (_) {
            Log.error('Creating temporary files.')
        }
    }

    async removeTemporaryFiles() {
        try {
            Log.start('Removing temporary files.')
            await fs.remove(path.join(__dirname, '../../res', Constants.tmpPath))
            Log.success('Removing temporary files.')
        } catch (_) {
            Log.error('Removing temporary files.')
        }
    }

    getSubmissionData(submissionPath) {
        try {
            Log.start('Getting submission data.')
            const content = fs.readFileSync(path.join(submissionPath, 'auto-review-config.json'), 'utf-8')
            const data = JSON.parse(content)
            Log.success('Getting submission data.')
            return data
        } catch (_) {
            Log.error('Getting submission data.')
        }
    }

    _normalizeTemporaryFolder(submissionPath) {
        try {
            Log.start('Normalizing temporary folder.')
            function findPackageJson(currentPath) {
                const files = fs.readdirSync(currentPath)
                for (const file of files) {
                    const filePath = path.join(currentPath, file)
                    if (file === 'package.json') {
                        if (currentPath !== submissionPath) {
                            fs.copySync(currentPath, submissionPath)
                            fs.removeSync(currentPath)
                        }
                        Log.success('Normalizing temporary folder.')
                        return
                    } else if (fs.statSync(filePath).isDirectory()) {
                        findPackageJson(filePath)
                    }
                }
            }
            findPackageJson(submissionPath)
        } catch (_) {
            Log.error('Normalizing temporary folder.')
        }
    }
}
