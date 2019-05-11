const { fork } = require("child_process");
const path = require("path")

async function test() {
    fork(path.join(__dirname, "./test1.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "./test2.js"), null , {
        env: process.env,      
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "./test3.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });
}

test()