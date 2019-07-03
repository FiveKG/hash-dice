const { fork } = require("child_process");
const path = require("path")

async function mainBonus() {
    fork(path.join(__dirname, "./bonusBingo.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "./bonusPK.js"), null , {
        env: process.env,      
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "./bonusSafe.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "./bonusHolder.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });
}

mainBonus();