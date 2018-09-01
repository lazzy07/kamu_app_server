//Created by Lasantha Madushan Senanayake
//2018 7 5
//Cyborg Studios Production

/* 
################################## FIREBASE ###########################################
*/


import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as cors from 'cors';
const corsHandler = cors({origin: true});
//Initializing the app
admin.initializeApp();
//Connecting firestore
const db = admin.firestore();


/* 
################################## SERVER FUNCTIONS ###########################################
*/

//Imports
import Signup from './classes/authentication/Signup';
import Login from './classes/authentication/Login';
import FetchData from './classes/data/FetchData';

import ResturentFunctions from './classes/resturents/ResturentFunctions';
// import Twilio_Config from './twilio_config';
// import { user } from 'firebase-functions/lib/providers/auth';

const users = db.collection('users');
const resturents = db.collection('resturents');
const enterprises = db.collection('enterprises');

//Signup
export const signup = functions.https.onRequest((req, res) => {
    const data = req.body;
    console.log("REGISTER ::: REQ from :" + req.body.userName);
    
    return users.where('phone', '==', data.phone).get().then(snapshot => {
        if(snapshot.size > 0){
            console.log("DATABASE ::: PHONE FOUND! CREATE NEW : NO");
            return res.status(201).send("Account with same phone number found");
        }else{
            return users.where('userName', '==', req.body.userName).get().then((foundUser) =>{
                if(foundUser.size > 0){
                    console.log("DATABASE ::: USERNAME FOUND! CREATE NEW : NO");
                    return res.status(202).send("Username already exists");
                }else{
                    return Signup.register(db, data).then(signedUpData => {
                        console.log("REGISTER ::: REQ DONE :" + req.body.userName);
                        
                        if(signedUpData){
                            return Login.saveAuthInfo(users, signedUpData, data.phone).then(usr => {
                                if(usr){
                                    console.log("SIGNUP ::: Signup Complete : " + signedUpData.userName);
                                    return res.status(200).send(signedUpData);
                                    // return Login.sendAuthSMS(data.code, data.phone).then(suc => {
                                    //     if(suc){
                                    //         console.log("AUTH ::: Complete : " + data.phone);
                                            
                                    //     }else{
                                    //         return res.status(404).send('ERROR ::: Server error');
                                    //     }
                                    // }).catch(err => {
                                    //     console.log("ERROR AUTH ::: Send sms : "+ err);
                                    //     return res.status(404).send('ERROR ::: Server error');
                                    // })
                                }else{
                                    return res.status(404).send('ERROR ::: Server error');
                                }
                            }).catch(err => {
                                return res.status(404).send("ERROR ::: Server Error");
                            });
                        }else{
                            return res.status(404).send("ERROR :: Internel Error");
                        }
                    }).catch(err => {
                        console.log(err);
                        return res.status(404).send("ERROR :: Internel Error");
                    });
                }
            }).catch(err => {
                console.log(err);
                return res.status(404).send("ERROR :: Internel Error");
            });
            //return null;
        }
    }).catch(err=>{
        res.status(404).send("ERROR ::: Server error, Try again later");
        console.log("DATABASE ::: ERR : "+ err);
    })
})

//login
export const login = functions.https.onRequest((req, res) => {
    const data = req.body;
    console.log("LOGIN ::: Login req : " + data.phone);
    return Login.login(users, data).then(user => {
        let sendData;
        if(user.size === 1){
            user.forEach(element => {
                sendData = element.data();
            });
            console.log('LOGIN ::: Phone found handling with twillo : '+ data.phone);
            return Login.saveAuthInfo(users, sendData, data.phone).then(usr => {
                if(usr){
                    return res.status(200).send(sendData);
                    // return Login.sendAuthSMS(data.code, data.phone).then(suc => {
                    //     if(suc){
                    //         console.log("AUTH ::: Complete : " + data.phone);
                            
                    //     }else{
                    //         return res.status(404).send('ERROR ::: Server error');
                    //     }
                    // }).catch(err => {
                    //     console.log("ERROR AUTH ::: Send sms : "+ err);
                    //     return res.status(404).send('ERROR ::: Server error');
                    // })
                }else{
                    return res.status(404).send('ERROR ::: Server error');
                }
            }).catch(err => {
                return res.status(404).send("ERROR ::: Server Error");
            });

        }else{
            console.log('LOGIN ::: Phone not found : '+ data.phone);
            return res.status(201).send("Phone number not found please signup");
        }
    }).catch(err => {
        console.log("ERROR LOGIN ::: Error while login in Login class: " + err);
        return res.status(404).send("ERROR ::: Server error");
    });
})

export const changephone = functions.https.onRequest((req, res) => {
    const data = req.body;
    if(data.phone){
        return users.where('phone', '==', data.phone).get().then(phoneFound => {
            if(phoneFound.size === 0){
                console.log("CHANGE PHONE ::: Auth : " + data.userName);
                return Login.saveAuthInfo(users, {userName: data.userName}, data.phone).then(done => {
                    if(done){
                        return users.doc(data.userName).update({phone : data.phone}).then(sendData => {
                            if(sendData){
                                console.log("CHANGE PHONE ::: Change user phone finished");
                                return res.status(200).send({userName: data.userName, phone: data.phone});
                                // return Login.sendAuthSMS(data.code, data.phone).then(suc => {
                                //     if(suc){
                                //         console.log("AUTH ::: Complete : " + data.phone);
                                        
                                //     }else{
                                //         return res.status(404).send('ERROR ::: Server error');
                                //     }
                                // }).catch(err => {
                                //     console.log("ERROR AUTH ::: Send sms : "+ err);
                                //     return res.status(404).send('ERROR ::: Server error');
                                // })
                            }else{
                                return res.status(201).send("Username not found");
                            }
                        }).catch(err => {
                            console.log("ERROR CHANGE PHONE ::: Finding using username error");
                            res.status(404).send("ERROR ::: Server error");
                        })
                    }else{
                        console.log("Save AUTH failed")
                        return res.status(404).send('ERROR ::: Server error');
                    }
                }).catch(err => {
                    console.log("CHANGE PHONE : Error : " + err);
                    return res.status(404).send("ERROR ::: Server Error");
                });
            }else{
                console.log("CHANGE PHONE ::: Phone already exists");
                return res.status(202).send("This phone has already been registered");
            }
        })
    }else{
        return null;
    }
})


export const authuser = functions.https.onRequest((req, res) => {
    const data = req.body;
    if(data.code){
        console.log("AUTH USER ::: Request to auth from : " + data.userName);
        return users.doc(data.userName).get().then(doc => {
            if(doc.exists){
                let usr = doc.data();
                console.log("Doc code: " + usr.code + " Got code : " + data.code);
                const uCode = parseInt(usr.code);
                const dCode = parseInt(data.code);
                if(uCode === dCode){
                    usr.uid = data.uid;
                    usr.registered = true;
                    return users.doc(data.userName).update(usr).then(() => {
                        const now = Date.now();
                        if(usr.expiration >= now){
                            console.log("AUTH USER ::: Code Correct update complete");
                            return res.status(200).send(usr);
                        }else{
                            console.log("AUTH USER ::: Expired code");
                            return res.status(202).send("Use another code");
                        }
                    }).catch((err) => {
                        console.log("ERROR AUTH CODE ::: Error while checking code : " + err);
                        return res.status(404).send("Error : Server error");
                    })
                }else{
                    console.log("AUTH ::: Code entered is wrong :" + data.code + " by : " + data.userName); 
                    return res.status(201).send("Wrong auth code");
                }
            }else{
                console.log("AUTH USER ::: Cannot find the doc for :" + data.userName);
                res.status(404).send("ERROR ::: Server error");
                return null;
            }
        })
    }else{
        console.log("AUTH USER ::: Cannot find the code!");
        res.status(404).send("ERROR ::: Server error");
        return null;
    }
});

export const fetchdata = functions.https.onRequest((req, res) => {
    const data = req.body;
    if(data.userName && data.uid){
        console.log("FETCH DATA ::: user fetching :" + data.userName);
        return FetchData.fetchData(data, users).then(foundData => {
            if(foundData){
                console.log("FETCH DATA ::: op completed for : " + data.userName);
                return res.status(200).send(foundData);
            }else{
                console.log("FETCH DATA ::: someone else has been logged as : " + data.userName);
                return res.status(201).send("ERROR ::: Someone else has been logged");
            }
        }).catch(err => {
            console.log("FETCH DATA ::: "+ err);
            return res.status(404).send("ERROR ::: server error");
        });
    }else{
        console.log("FETCH DATA ::: userName / uid not defined");
        return res.status(404).send("ERROR ::: userName / uid not defined");
    }
});

export const registerResturent = functions.https.onRequest((req, res) => {
    corsHandler(req,res, () => {
        console.log("cors added");  
    });
    if(req.body.userName){
        return ResturentFunctions.register(resturents, users, enterprises, req, res);
    }else{
        return null;
    }
})

export const loginResturent = functions.https.onRequest((req, res) => {
    corsHandler(req,res, () => {
        console.log("cors added");  
    });
    if(req.body.userName){
        return ResturentFunctions.loginWithUserName(resturents, req, res);
    }else{
        return null;
    }
})