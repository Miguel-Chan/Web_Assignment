const { Store } = require("koa-session2");
const database = require('./DatabaseControl');

class dbStore extends Store {
    constructor() {
        super();
    }

    async get(sid, ctx) {
        return await database.getSession(sid);
    }

    async set(session, { sid =  this.getID(24), maxAge = 86400000 } = {}, ctx) {
        try {
            await database.addSession(sid, session, maxAge / 1000);
        } catch (err) {}
        return sid;
    }

    async destroy(sid, ctx) {
        return await database.destroySession(sid);
    }
}

module.exports = dbStore;