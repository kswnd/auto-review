import path from 'path'
import fs from 'fs-extra'
import { Log } from '../lib/log.js'

export class SubmissionService {
    containPackageJson(submissionPath) {
        try {
            Log.start('Checking existence of package.json.')
            const exists = fs.pathExistsSync(path.join(submissionPath, 'package.json'))
            if (exists) {
                Log.success('Checking existence of package.json.')

                return { complete: true }
            }
            throw new Error()
        } catch (_) {
            Log.error('Checking existence of package.json.')

            return {
                complete: false,
                reason: 'package_json_not_found'
            }
        }
    }

    containMainJs(submissionPath) {
        try {
            Log.start('Checking existence of main.js.')
            function findMainJs(currentPath) {
                const files = fs.readdirSync(currentPath)
                for (const file of files) {
                    const filePath = path.join(currentPath, file)
                    if (file === 'main.js') {
                        Log.success('Checking existence of main.js.')

                        return { complete: true }
                    } else if (fs.statSync(filePath).isDirectory()) {
                        return findMainJs(filePath)
                    }
                }
                throw new Error()
            }
            return findMainJs(submissionPath)
        } catch (_) {
            Log.error('Checking existence of main.js.')

            return {
                complete: false,
                reason: 'main_js_not_found'
            }
        }
    }

    mainJsContainStudentId(submissionPath, studentId) {
        try {
            Log.start('Checking student ID main.js.')
            function findMainJs(currentPath) {
                const files = fs.readdirSync(currentPath)
                for (const file of files) {
                    const filePath = path.join(currentPath, file)
                    if (file === 'main.js') {
                        const content = fs.readFileSync(filePath, 'utf-8')
                        const matcher = new RegExp(`\\/\\/(\\s)*${studentId}\\b|\\/\\*(.|\\s)*?${studentId}\\b(.|\\s)*?\\*\\/`, 'g')
                        if (content.match(matcher)) {
                            Log.success('Checking student ID main.js.')

                            return { complete: true }
                        } else {
                            throw new Error()
                        }
                    } else if (fs.statSync(filePath).isDirectory()) {
                        return findMainJs(filePath)
                    }
                }
                throw new Error()
            }
            return findMainJs(submissionPath)
        } catch (_) {
            Log.error('Checking student ID main.js.')

            return {
                complete: false,
                reason: 'student_id_not_found_in_main_js'
            }
        }
    }

    async rootShouldShowingHtml() {
        try {
            Log.start('Checking html on root.')
            const response = await fetch('http://0.0.0.0:5000')
            const contentType = response.headers.get('content-type')
            if (contentType.includes('text/html')) {
                Log.success('Checking html on root.')

                return { complete: true }
            }
            throw new Error()
        } catch (_) {
            Log.error('Checking html on root.')

            return {
                complete: false,
                reason: 'root_not_showing_html'
            }
        }
    }

    appPortShould5000() {
        return new Promise(async (resolve) => {
            Log.start('Checking server port 5000.')
            let retry = 1
            while (retry <= 10) {
                try {
                    Log.start(`Retry: ${retry}`)
                    const response = await fetch('http://0.0.0.0:5000')
                    if (response.status === 200) {
                        Log.success('Checking server port 5000.')

                        resolve({ complete: true })
                        return
                    }
                } catch (_) { }
                await new Promise(resolve => setTimeout(resolve, 500))
                retry++
            }
            Log.error('Checking server port 5000.')

            resolve({
                complete: false,
                reason: 'app_port_not_5000'
            })
        })
    }

    async htmlShouldContainH1WithStudentId(studentId) {
        try {
            Log.start('Checking student ID in HTML.')
            const result = await fetch('http://0.0.0.0:5000')
            const htmlContent = await result.text()
            const elementRegex = new RegExp(`<h1.*?>(.*${studentId})<\/h1>`, 'g')
            if (htmlContent.match(elementRegex)) {
                Log.success('Checking student ID in HTML.')

                return { complete: true }
            }
            throw new Error()
        } catch (_) {
            Log.error('Checking student ID in HTML.')

            return {
                complete: false,
                reason: 'student_id_not_found_in_html'
            }
        }
    }
}
