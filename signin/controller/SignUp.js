const UserControl = require('./../model/UserControl')();
let UserManager = new UserControl();
let User = UserManager.User;

function signupPost() {
    return async function (ctx, next) {
        let newUser = new User(ctx.request.body.username, ctx.request.body.number, ctx.request.body.password, ctx.request.body.phone, ctx.request.body.mail);
        let status = UserManager.checkDuplicate(newUser);
        ctx.body = status;
        if (status !== 1) {
            ctx.response.status = 400;
            return;
        }
        if (ctx.request.body.register === "true") {
            UserManager.addUser(newUser);
        }
    };
}

function signupIndex() {
    return async function (ctx, next) {
        await next();
        ctx.render("view/static/signup.pug");
    };
}

module.exports = {
    postHandler: signupPost(),
    index: signupIndex()
};