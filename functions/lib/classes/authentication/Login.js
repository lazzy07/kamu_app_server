"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_config_1 = require("../../twilio_config");
const TWILIO_ACCOUNT_SID = twilio_config_1.default.sid;
const TWILIO_AUTH_TOKEN = twilio_config_1.default.token;
const TWILIO_PHONE = twilio_config_1.default.phone;
const text_sender = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
class Login {
}
Login.login = (users, data) => __awaiter(this, void 0, void 0, function* () {
    const user = yield users.where('phone', '==', data.phone).get();
    return user;
});
Login.saveAuthInfo = (users, user, phone) => __awaiter(this, void 0, void 0, function* () {
    const code = Math.floor(Math.random() * 899999 + 100000);
    const expiration = Date.now() + 2 * 60000;
    user.code = code;
    user.expiration = expiration;
    return users.doc(user.userName).update(user).then(result => {
        console.log("AUTH ::: USER SAVING INFO : " + user.userName);
        return true;
    }).catch(err => {
        console.log("ERROR AUTH ::: AUTH USER FAILED\n\tWhile registering : " + err);
        return false;
    });
});
Login.sendAuthSMS = (code, phone) => __awaiter(this, void 0, void 0, function* () {
    return text_sender.messages.create({
        from: TWILIO_PHONE,
        to: phone,
        body: "Your code for KAMU app is : " + code
    }).then(message => {
        console.log("Message : " + message);
        return true;
    }).catch(err => {
        console.log("TWILIO ::: Message send error : " + err);
        return false;
    });
});
exports.default = Login;
//# sourceMappingURL=Login.js.map