export default class Signup {
    static register = async (db, data) => {
        data.registered = false;
        data.public = {
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName
        }

        return db.collection('users').doc(data.userName).set(data).then(result =>{
            console.log("REGISTER::: USER : " + result);
            return data;
        }).catch(err => {
            console.log("ERROR ::: REGISTER USER FAILED\n\tWhile registering : " + err);
            return null;
        })
    }
}