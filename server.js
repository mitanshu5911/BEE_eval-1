const http=require("http");
const fs=require("fs");
const path = require("path");

const HomePage = fs.readFileSync('./public/index.html', "utf-8");
const registrationFormPage = fs.readFileSync('./public/Registration Form/index.html');

const server = http.createServer((req,resp) => {
    let url = req.url;
    let method=req.method;

    if(url==="/" || url.toLowerCase()==="/home"){
        resp.writeHead(200, { "Content-Type": "text/html" });
        resp.end(HomePage);
    }
    else if(url==="/registrationForm"){
        resp.writeHead(200, { "Content-Type": "text/html" });
        resp.end(registrationFormPage);
    }else if(url==="/submit" && method==="POST"){
        let body='';

        req.on("data", chunk => {
            body +=chunk.toString();
        });

        req.on("end",() => {
            const formData = new URLSearchParams(body);

            const userData={
                email: formData.get("inputEmail"),
                name: formData.get("inputName"),
                dob: formData.get("inputDOB"),
                gender: formData.get("inputGender"),
                mobile: formData.get("inputMobileNO"),
                address: formData.get("inputAddress"),
                zipcode: formData.get("inputZipcode"),
                city: formData.get("inputCity"),
                course: formData.get("inputCourse"),
                otherInfo: formData.get("otherinfo")
            };

            const filePath= path.join(__dirname,"./users.json");

            fs.readFile(filePath,"utf-8",(err,data) => {
                let users=[];
                if(!err && data){
                    users=JSON.parse(data);
                }
                users.push(userData);

                fs.writeFile(filePath,JSON.stringify(users,null,2), (err) => {
                    if(err){
                        resp.writeHead(500, { "Content-Type": "text/plain" });
                        return resp.end("Error saving user data");
                    }
                    resp.writeHead(200, { "Content-Type": "text/plain" });
                    resp.end("Form submitted successfully");
                    console.log("Successfully stored");
                })
            })
        });
    }
    else{
        resp.writeHead(404, { "Content-Type": "text/plain" });
        resp.end("Page not found");
    }
});

server.listen(3000,'127.0.0.1', () =>{
    console.log('Server has Started!!!!!');
});