<template>
	<div class="corrector container">
		<Toast ref="toast"></Toast>
		<Loader :isLoading="isLoading"></Loader>
		<div class="headerInfo">
			<div id="spaces" v-if="projects.length===0">
				<br>
			</div>
			<div id="buttons">
				<div id="new" v-bind:align="projects.length===0 ? 'center' : '' ">
				<div class="button mr-3" @click="isModalActive = true; isNewProject = true">
					Create New Project
				</div>
				<div class="button" @click="isModalActive = true; isNewProject = false">
					Join Project Team
				</div>
				</div>
			</div>
			<p>
			<div id="msg" v-if="projects.length===0">
				<h1 class="is-size-1 has-text-weight-semibold  has-text-centered">No projects assigned</h1>
				<h1 class="is-size-5 has-text-weight-medium is-italic has-text-centered mt-2">Create or join a project!</h1>
				<img alt="Add Project!"  src="../assets/images/team.png" />
			</div>
			
			<div class="container mt-3" id="team-list" style="margin-top: 15px"
				v-for="(project, index) in projects" 
				v-bind:key="index+'-'+project.description" 
				@click="redirect(project.project_id)"
			>				
				<div class="columns items">
					<div class="column item">
						<ProjectRow
							:description="project.description"
							:last_modified="project.last_modified"
							:members="project.members"

						/>
					</div>
				</div>
			</div>
		</div>
		<ProjectModal
			v-bind:isModalActive="isModalActive"
			v-bind:availableProjects="availableProjects"
			v-bind:isNewProject="isNewProject"
			@close ="isModalActive=false"
		></ProjectModal>
	</div>
</template>

<script>
// @ is an alias to /src
import ProjectRow from '@/components/Projects/ProjectRow.vue'
import ProjectModal from '@/components/Projects/ProjectModal.vue'
import ProjectService from '@/api/services/ProjectService'
import TeamService from '@/api/services/TeamService'
// import TaskService from '@/api/services/TaskService'
import Toast from '@/components/Toast.vue'
import Loader from '@/components/Loader.vue'

export default {
	name: 'Projects',
	components: {
		ProjectRow,
		ProjectModal,
		Toast,
		Loader
	},
	props: {
	},
	data() {
		return {
			email: "",
			isNewProject: false,
			isModalActive: false,
			isLoading: true,
			joinedTeam: false,
			noProjects: false,
			buttonsAlign: "",
			projects: [],
			projectIds: [],
			availableProjects: [],
		}
	},
	computed: {
	},
	methods: {
        async getTeams(email) {
			try {
				const teams = await TeamService.getTeams(email)
                for (let i in teams) {
                    this.projects.push(teams[i])
					this.projectIds.push(teams[i]['project_id'])
                }
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
        async joinTeam(teamId) {
			try {
                const joinTeam = await TeamService.joinTeam(this.email, teamId)
                this.projects.push(joinTeam)
				this.availableProjects.splice(this.availableProjects.indexOf(parseInt(teamId)), 1)
				this.joinedTeam = true
			} catch (error) { 
				this.$refs.toast.result(null, error.response);
			}
			return this.joinedTeam
		},
		async getAllProjectTeams() {
			try {
				let project = await ProjectService.getAllProjects()
				for (let id in project){
					if (!this.projectIds.includes(parseInt(id))){
						this.availableProjects.push(parseInt(id))
					}
				}
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
		async createProject(description) {
			try {
				const project = await ProjectService.addProject(this.email, description)
				this.projects.push(project)
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
		redirect(projectId) {
			this.$router.push(`/project/${projectId}`)
		}
	},
	async mounted() {
		this.email = this.$cookies.get("user")['userEmail'];
        await this.getTeams(this.email);
		await this.getAllProjectTeams();
		if (this.projects.length == 0){
			this.noProjects = true
			this.buttonsAlign = "center"
		}
		console.log('Teams I can join: ',this.availableProjects);

		this.isLoading = false;
	}
}
</script>

<style lang="scss">
  @import '@/assets/scss/_variables.scss';

	.corrector{
		padding: 0 15px;
		@include breakpoint(desktop){
			margin-left: 18%;
			margin-right: 5%;
		}
	}

	.headerInfo {
		position:relative;
		margin-top: 10px;
		@include breakpoint(tablet2){
			margin-top: 15px;
		}
	}

	#buttons {
		text-align: center;
		@include breakpoint(tablet2){
			text-align: right;
		}
	}

	.button {
		font-size: 12px;
		@include breakpoint(mobilesmall){
			font-size: 16px;
		}
	}
</style>
