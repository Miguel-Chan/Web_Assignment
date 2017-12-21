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
            console.log("Error occur when connecting to database, Exiting.");
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
            console.log("Error occur when connecting to database, Exiting.");
            process.exit();
        }
    };
}


function duplicateChecker() {
    return async function (user) {
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
        return status;
    }
}


module.exports = {
    addUser: adder(),
    getUser: getter(),
    checkDuplicate: duplicateChecker()
};
