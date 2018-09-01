import * as admin from 'firebase-admin';

export default class ResturentFunctions{
    static register = (resturentsDB, usersDB, enterpriseDB, req, res) => {
        const data = req.body;

        console.log("REGISTER ::: Resturent registration initiated for : " + data.userName);

        return resturentsDB.where("userName", '==', data.userName).get().then(snapshot => {
            return usersDB.where("userName", '==', data.userName).get().then(usersSnapshot =>{
                return enterpriseDB.where("userName", '==', data.userName).get().then(enterpriseSnapshot => {
                    return resturentsDB.where("email", '==', data.email).get().then(resturentEmailsnapshot => {
                        return enterpriseDB.where("email", '==', data.email).get().then(enterpriseEmailsnapshot => {
                            if(snapshot.size > 0 || usersSnapshot.size > 0 || enterpriseSnapshot.size > 0 || resturentEmailsnapshot.size > 0 ||enterpriseEmailsnapshot.size > 0){
                                console.log("Register resturent User Already exists : " + data.userName)
                                return res.status(201).send("Username already exists, try another");
                            }else{
                                if(data.userName.charAt(0) === '@' && data.userName.length > 0 && data.city.length > 0 && data.email.length > 0){
                                    return admin.auth().getUserByEmail(data.email).then(authUserInstance => {
                                        console.log("An account under this Email already exists : " + data.userName)
                                        return res.status(201).send("An account under this Email already exists");
                                    }).catch(errorAdminAuth => {
                                        if (errorAdminAuth.code === 'auth/user-not-found') {
                                            return admin.auth().createUser({email: data.email, password: data.password, displayName: data.userName}).then(authUserdata => {
                                                const saveData = {
                                                    firstName: data.firstName,
                                                    userName: data.userName,
                                                    email: data.email,
                                                    enterprise: data.enterprise,
                                                    city: data.city,
                                                    authId: authUserdata.uid
                                                }
                                                return resturentsDB.doc(data.userName).set(saveData).then(results => {
                                                    console.log("REGISTER ::: Resturent complete : " + data.userName);
                                                    return res.status(202).send(results);
                                                }).catch(errorSave => {
                                                    console.log("ERROR ::: " + errorSave)
                                                    return res.status(201).send(errorSave.message);
                                                })
                                            }).catch(errCreateAuth => {
                                                console.log("ERROR ::: " + errCreateAuth)
                                                return res.status(201).send(errCreateAuth.message);
                                            })
                                        }else{
                                            console.log("ERROR ::: " + errorAdminAuth);
                                            return res.status(201).send(errorAdminAuth.message);
                                        }
                                    })
                                }else{
                                    console.log("ERROR ::::::: Attempt to breach of security detected!!!!!!!");
                                    return res.status(455).send("Attempt to breach of security detected!");
                                }
                            }
                        });
                    });
                })
            })
        })
    }

    static loginWithUserName = (resturentsDB, req, res) => {
        const data = req.body;

        return resturentsDB.doc(data.userName).get().then(doc => {
            if(doc.exists){
                const resData = doc.data();
                //console.log(resData.authId);
                return admin.auth().getUser(resData.authId).then((userRecord) => {
                    if(userRecord.email){
                        if(userRecord.emailVerified){
                            return resturentsDB.where("email", '==', resData.email).get().then(resturentEmailsnapshot => {
                                if(resturentEmailsnapshot.size === 1){
                                    console.log("Verification complete : " + resData.email);
                                    return res.status(202).send(resData.email);
                                }else{
                                    console.log("AUTH ::: Auth data maybe manipulated");
                                    return res.status(457).send("Server error : 100");
                                }
                            })
                        }else{
                            console.log("Email not verified");
                            return res.status(203).send("Email not verified");
                        }
                    }else{
                        console.log("ERROR ::: Email not found in auth");
                        return res.status(455).send("ERROR ::: Email not found in auth");
                    }
                }).catch(authErr => {
                    console.log("Auth get user err: "+authErr);
                    return res.status(455).send("ERROR ::: Server Error");
                })
            }else{
                console.log("Incorrect username password combination");
                return res.status(204).send("Incorrect username password combination");
            }
        })

    }
}