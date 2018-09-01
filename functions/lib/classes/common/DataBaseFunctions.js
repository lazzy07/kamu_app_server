"use strict";
/**
 * Check wether the element exists in the database
 * @param {Object} db database (collection) to be searched
 * @param {string|number} key username or the other key field to be searched
 * @param value value to be searched
 * @return {boolean}
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExists = (db, key, value) => __awaiter(this, void 0, void 0, function* () {
    return db.where(key, '==', value).get().then(snapshot => {
        console.log(snapshot.size);
        if (snapshot.size > 0) {
            return true;
        }
        else {
            return false;
        }
    });
});
//# sourceMappingURL=DataBaseFunctions.js.map