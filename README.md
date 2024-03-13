# Auto Review

Auto Review is a Node.js program based on Command Line Interface (CLI) designed to perform automatic checks on submissions. With this tool, you can easily automate the checking process and provide feedback to users.

## Installation & Usage

To use Auto Review, you need to have Node.js installed on your computer. Follow the steps below to install and run this program:

1. Clone this repository to your computer:

```bash
git clone https://github.com/kswnd/auto-review.git
```

2. Navigate to the project directory:

```bash
cd auto-review
```

3. Install dependencies using npm:

```bash
npm install
```

4. Run the program:

```bash
npm start -- -s <submission-path> -r <report-path>
```

Example:

```bash
npm start -- -s /res/sample_submissions/submission-1 -r /res/report
```

## Supported Command Options

| Option | Description              | Required |
| ------ | ------------------------ | -------- |
| -s     | Submission resource path | Yes      |
| -r     | Report resource path     | No       |

- `-s` : Specifies the submission resource to be checked. This option is required.
- `-r` : Specifies the path where the report will be generated. If not provided, the report will be save on **/res/report/report.json**.

## Result

The result of the submission check will be saved in a `report.json` file with the following structure:

```json
{
    "submission_id": 1,
    "checklists_completed": [
        "contain_package_json",
        "contain_main_js",
        "main_js_contain_student_id",
        "app_port_should_5000",
        "root_should_showing_html",
        "html_should_contain_h1_and_student_id"
    ],
    "is_passed": true,
    "rating": 5,
    "message": "<p>Selamat atas pencapaianmu yang luar biasa! ... </p>"
}
```
