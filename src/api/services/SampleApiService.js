import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class SampleService extends BaseApiService {

    async getHotelsByLocation(location) {
        try {
            console.log("testing api", location);
            // throw Error(`testing error ${location}`);
            // return await axiosClient.get(`/hotels/${location}`);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getHotelReviews() {
        return await axiosClient.get();
    }
}

export default new SampleService();