import { axiosClient } from "../axiosClient";
import BaseApiService from "../BaseApiService";

class TeamService extends BaseApiService {

    async joinTeam(email, teamId) {
        try {
            let team = await axiosClient.post("/join_team",{
                email: email,
                team_id: teamId
            });
            return team.data

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

    async getTeams(email) {
        try {
            let team = await axiosClient.get("/get_user_teams",{params: {email: email}});
            return team.data

        } catch (error) {
            return this.handleError(error);
        }
    }

    async changeProjDetails(projectId, name, desc){
      try{
        let team = await axiosClient.get("/change_proj_details",{params: {
          project_id: projectId,
          description: name,
          details: desc
        }});

        return team.data
      } catch (error) {
          return this.handleError(error);
      }
    }
}

export default new TeamService();
