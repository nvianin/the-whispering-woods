const log = console.log;
const io = require("socket.io")();

class ForestServer {
    constructor() {
        io.on("connection", client => {
            log(client);
        })
        io.listen(42069);
        log("Forest server online !")
    }
}

const forestServer = new ForestServer();