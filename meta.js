const path = require('path');
const fs = require('fs');

const {
    sortDependencies,
    installDependencies,
    runLintFix,
    printMessage,
} = require('./utils');
const pkg = require('./package.json');

const templateVersion = pkg.version;

const {addTestAnswers} = require('./scenarios')

module.exports = {
    metalsmith: {
        // When running tests for the template, this adds answers for the selected scenario
        before: addTestAnswers
    },
    helpers: {
        if_or(v1, v2, options) {

            if (v1 || v2) {
                return options.fn(this)
            }

            return options.inverse(this)
        },
        template_version() {
            return templateVersion
        },
    },

    prompts: {
        name: {
            when: 'isNotTest',
            type: 'string',
            required: true,
            message: 'Project name（项目名称）',
        },
        description: {
            when: 'isNotTest',
            type: 'string',
            required: false,
            message: 'Project description（项目描述）',
            default: 'A Vue.js project',
        },
        author: {
            when: 'isNotTest',
            type: 'string',
            message: 'Author（作者）',
        },
        deviceType: {
            when: 'isNotTest',
            type: 'list',
            message: 'Types of devices supported by pages（页面支持的设备类型）',
            choices: [
                {
                    name: 'Mobile: Android >= 4.0, iOS >= 7',
                    value: 'Mobile',
                    short: 'Mobile',
                },
                {
                    name: 'PC',
                    value: 'PC',
                    short: 'PC',
                },
            ]
        },
        cssPreprocessors: {
            when: 'isNotTest',
            type: 'list',
            message: 'CSS Preprocessors（CSS预处理器）',
            choices: [
                {
                    name: 'Less: It\'s CSS, with just a little more.',
                    value: 'Less',
                    short: 'Less',
                },
                {
                    name: 'Sass: Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.',
                    value: 'Sass',
                    short: 'Sass',
                },
            ]
        },
        hasComponent: {
            when: 'isNotTest',
            type: 'list',
            message: 'has component or not（是否有组件）',
            choices: [
                {
                    name: 'Yes',
                    value: 'Yes',
                    short: 'Yes',
                },
                {
                    name: 'No',
                    value: 'No',
                    short: 'No',
                },
            ]
        },
        autoInstall: {
            when: 'isNotTest',
            type: 'list',
            message:
                'Should we run `npm install` for you after the project has been created? (recommended)[创建项目后，我们应该为您运行`npm install`吗？ （推荐的）]',
            choices: [
                {
                    name: 'Yes, use NPM',
                    value: 'npm',
                    short: 'npm',
                },
                {
                    name: 'Yes, use Yarn',
                    value: 'yarn',
                    short: 'yarn',
                },
                {
                    name: 'No, I will handle that myself',
                    value: false,
                    short: 'no',
                },
            ],
        },
    },
    filters: {},
    complete: function (data, {chalk}) {
        const green = chalk.green;

        sortDependencies(data, green)

        const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

        if (data.autoInstall) {
            installDependencies(cwd, data.autoInstall, green)
                .then(() => {
                    return runLintFix(cwd, data, green)
                })
                .then(() => {
                    printMessage(data, green)
                })
                .catch(e => {
                    console.log(chalk.red('Error:'), e)
                })
        } else {
            printMessage(data, chalk)
        }
    },
};
