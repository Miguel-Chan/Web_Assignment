const Koa = require('koa');
const Pug = require('koa-pug');
const router = require('koa-router')();
const Static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const Signup = require('./controller/SignUp');
const Signin = require('./controller/SignIn');
const connectionInfo = require('./controller/connectInfo');
const sessionControl = require('./model/SessionControl');

const app = new Koa();
const pug = new Pug({ app: app });

const staticPath = "./view/static";
const jqueryPath = "./node_modules/jquery/dist";

app.use(connectionInfo());
app.use(sessionControl.initSession);

app.use(bodyParser());

app.use(Static(path.join(__dirname, staticPath)));
app.use(Static(path.join(__dirname, jqueryPath)));

router.post('/regist', Signup.postHandler);
router.get('/regist', Signup.index);

router.post('/signin', Signin.check);
router.get('/', Signin.SigninHandler);

router.get('/signout', Signin.SignOut);

app.use(router.routes());

app.use(Signin.index);


app.listen(3000);
console.log('App started at port 3000...');