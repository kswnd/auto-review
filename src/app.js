import minimist from 'minimist'
import { ChecklistKeys } from './lib/checklist.js'
import { Log } from './lib/log.js'
import { ReportService } from './services/report-service.js'
import { ResourceService } from './services/resource-service.js'
import { ServerService } from './services/server-service.js'
import { SubmissionService } from './services/submission-service.js'

class App {
    async run() {
        const report = new ReportService()
        const resource = new ResourceService()
        const server = new ServerService()
        const submission = new SubmissionService()
        const checklistResults = {}

        try {
            Log.start('Reviewing submission.')
            const { s: sourcePath, r: reportPath = '/res/report' } = minimist(process.argv.slice(2))
            const submissionPath = await resource.createTemporaryFiles(sourcePath)
            const submissionData = resource.getSubmissionData(submissionPath)

            const containPackageJsonResult = submission.containPackageJson(submissionPath)
            checklistResults[ChecklistKeys.contain_package_json] = containPackageJsonResult

            const containMainJsResult = submission.containMainJs(submissionPath)
            checklistResults[ChecklistKeys.contain_main_js] = containMainJsResult

            if (containMainJsResult.complete) {
                const mainJsContainStudentIdResult = submission.mainJsContainStudentId(submissionPath, submissionData.submitter_id)
                checklistResults[ChecklistKeys.main_js_contain_student_id] = mainJsContainStudentIdResult
            }

            if (containPackageJsonResult.complete) {
                await server.installingDependencies(submissionPath)
            }

            if (containMainJsResult.complete) {
                const runningSubmissionResult = server.runningSubmission(submissionPath)

                const appPortShould5000Result = await submission.appPortShould5000()
                checklistResults[ChecklistKeys.app_port_should_5000] = appPortShould5000Result

                if (appPortShould5000Result.complete) {
                    const rootShouldShowingHtmlResult = await submission.rootShouldShowingHtml()
                    checklistResults[ChecklistKeys.root_should_showing_html] = rootShouldShowingHtmlResult

                    const htmlShouldContainH1WithStudentIdResult = await submission.htmlShouldContainH1WithStudentId(submissionData.submitter_id)
                    checklistResults[ChecklistKeys.html_should_contain_h1_with_student_id] = htmlShouldContainH1WithStudentIdResult
                }

                if (runningSubmissionResult.processId) {
                    server.closeRunningSubmission(runningSubmissionResult.processId)
                }
            }
            await resource.removeTemporaryFiles()
            const isPassed = Object.values(checklistResults).every(checklist => checklist.complete === true)
            if (isPassed) {
                await report.generateApprovedReport(reportPath, submissionData, checklistResults)
            } else {
                await report.generateRejectedReport(reportPath, submissionData, checklistResults)
            }
            Log.success('Reviewing submission.')
        } catch (_) {
            Log.error('Reviewing submission.')
        }
    }
}

new App().run()
