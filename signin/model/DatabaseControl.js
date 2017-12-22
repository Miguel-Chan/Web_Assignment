let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";



function initCollection() {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let base = db.db('signin');
        base.createCollection("users", function(err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
        });
    });
}


function adder() {
    return async function (user) {
        try {
            let db = await MongoClient.connect(url);
            let base = db.db('signin');
            let res = await base.collection('users').insertOne(user);
            console.log(`User ${user.username} inserted`);
            db.close();
        }
        catch (err) {
            console.log(err);
            console.log("Error connecting to database occurs when adding user, Exiting..");
            process.exit();
        }
    };
}



function getter() {
    return async function (username) {
        try {
            let db = await MongoClient.connect(url);
            let base = db.db('signin');
            let res = await base.collection('users').find({username: username}).toArray();
            console.log("User " + username + " queried.");
            db.close();
            return res;
        }
        catch (err) {
            console.log(err);
            console.log("Error connecting to database occurs when querying user, Exiting..");
            process.exit();
        }
    };
}


function duplicateChecker() {
    return async function (user) {
        try {
            let status = 1;
            let db = await MongoClient.connect(url);
            let base = db.db('signin');
            if (user.username) {
                let res = await base.collection('users').find({username: user.username}).toArray();
                if (res.length !== 0) status *= 3;
            }
            if (user.number) {
                let res = await base.collection('users').find({number: user.number}).toArray();
                if (res.length !== 0) status *= 4;
            }
            if (user.telephone) {
                let res = await base.collection('users').find({telephone: user.telephone}).toArray();
                if (res.length !== 0) status *= 7;
            }
            if (user.email) {
                let res = await base.collection('users').find({email: user.email}).toArray();
                if (res.length !== 0) status *= 11;
            }
            db.close();
            return status;
        }
        catch (err) {
            console.log(err);
            console.log("Error connecting to database occurs when checking user duplicate, Exiting..");
            process.exit();
        }
    }
}

function sessionAdder() {
    return async function (sid, session, time) {
        try {
            await sessionDestroyer()(sid);
            let db = await MongoClient.connect(url);
            let base = db.db('signin');
            base.collection('SESSION').createIndex({'timer': 1}, {expireAfterSeconds: time});
            let data = {SESSIONID: sid, SESSION: session, timer: new Date()};
            let res = await base.collection('SESSION').insertOne(data);
            db.close();
        }
        catch (err) {
            console.log(err);
            console.log("Error connecting to database occurs when adding session, Exiting..");
            process.exit();
        }
    }
}

function sessionGetter() {
    return async function (sid) {
        try {
            let db = await MongoClient.connect(url);
            let base = db.db('signin');
            let res = await base.collection('SESSION').find({SESSIONID: sid}).toArray();
            if (res.length === 0) return undefined;
            db.close();
            return res[0].SESSION;
        }
        catch (err) {
            console.log(err);
            console.log("Error connecting to database occurs when querying session, Exiting..");
            process.exit();
        }
    }
}

function sessionDestroyer() {
    return async function (sid) {
        try {
            let db = await MongoClient.connect(url);
            let base = db.db('signin');
            let res = await base.collection('SESSION').deleteMany({SESSIONID: sid});
            db.close();
        }
        catch (err) {
            console.log(err);
            console.log("Error connecting to database occurs when destroying session, Exiting..");
            process.exit();
        }
    }
}

module.exports = {
    addUser: adder(),
    getUser: getter(),
    checkDuplicate: duplicateChecker(),
    getSession: sessionGetter(),
    addSession: sessionAdder(),
    destroySession: sessionDestroyer()
};
