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
        this.quitted = false;
        this.load_database();

        io.on("connection", ((client) => {
            /* log(this) */
            /*             log("Client " + client.id + " connected."); */
            client.send()
            client.on("id_attribution_request", () => {
                log("Client " + client.id + " requested attribution")
                let id = crypto.randomUUID().toUpperCase();
                client.emit("id_attribution_reply", id);

            })
            client.on("login", (id => {
                log("Client " + id + " logging in !")
                client.user_id = id;
                let new_user = false;
                if (this.users[id]) {
                    new_user = new User(id)
                    new_user.load(this.users[id])
                    client.user = new_user;
                } else {
                    new_user = new User(id);
                    client.user = new_user
                    this.users[id] = new_user;
                }
                console.assert(new_user != false, id);
                this.online_users.push(new_user);
                client.emit("db", db);
            }))
            client.on("disconnect", disconnect => {
                log("Client " + client.user_id + " disconnected")
                /* log(this.users) */
                let u_i = this.online_users.indexOf(client.user)
                log(this.online_users, u_i)
                this.online_users[u_i].destroy();
                this.online_users.splice(u_i, 1)
            })
            client.on("message_write", msg => {
                let msg_id = crypto.randomUUID();
                this.messages[msg_id] = msg;
                client.user.writtenMessages.push(msg_id)
            })
            /* io.listen(42069); */
        }))
        httpServer.listen(42069);
        log("Forest server online !");
    }

    load_database() {
        this.load_users(db.get("users"));
        this.load_messages(db.get("messages"));
    }
    load_users(users) {
        for (let key of Object.keys(users)) {
            log("loading user " + users[key])
            for (let k of Object.keys[users[key]]) {

            }
        }
    }
    load_messages(messages) {
        for (let key of Object.keys(messages)) {
            log("loading user " + messages[key])
        }
    }

    save_database() {
        db.set("users", this.users);
        db.set("messages", this.messages)
    }

    quit() {
        if (!this.quitted) {
            this.quitted = true;
            this.save_database();
            db.sync();
            fs.copyFileSync("./db.json", "./db_backup.json")
            log("Forest server quitting !")
        }
    }
}



const forestServer = new ForestServer();

process.once("uncaughtException", e => {
    log(e)
    forestServer.quit();
    process.exit(0)
})
process.once("SIGINT", () => {
    forestServer.quit();
    throw new Error("QUIT !")
})