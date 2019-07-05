const { fork } = require("child_process");
const path = require("path")

async function mainBonus() {
    fork(path.join(__dirname, "../../job/bonusBingo.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "../../job/bonusPK.js"), null , {
        env: process.env,      
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "../../job/bonusSafe.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });

    fork(path.join(__dirname, "../../job/bonusHolder.js"), null , {
        env: process.env,
        cwd : __dirname,
        stdio: "inherit"
    });
}

mainBonus();