const fs = require('fs');
let userList = {};

function User(name, number, pass, tele, email) {
    this.username = name;
    this.number = number;
    this.telephone = tele;
    this.password = pass;
    this.email = email;
}

function getUserList() {
    try {
        userList = JSON.parse(fs.readFileSync("userList.json"));
    }
    catch (err) {
        fs.writeFileSync("userList.json", JSON.stringify(userList));
        console.log("获得本地用户信息时出错，重新创建文件");
    }
}

function fileSave() {
    let data = JSON.stringify(userList);
    fs.writeFile("userList.json", data, function (err) {
        if (err) console.log(err);
        else console.log("File saved");
    })
}

function passwordCheck(pass) {
    if (pass.length > 12 || pass.length < 6) return false;
    let pat = /^[1-9a-zA-Z-_]{6,12}/;
    return pat.test(pass);
}

function checkDuplicateFunc() {
    return function (newUser) {
        let status = 1;
        for (let symbol in userList) {
            if (newUser.username && symbol === newUser.username) {
                status *= 3;
            }
            if (newUser.number && userList[symbol].number === newUser.number) {
                status *= 4;
            }
            if (newUser.telephone && userList[symbol].telephone === newUser.telephone) {
                status *= 7;
            }
            if (newUser.email && userList[symbol].email === newUser.email) {
                status *= 11;
            }
            if (newUser.password && !passwordCheck(newUser.password)) {
                status *= 13;
            }
        }
        return status;
    }
}

function addUserFunc() {
    return function (newUser) {
        if (!userList[newUser.username]) {
            userList[newUser.username] = newUser;
        }
        fileSave();
    }
}

function getUserFunc() {
    return function (username) {
        if (userList[username]) {
            return userList[username];
        }
        else return null;
    };
}

module.exports = function () {
    getUserList();
    return function () {
        this.checkDuplicate = checkDuplicateFunc();
        this.User = User;
        this.getUser = getUserFunc();
        this.addUser = addUserFunc();
    };
};