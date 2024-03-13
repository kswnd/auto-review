import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import { Constants } from '../lib/constants.js'
import { Log } from '../lib/log.js'
import { MessageCodes } from '../lib/messages.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class ReportService {
    async generateApprovedReport(reportPath, submissionData, checklistResults) {
        try {
            Log.start('Generating approved report.')
            const report = {
                submission_id: submissionData.id,
                checklists_completed: Object.keys(checklistResults),
                is_passed: true,
                rating: 5,
                message: `
                    <p>Halo <strong>${submissionData.submitter_name}</strong>,</p></br>
                    <p>Selamat atas pencapaianmu yang luar biasa! Submissionmu telah lolos, dan itu menunjukkan betapa keras kamu telah bekerja. Tetaplah mempertahankan semangat belajarmu, karena setiap langkah yang kamu ambil membawa kamu lebih dekat pada kesuksesan.</p>
                    <p>Ingatlah, belajar adalah perjalanan tanpa akhir yang membuka pintu menuju pengetahuan dan kesempatan baru. Teruslah menjelajahi, bertanya, dan mencari jawaban.</p>
                    <p>Kami yakin kamu akan mencapai hal-hal hebat di masa depan. Teruslah berjuang, teruslah belajar, dan teruslah berkembang.</p></br>
                    <p>Salam,</p>
                    <p><strong>Dicoding Reviewer</strong></p>
                    `.replace(/\n/g, '')
            }
            await fs.writeFileSync(
                path.join(__dirname, '../../', reportPath, Constants.reportFileName),
                JSON.stringify(report, null, 4)
            )
            Log.success('Generating approved report.')
        } catch (_) {
            Log.error('Generating approved report.')
        }
    }

    async generateRejectedReport(reportPath, submissionData, checklistResults) {
        try {
            Log.start('Generating rejected report.')
            const reasons = Object.values(checklistResults)
                .filter(checklist => checklist.reason)
                .map(checklist => checklist.reason)
            let suggestions = ''

            reasons.forEach(reason => {
                const messages = MessageCodes[reason]
                suggestions += messages[Math.floor(Math.random() * messages.length)]
            })

            const report = {
                submission_id: submissionData.id,
                checklists_completed: Object.keys(checklistResults),
                is_passed: false,
                rating: 0,
                message: `
                    <p>Halo <strong>${submissionData.submitter_name}</strong>,</p></br>
                    <p>Kami ingin mengucapkan terima kasih atas upaya dan dedikasi yang telah kamu tunjukkan dalam submissionmu. Meskipun demikian, dengan sangat menyesal kami harus memberitahu bahwa submissionmu belum memenuhi persyaratan yang kami tetapkan.</p>
                    <p>Adapun beberapa poin yang perlu diperbaiki, antara lain:</p>
                    <ul>${suggestions}</ul>
                    <p>Kami ingin mendorongmu untuk melakukan perbaikan yang diperlukan dan mengirimkan kembali submissionmu setelah revisi. Kami yakin dengan kesungguhanmu, kamu akan mampu menghadirkan hasil yang lebih baik.</p>
                    <p>Jangan ragu untuk bertanya jika ada hal yang membingungkan atau memerlukan klarifikasi. Kami siap membantu dan mendukungmu dalam proses ini.</p></br>
                    <p>Salam,</p>
                    <p><strong>Dicoding Reviewer</strong></p>
                `.replace(/\n/g, '')
            }
            await fs.writeFileSync(
                path.join(__dirname, '../../', reportPath, Constants.reportFileName),
                JSON.stringify(report, null, 4)
            )
            Log.success('Generating rejected report.')
        } catch (_) {
            Log.error('Generating rejected report.')
        }
    }
}
