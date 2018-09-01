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
class Signup {
}
Signup.register = (db, data) => __awaiter(this, void 0, void 0, function* () {
    data.registered = false;
    data.public = {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName
    };
    return db.collection('users').doc(data.userName).set(data).then(result => {
        console.log("REGISTER::: USER : " + result);
        return data;
    }).catch(err => {
        console.log("ERROR ::: REGISTER USER FAILED\n\tWhile registering : " + err);
        return null;
    });
});
exports.default = Signup;
//# sourceMappingURL=Signup.js.map