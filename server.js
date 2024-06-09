var http = require('http')
var nodemailer = require('nodemailer')
var fs = require('fs')
var qs = require('querystring');


var otpmap = new Map()
var otp=''
function generateSession(){
    return Math.random().toString(36).slice(2);
}
function generateOTP(){
    return Math.floor(1000 + Math.random() * 9000);
}
http.createServer((req,res)=>{



if(req.url=='/' && req.method.toLowerCase()==='get'){
    res.setHeader('Content-Type','text/html')
    fs.readFile('otp-send.html',function(err,htmldata){
        
        res.write(htmldata)  
        res.end("hello their!")

    })    

}
else if(req.url=='/send-email' ){
    console.log(otp)
    if(req.method.toLowerCase()==='post'){
    otp=generateOTP();

    var usersemail;

    req.on('data',chunk=>{
        usersemail=chunk.toString()
    })
    req.on('end',()=>{
        console.log('Recieved:',usersemail)
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end('data recieved buddy')
    
    var transporter= nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: 'uditj668@gmail.com',
            pass: 'lilj hdgi opfe bxxs'
        }
    })

    var mailOptions={
        from: 'uditj668@gmail.com',
        to: usersemail,
        subject:'One Time Password',
        text:'This is one time otp for veeram,dont share it with anybody-'+otp

    }

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log('Email sent:' + info.response)
        }
    })})
    }else if(req.method.toLowerCase()==='get'){
        console.log("mai aagya")

    fs.readFile('otp-check.html',function(err,htmldata){
        res.write(htmldata)
        res.end('hehe got that')
    })
    }
}else if(req.url === '/get-session-id' && req.method.toLowerCase() === 'get'){
    const sessionID = generateSession();
    otpmap.set(sessionID,otp)
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(sessionID);
}

else if(req.url==='/teleotp'){
    if(req.method.toLowerCase()==='post'){
        var body=''

        req.on('data',(chunk)=>{
            body+=chunk.toString()
        })
        req.on('end',()=>{
            var resp;
            var parsedBody = qs.parse(body);
            console.log(body)
            var otpinp = parsedBody.otpinp;
            var gotsessionID = parsedBody.sessionID;
            console.log('ye mila',otp,otpinp,gotsessionID)

                if(otpmap.has(gotsessionID)){
                    console.log('hai bhhi hai')
                    if(otpmap.get(gotsessionID)==otpinp){
                        resp="Hurray you are verified"
                    }else{
                        resp="oops wrong otp"
                    }
                
                }else{console.log('nhi hai')}
            res.end(resp)
        })
    }

}




}).listen(8083,'192.168.29.125',()=>{
    console.log('Server is running')
})

