export default {
    apps: [
        {
            name: "backend",
            script: "node ./dist/app.js",
            cwd: "./be",
            // pre_start: "npm run build",
        },
        {
            name: "frontend",
            script: "npm",
            args: "run dev",
            cwd: "./fe",
        },
    ],
};
