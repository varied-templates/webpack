const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn; // 子进程

/**
 * Sorts dependencies in package.json alphabetically.
 * They are unsorted because they were grouped for the handlebars helpers
 * @param {Object} data Data from questionnaire
 */
exports.sortDependencies = function sortDependencies(data) {
    const packageJsonFile = path.join(
        data.inPlace ? '' : data.destDirName,
        'package.json'
    )
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile))
    packageJson.devDependencies = sortObject(packageJson.devDependencies)
    packageJson.dependencies = sortObject(packageJson.dependencies)
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2) + '\n')
}

/**
 * Runs `npm install` in the project directory
 * @param {String} cwd => Path of the created project directory
 * @param {Object} data => Data from questionnaire
 * @param {Function} color => Log font color
 */
exports.installDependencies = function installDependencies(
    cwd,
    data ,
    color
) {
    console.log(`\n\n# ${color('Installing project dependencies ...')}`)
    console.log('# ========================\n')
    return runCommand(data.autoInstall, ['install'], {
        cwd,
    })
}

/**
 * Runs `npm run lint -- --fix` in the project directory
 * @param {String} cwd => Path of the created project directory
 * @param {Object} data => Data from questionnaire
 * @param {Function} color => Log font color
 */
exports.runLintFix = function runLintFix(cwd, data, color) {
    console.log(
      `\n\n${color(
        'Running eslint --fix to comply with chosen preset rules...'
      )}`
    )
    console.log('# ========================\n')
    const args =
      data.autoInstall === 'npm'
        ? ['run', 'lint']
        : ['lint']
    return runCommand(data.autoInstall, args, {
        cwd,
    })
}

/**
 * Prints the final message with instructions of necessary next steps.
 * @param {Object} data => Data from questionnaire
 * @param {Function} chalk => Log font color
 */
exports.printMessage = function printMessage(data, { green, yellow }) {
    const message = `
# ${green('Project initialization finished!')}
# ========================

To get started:

  ${yellow(
        `${data.inPlace ? '' : `cd ${data.destDirName}\n  `}${installMsg(
            data
        )}${formatMsg(data)}${lintMsg(data)}npm run dev`
    )}
  
`
    console.log(message)
}
/**
 * Runs `node nodeJsFile ...` in the project directory
 * @param {String} cwd Path of the created project directory
 * @param {Array} cmd command script
 */
exports.createFile = function createFile(
  cwd,
  cmd
) {
    return runCommand('node', ['nodeJsFile.js'].concat(cmd), {
        cwd,
    })
}

/**
 * Runs `npm run format ...` in the project directory
 * @param {String} cwd => Path of the created project directory
 * @param {Object} data => Data from questionnaire
 * @param {Function} color => Log font color
 */
exports.runFormat = function runFormat(
  cwd,
  data,
  color
) {
    console.log(
      `\n\n${color(
        'Running eslint --fix to comply with chosen preset rules...'
      )}`
    )
    console.log('# ========================\n')
    const args =
      data.autoInstall === 'npm'
        ? ['run', 'format']
        : ['format']
    return runCommand(data.autoInstall, args, {
        cwd,
    })
}

/**
 * If the user will have to run lint --fix themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from questionnaire.
 */
function lintMsg(data) {
    return !data.autoInstall
        ? 'npm run lint (or for yarn: yarn lint)\n  '
        : ''
}

/**
 * If the user will have to run format themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from questionnaire.
 */
function formatMsg(data) {
    return !data.autoInstall
        ? 'npm run format (or for yarn: yarn format)\n  '
        : ''
}

/**
 * If the user will have to run `npm install` or `yarn` themselves, it returns a string
 * containing the instruction for this step.
 * @param {Object} data Data from the questionnaire
 */
function installMsg(data) {
    return !data.autoInstall ? 'npm install (or if using yarn: yarn)\n  ' : ''
}

/**
 * Spawns a child process and runs the specified command
 * By default, runs in the CWD and inherits stdio
 * Options are the same as node's child_process.spawn
 * @param {String} cmd
 * @param {Array<string>} args
 * @param {Object} options
 */
function runCommand(cmd, args, options) {
    return new Promise((resolve, reject) => {
        const spwan = spawn(
            cmd,
            args,
            Object.assign(
                {
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    shell: true,
                },
                options
            )
        )

        spwan.on('exit', (code) => {
            code===0?resolve():reject('')
        })

    })
}

function sortObject(object) {
    // Based on https://github.com/yarnpkg/yarn/blob/v1.3.2/src/config.js#L79-L85
    const sortedObject = {}
    Object.keys(object)
        .sort()
        .forEach(item => {
            sortedObject[item] = object[item]
        })
    return sortedObject
}
