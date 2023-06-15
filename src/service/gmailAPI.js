const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const customiError = require('../errorHandler/customiError');
const validator = require('validator');
const Oauth2 = google.auth.OAuth2;

const GmailAPI = {
    async sendForgetMail(req, res, next){
        const { to, subject, text } = req.body;
        if(!to || !subject || !text){
            return next(customiError(400, "請填寫晚整郵件資訊"));
        };
        if(!validator.isEmail( to,{host_whitelist:['gmail.com', 'yahoo.com']}) ){
            return next(customiError(400, "信箱格式錯誤"));
        }
        
        const oauth2Client = new Oauth2(
            process.env.GOOGLE_AUTH_CLIENTID,
            process.env.GOOGLE_AUTH_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );
        
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN
        });

        const accessToken = oauth2Client.getAccessToken();
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: "cl4m3861026@gmail.com", 
                clientId: process.env.GOOGLE_AUTH_CLIENTID,
                clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: 'Avocado <cl4m3861026@gmail.com>',
            to,
            subject,
            text
        };
    
    
        await transporter.sendMail(mailOptions);
    
        res.status(200).json({
            status: 'success',
            message: "信件發送成功"
        });
    }
}


module.exports = GmailAPI