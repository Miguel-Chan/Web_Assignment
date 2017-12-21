const UserControl = require('./../model/UserControl')();
let UserManager = new UserControl();
let User = UserManager.User;
const sessionControl = require('./../model/SessionControl');
const passwordCrypto = require('./password_crypto');



async function signinHandler(ctx, next) {
    let name = ctx.query.username;
    if (!name) {
        await next();
        return;
    }
    let curr = sessionControl.getUsername(ctx.session);
    if (typeof curr === 'undefined') {
        ctx.session.err = '请先登录！';
        ctx.redirect('/');
        return;
    }
    if (curr !== name) {
        ctx.session.err = '只能够访问自己的数据';
        ctx.redirect('/?username=' + curr);
        return;
    }
    let user = await UserManager.getUser(name);
    if (user) {
        let msg = "";
        if (ctx.session.err) {
            msg = ctx.session.err;
            delete ctx.session.err;
        }
        ctx.render('view/userInfoPage.pug', {
            username: user.username,
            studentID: user.number,
            phoneNumber: user.telephone,
            email: user.email,
            message: msg
        });
    }
    else await next();
}

async function signinCheck(ctx, next) {
    let name = ctx.request.body.username, pass = ctx.request.body.password;
    let passHash = passwordCrypto(name, pass);
    let user = await UserManager.getUser(name);
    if (user) {
        if (user.password_hash === passHash) {
            sessionControl.bindSessionToUser(ctx.session, user.username);
            ctx.body = "Success";
        }
        else {
            ctx.response.status = 400;
            ctx.body = 1;
        }
    }
    else {
        ctx.response.status = 400;
        ctx.body = 2;
    }
}

async function signinIndex(ctx, next) {
    if (ctx.session.user) {
        ctx.redirect('/?username=' + ctx.session.user);
        return;
    }
    let msg = "";
    if (ctx.session.err) {
        msg = ctx.session.err;
        delete ctx.session.err;
    }
    ctx.render("view/signin.pug", {message: msg});
}

async function signOut(ctx, next) {
    sessionControl.unbindSession(ctx.session);
    ctx.redirect('/');
}

module.exports = {
    SigninHandler: signinHandler,
    index: signinIndex,
    check: signinCheck,
    SignOut: signOut
};