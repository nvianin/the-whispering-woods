const log = console.log;
const io = require("socket.io")();
const JSONdb = require("simple-json-db")
const db = new JSONdb("./db.json");

class ForestServer {
    constructor() {
        io.on("connection", client => {
            log(client);
            client.send()
        })
        io.listen(42069);
        log("Forest server online !")
    }
}

const forestServer = new ForestServer();