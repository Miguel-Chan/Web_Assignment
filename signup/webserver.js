var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require("mime");
var querystring = require('querystring');
var userList = {};

function User(number, tele, email) {
    this.number = number;
    this.telephone = tele;
    this.email = email;
}

function parseName(_url) {
    //console.log(url.parse(_url).query);
    return querystring.parse(url.parse(_url).query).username;
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
getUserList();
http.createServer( function (request, response) {
    let signinStatus = 0;
    request.on("data", function (dataChunk) {
        let dataString = "" + dataChunk;
        let newUser = querystring.parse(dataString);
        signinStatus = 1;
        for (let symbol in userList) {
            if (newUser.username && symbol === newUser.username) {
                signinStatus *= 3;
            }
            if (newUser.number && userList[symbol].number === newUser.number) {
                signinStatus *= 4;
            }
            if (newUser.phone && userList[symbol].telephone === newUser.phone) {
                signinStatus *= 7;
            }
            if (newUser.mail && userList[symbol].email === newUser.mail) {
                signinStatus *= 11;
            }
        }
        if (signinStatus !== 1 || !newUser.username || !newUser.number ||
            !newUser.phone || !newUser.mail) return;
        userList[newUser.username] = new User(newUser.number, newUser.phone, newUser.mail);
        fileSave();
    });
    request.on("end", function () {
        if (signinStatus === 1) {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("Success");
            response.end();
            return;
        }
        if (signinStatus !== 0) {
            response.writeHead(400, {'Content-Type': 'text/plain'});
            response.write(signinStatus.toString());
            response.end();
            return;
        }
        var name = parseName(request.url);
        var pathname = url.parse(request.url).pathname;
        if (name || pathname === "/") {
            if (userList[name]) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write("<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "<meta charset=\"UTF-8\">\n" +
                    "<title>User Info</title>\n" +
                    "<link rel='stylesheet' type='text/css' href='client\\style.css'>" +
                    "<script type='text/javascript' src='node_modules\\jquery\\dist\\jquery.js'></script>\n" +
                    "<script type='text/javascript' src='client\\userInfo.js'></script>\n" +
                    "</head>\n" +
                    "<body>");
                response.write("<h1>详情</h1>");
                response.write("<div id='main-area'><h2>用户详情</h2>");
                response.write("<p>用户名: " + name + "</p>");
                response.write("<p>学号:  " + userList[name].number + "</p>");
                response.write("<p>电话:  " + userList[name].telephone + "</p>");
                response.write("<p>邮箱:  " + userList[name].email + "</p>");
                response.write("<button id='go-back'>返回</button>");
                response.write("</div>");
                response.write("</body>");
                response.end();
            }
            else {
                if (name) console.log(name + " Not found");
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write("<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <title>User Sign Up</title>\n" +
                    "<link rel='stylesheet' type='text/css' href='client\\style.css'>\n" +
                    "<script type='text/javascript' src='node_modules\\jquery\\dist\\jquery.js'></script>\n" +
                    "<script type='text/javascript' src='client\\signup.js'></script>\n" +
                    "</head>\n" +
                    "<body>");
                response.write("<h1>注册</h1>");
                response.write("<div id=\'main-area\'><h2>用户注册</h2>");
                response.write("<form method=\'post\'>");
                response.write("<p><label>用户名: </label>" + "<input name='username' type='text' placeholder='用户名'>" + "</p><p class='checker' id='username-checker'></p>");
                response.write("<p><label>学号:  </label>" + "<input name='number' type='text' placeholder='学号'>" + "</p><p class='checker' id='number-checker'></p>");
                response.write("<p><label>电话:  </label>" + "<input name='phone' type='text' placeholder='电话'>" + "</p><p class='checker' id='phone-checker'></p>");
                response.write("<p><label>邮箱:  </label>" + "<input name='mail' type='text' placeholder='邮箱'>" + "</p><p class='checker' id='email-checker'></p>");
                response.write("</form>");
                response.write("<input type='submit' id='submit'>");
                response.write("<button id='reset'>重置</button>");
                response.write("<p id='msg'></p>");
                response.write("</div>");
                response.write("</body>");
                response.end();
            }
        }
        else {
            console.log("Request for " + pathname + " received.");
            var type = mime.lookup(pathname);
            fs.readFile(pathname.substr(1), function (err, data) {
                    if (err) {
                        console.log(err);
                        response.writeHead(404, {'Content-Type': 'text/html'});
                    } else {
                        response.writeHead(200, {'Content-Type': type});
                        if (type.split("/")[0] === "text")
                            response.write(data.toString());
                        else response.write(data, "binary");
                    }
                    response.end();
                }
            )
        }
    })
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
