const UserControl = require('./../model/UserControl')();
let UserManager = new UserControl();
let User = UserManager.User;
const passwordCrypto = require('./password_crypto');
const sessionControl = require('./../model/SessionControl');


function passwordCheck(pass) {
    if (pass.length > 12 || pass.length < 6) return false;
    let pat = /^[1-9a-zA-Z-_]{6,12}/;
    return pat.test(pass);
}

function signupPost() {
    return async function (ctx, next) {
        let pass = ctx.request.body.password;
        let hash;
        if (pass) hash = passwordCrypto(ctx.request.body.username, pass);
        let newUser = new User(ctx.request.body.username, ctx.request.body.number, hash, ctx.request.body.phone, ctx.request.body.mail);
        let status = await UserManager.checkDuplicate(newUser);
        if (pass && !passwordCheck(pass)) {
            status *= 13;
        }
        ctx.body = status;
        if (status !== 1) {
            ctx.response.status = 400;
            return;
        }
        if (ctx.request.body.register === "true") {
            await UserManager.addUser(newUser);
            sessionControl.bindSessionToUser(ctx.session, newUser.username);
        }
    };
}

function signupIndex() {
    return async function (ctx, next) {
        if (ctx.session.user) {
            ctx.session.err = '请先退出登录后再进行注册！';
            ctx.redirect('/');
            return;
        }
        let msg = "";
        if (ctx.session.err) {
            msg = ctx.session.err;
            delete ctx.session.err;
        }
        ctx.render("view/signup.pug", {message: msg});
    };
}

module.exports = {
    postHandler: signupPost(),
    index: signupIndex()
};