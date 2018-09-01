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
class FetchData {
}
FetchData.fetchData = (data, users) => __awaiter(this, void 0, void 0, function* () {
    const userData = yield users.doc(data.userName).get();
    if (userData.exists) {
        return userData;
    }
    else {
        return null;
    }
});
exports.default = FetchData;
//# sourceMappingURL=FetchData.js.map