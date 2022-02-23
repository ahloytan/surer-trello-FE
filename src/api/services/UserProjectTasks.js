import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class UserProjectTasks extends BaseApiService {
    async getUserProjectTasks(user_email,project_id) {
        try {
            let pid = project_id
            let userProjects = await axiosClient.get("/get_team_and_task",{params: {email: user_email}});
            let task_list = userProjects.data[pid]
            let task_details_array = []
            for (var i=0; i< task_list.length; i++){
                let taskid = task_list[i];
                let task_details = await axiosClient.get("/get_task",{params: {task_id: taskid.toString()}});
                let task_detail = task_details.data[taskid]
                task_detail["task_id"] = taskid
                task_details_array.push(task_detail);
            }
            return task_details_array
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default new UserProjectTasks();