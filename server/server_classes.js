class User {
    constructor(id) {
        this.id = id;
        this.writtenMessages = []
    }

    destroy() {

    }

    load(existing_usr) {
        for (let key of Object.keys(existing_usr)) {
            this[key] = existing_usr[key];
        }
    }
}
module.exports = {
    User
}