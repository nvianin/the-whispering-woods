const log = console.log;
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["the-whispering-woods"],
        credentials: false
    }
});
const JSONdb = require("simple-json-db")
const db = new JSONdb("./db.json");
const fs = require("fs");
const crypto = require("crypto")
const {
    User
} = require("./server_classes.js")
class ForestServer {
    constructor() {
        this.users = {};
        this.messages = {}
        this.online_users = []
        this.load_database()

        io.on("connection", client => {
            log("Client " + client.id + " connected.");
            client.send()
            client.on("id_attribution_request", () => {
                log("Client " + client.id + " requested attribution")
                let id = crypto.randomUUID().toUpperCase();
                client.emit("id_attribution_reply", id);

            })
            client.on("login", id => {
                log("Client " + client.id + " logging in !")
                client.user_id = id;
                if (this.users[id]) {
                    let new_user = new User(id)
                    new_user.load(this.users[id])
                    this.online_users.push(new_user);
                    client.user = new_user;
                } else {
                    let new_user = new User(id);
                    client.user = new_user
                    this.users[id] = new_user;
                }
            })
            client.on("disconnect", disconnect => {
                log("Client " + client.id + " disconnected")
                this.users[client.user_id].destroy();
                this.online_users.splice(
                    this.online_users.indexOf(this.users[client.user_id]),
                    1
                )
            })
            client.on("message_write", msg => {
                let msg_id = crypto.randomUUID();
                this.messages[msg_id] = msg;
                client.user.writtenMessages.push(msg_id)
            })
        })
        /* io.listen(42069); */
        httpServer.listen(42069);
        log("Forest server online !")
    }

    load_database() {
        this.users = db.get("users");
        this.messages = db.get("messages")
    }

    save_database() {
        db.set("users", this.users);
        db.set("messages", this.messages)
    }

    quit() {
        this.save_database();
        db.sync();
        fs.copyFileSync("./db.json", "./db_backup.json")
        log("Forest server quitting !")
    }
}

const forestServer = new ForestServer();

process.once("uncaughtException", e => {
    log(e)
    forestServer.quit()
    process.exit(0)
})
process.once("SIGINT", () => {
    throw new Error("QUIT !")
})