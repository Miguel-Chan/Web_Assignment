const fs = require('fs');
const database = require('./DatabaseControl');

function User(name, number, passHash, tele, email) {
    this.username = name;
    this.number = number;
    this.telephone = tele;
    this.password_hash = passHash;
    this.email = email;
}

function checkDuplicateFunc() {
    return async function (newUser) {
        let status = 1;
        status = await database.checkDuplicate(newUser);
        return status;
    }
}

function addUserFunc() {
    return async function (newUser) {
        if (await database.checkDuplicate(newUser) === 1) {
            database.addUser(newUser);
        }
    }
}

function getUserFunc() {
    return async function (username) {
        let user = await database.getUser(username);
        if (user[0]) {
            return user[0];
        }
        else return null;
    };
}

module.exports = function () {
    return function () {
        this.checkDuplicate = checkDuplicateFunc();
        this.User = User;
        this.getUser = getUserFunc();
        this.addUser = addUserFunc();
    };
};