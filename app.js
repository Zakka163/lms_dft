import { execSync } from 'child_process';
import fs from 'fs';
import ora from 'ora';
import { chdir, cwd, exit } from 'process';

const runCommand = (command) => {
    const spinner = ora(`Running: ${command}`).start();
    try {
        execSync(command, { stdio: 'inherit' });
        spinner.succeed(`Completed: ${command}`);
    } catch (error) {
        spinner.fail(`Error executing: ${command}`);
        exit(1);
    }
};

const waitForCommand = (command) => {
    const spinner = ora(`Running: ${command}`).start();
    try {
        execSync(command, { stdio: 'inherit' });
        spinner.succeed(`Completed: ${command}`);
    } catch (error) {
        spinner.warn(`Waiting for task to complete: ${command}`);
        waitForCommand(command); // rekursif ulang
    }
};

// Pull the latest changes from git
runCommand('git pull');

// Navigate to backend folder and run commands
chdir('be');
if (!fs.existsSync('.env')) {
    runCommand('cp .env.example .env');
}
waitForCommand('npm install');
waitForCommand('npm run build');
waitForCommand('npm run sync');
waitForCommand('npm run seed');

// Go back to the parent directory
chdir('..');

// Navigate to frontend folder and run commands
chdir('fe');
waitForCommand('npm install');
chdir('..');

// Install PM2 globally
runCommand('npm i -g pm2');

// Start the application with PM2
runCommand('pm2 start ecosystem.config.js');

// Monitor PM2 processes
runCommand('pm2 monit');
