import Twilio_Config from '../../twilio_config';

const TWILIO_ACCOUNT_SID = Twilio_Config.sid;
const TWILIO_AUTH_TOKEN = Twilio_Config.token;
const TWILIO_PHONE = Twilio_Config.phone;

const text_sender = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


export default class Login{
    static login = async (users, data) => {
        const user = await users.where('phone', '==', data.phone).get();
        return user;
    }

    static saveAuthInfo = async (users, user, phone) => {
        const code = Math.floor(Math.random()*899999+100000);
        const expiration = Date.now() + 2*60000;
        
        user.code = code;
        user.expiration = expiration;

        return users.doc(user.userName).update(user).then(result =>{
            console.log("AUTH ::: USER SAVING INFO : " + user.userName);
            return true;
        }).catch(err => {
            console.log("ERROR AUTH ::: AUTH USER FAILED\n\tWhile registering : " + err);
            return false;
        })
    }

    static sendAuthSMS = async (code, phone) => {
        return text_sender.messages.create({
            from: TWILIO_PHONE,
            to: phone,
            body: "Your code for KAMU app is : "+ code
        }).then(message => {
            console.log("Message : "+ message);
            return true;
        }).catch(err => {
            console.log("TWILIO ::: Message send error : " + err);
            return false;
        })
    }    
}