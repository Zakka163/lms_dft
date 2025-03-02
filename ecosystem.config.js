module.exports = {
    apps: [
        {
            name: "backend",
            script: "node ./be/dist/app.js",
            cwd: "./be",
            pre_start: "npm run build", 
        },
        {
            name: "frontend",
            script: "npm",
            args: "run dev",
            cwd: "./fe", 
        },
    ],
};


//   pm2 start ecosystem.config.js
