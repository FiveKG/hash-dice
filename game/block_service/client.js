// @ts-check
const ClientSocket = require('./src/ClientSocket');

// console.debug("ClientSocket: ", ClientSocket);
ClientSocket.link()
.then(() => {

})
.catch(err => {
    console.error("error: ", err);
})