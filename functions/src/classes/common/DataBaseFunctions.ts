/**
 * Check wether the element exists in the database
 * @param {Object} db database (collection) to be searched
 * @param {string|number} key username or the other key field to be searched
 * @param value value to be searched
 * @return {boolean}
 */

export const isExists = async (db, key, value) => {
    return db.where(key, '==', value).get().then(snapshot => {
        console.log(snapshot.size);
        if(snapshot.size > 0){
            return true;
        }else{
            return false;
        }
    });
}