export default class FetchData{
    static fetchData = async (data, users) => {
        const userData = await users.doc(data.userName).get();
        if(userData.exists){
            return userData;
        }else{
            return null;
        }
    }
}