#! /usr/bin/env node

const chalk = require('chalk');
const packageJson = require('./package.json');
const commander = require('commander');
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs-extra');

function end(appName) {
    const targetPath = `${process.cwd()}/${appName}`;

    fs.copyFileSync(`${appName}/.env.template`, `${appName}/.env`);

    console.log(`
  Success! Created ${chalk.green(appName)} at ${chalk.green(targetPath)}.
    1. Switch to ${chalk.green(appName)} directory.
    2. Fill ${chalk.green('.env')} file with your configuration secrets.
    3. Run ${chalk.cyan('npm install')} to install npm dependencies.
    4. Run ${chalk.cyan('npm run dev')} to start your express application.
    `);
}

function main(appName) {
    const files = [];

    const targetPath = `${process.cwd()}/${appName}`;

    console.log(`
  Creating a new express application in ${chalk.green(targetPath) + '/'}...`);

    fs.copySync(__dirname + '/template', appName, {
        filter: (path, dst) => {
            files.push(dst);

            return true;
        },
    });

    files.forEach((file, i) => {
        if (!file.includes('.') && !file.includes('Makefile')) return;

        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.error(`Can't read file: ${file}`);
                process.exit(1);
            }

            const result = data.replace(/template/g, appName);

            fs.writeFile(file, result, 'utf8', function (err) {
                if (err) {
                    process.exit(1);
                }

                if (i === files.length - 1) {
                    end(appName);
                }
            });
        });
    });
}

new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<expess-app-name>')
    .action((appName) => {
        if (validateProjectName(appName).validForNewPackages) {
            if (fs.existsSync(appName)) {
                console.error(`Directory already exists: ${chalk.green(appName)}`);
                process.exit(1);
            } else {
                main(appName);
            }
        } else {
            console.error(`Invalid express app name: ${chalk.green(appName)}`);
            process.exit(1);
        }
    })
    .parse(process.argv);
