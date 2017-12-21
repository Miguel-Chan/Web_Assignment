const session = require('koa-session2');

let sees_user = {};


function confSession() {
    return session({
        key: "SESSIONID",
        maxAge: 86400000,
    })
}

function GetUsername() {
    return function (sess) {
        return sess.user;
    }
}

function BindSessionToUser() {
    return function (sess, username) {
        sess['user'] = username;
    }

}

function UnbindSession() {
    return function (sess) {
        delete sess['user'];
    }

}

module.exports = {
    initSession: confSession(),
    getUsername: GetUsername(),
    bindSessionToUser: BindSessionToUser(),
    unbindSession: UnbindSession()
};