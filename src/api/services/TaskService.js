import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class TaskService extends BaseApiService {

    async getProjectTasks(projectId) {
        try {
            let project = await axiosClient.get("/get_task_by_projectid",{params: {project_id: projectId}});
            return project.data

        } catch (error) {
            return this.handleError(error);
        }
    }

    async addTask(projectId, task) {
        try {
            let project = await axiosClient.post("/create_task", {
                project_id: projectId,
                ...task
            });

            return project.data

        } catch (error) {
            return this.handleError(error);
        }
    }

    async updateTask(projectId, task) {
        try {
            await axiosClient.patch("/update_task", {
                project_id: projectId,
                ...task
            });

            return "success"
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteTask(taskId) {
        try {
            await axiosClient.delete(`/delete_task?task_id=${taskId}`);

            return "success"
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateTaskPosition(updateBody) {
        try {
            await axiosClient.patch(`/update_task_position`, updateBody)
        } catch (error) {
            this.handleError(error)
        }
    }

}

export default new TaskService();