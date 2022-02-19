import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class User extends BaseApiService {
   async logIn(zeEmail, zePw) {
     try{
       var toSend = {
        email: zeEmail
       }

       if(Array.isArray(zePw)){
         toSend["first_name"] = zePw[0];
         toSend["last_name"] = zePw[1];
       } else {
         toSend["password"] = zePw
       }

      let det = await axiosClient.post("/user_login", toSend);

      return [true, det.data]
    } catch(error){
      // console.log(this.handleError(error));
      // let errMsg = error.response.data.error;
      // return [false, errMsg];
      this.handleError(error)
    }

  }

  async logOut() {
    try {
      await axiosClient.post("/user_logout");
    } catch(error){
      this.handleError(error)
    }
  }

  async register(zeEmail, zePw, fName, lName) {
    try{
      await axiosClient.post("/user_registration",{
        email: zeEmail,
        password: zePw,
        first_name: fName,
        last_name: lName
      })
    } catch (error){
      return this.handleError(error);
    }

  }
}

export default new User();
