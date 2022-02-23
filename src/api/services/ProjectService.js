import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class ProjectService extends BaseApiService {

    async getAllProjects() {
        try {
            let project = await axiosClient.get("/get_all_project_ids");
            return project.data

        } catch (error) {
            return this.handleError(error);
        }
    }

    async getProject(projectId) {
        try {
            let project = await axiosClient.get("/project",{params: {project_id: projectId}});
            return project.data

        } catch (error) {
            return this.handleError(error);
        }
    }

    async addProject(email, description) {
        try {
            let project = await axiosClient.post("/create_project",{
                creator: email,
                description: description,
            });

            return project.data
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getProjectByUser(email) {
        try {
            let projects = await axiosClient.get("/get_project",{params: {email: email}});
            return projects.data

        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default new ProjectService();