import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class UserProjects extends BaseApiService {

    async getUserProjects(user_email) {
        try {
            var userProjects = await axiosClient.get("/get_user_project_names",{params: {email: user_email}});
            return userProjects.data

        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default new UserProjects();
