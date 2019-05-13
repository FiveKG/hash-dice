// @ts-check

function setEnv() {
  if (!process.env.CONSUL_URL) {
    process.env.CONSUL_URL = "http://192.168.1.157:8500";
  }
}

module.exports = setEnv;
