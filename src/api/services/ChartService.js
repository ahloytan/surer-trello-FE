import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class ChartService extends BaseApiService {
  async getDashboard(){
    try{
      let db = await axiosClient.get("/dashboard");
      //console.log(db.data);
      return db.data
    } catch (error){
      return this.handleError(error);
    }
  }
}

export default new ChartService();
