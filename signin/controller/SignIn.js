const UserControl = require('./../model/UserControl')();
let UserManager = new UserControl();
let User = UserManager.User;


async function signinHandler(ctx, next) {
    let name = ctx.query.username;
    if (!name) {
        await next();
        return;
    }
    let user = UserManager.getUser(name);
    if (user) {
        ctx.render('view/static/userInfoPage.pug', {
            username: user.username,
            studentID: user.number,
            phoneNumber: user.telephone,
            email: user.email,
            message: ""
        });
    }
    else await next();
}

async function signinCheck(ctx, next) {
    let name = ctx.request.body.username, pass = ctx.request.body.password;
    let user = UserManager.getUser(name);
    if (user) {
        if (user.password === pass) {
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
    ctx.render("view/static/signin.pug");
}

module.exports = {
    SigninHandler: signinHandler,
    index: signinIndex,
    check: signinCheck
};