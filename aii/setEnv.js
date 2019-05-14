// @ts-check

function setEnv() {
  if (!process.env.CONSUL_URL) {
    process.env.CONSUL_URL = "http://localhost:8500";
  }
}

module.exports = setEnv;
