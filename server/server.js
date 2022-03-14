const log = console.log;
const io = require("socket.io")();
const JSONdb = require("simple-json-db")
const db = new JSONdb("./db.json");
const fs = require("fs");

class ForestServer {
    constructor() {
        io.on("connection", client => {
            log(client);
            client.send()
        })
        io.listen(42069);
        log("Forest server online !")
    }

    quit() {
        db.set("test", "test")
        db.sync();
        fs.copyFileSync("./db.json", "./db_backup.json")
        log("Forest server quitting !")
    }
}

const forestServer = new ForestServer();

process.once("uncaughtException", () => {
    forestServer.quit()
    process.exit(0)
})
process.once("SIGINT", () => {
    throw new Error("QUIT !")
})