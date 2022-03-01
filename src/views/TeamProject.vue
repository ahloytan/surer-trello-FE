<template>
	<div id="theTeamProject" class="corrector container">
		<Toast ref="toast"></Toast>
		<Loader :isLoading="isLoading"></Loader>
		<div class="headerInfo">
			<div class="team-header ml-3">
				<h2 class="is-inline-block team-name is-size-5">
					{{ project.description }} (ID: {{project.project_id}}
					)
				</h2>
				<div id="tooltip">
					<b-tooltip label="Send ID to members to join team">
						<i class="fas fa-info-circle"></i>
					</b-tooltip>
				</div>

				<div class="team-members">
					<div class="avatar avatar-small is-size-7"
						v-for="person in project.members"
						v-bind:key="'avatar-'+person.fname" v-bind:title="'' + person.fname + ' ' + person.lname">
						{{person.fname[0]}}{{person.lname[0]}}
					</div>
				</div>

				<div class="is-pulled-right">
					<b-button type="is-link is-light"  @click="isModalActive = true; teamModalType='cDesc'">
						<i class="far fa-edit"></i> Edit
					</b-button>
				</div>
			</div>
		</div>

		<ProjectModal
			v-bind:isModalActive="isModalActive"
			v-bind:teamModalType="teamModalType"
			@close ="isModalActive=false"
		></ProjectModal>

		<div class="container" id="task-board">
			<div class="columns items">
				<div class="column item">
					<TaskColumn
						header="To do"
						:tasks="todo"
						:reachLimit = "this.todo.length < this.max"
						:members="project.members"
						cardType="not started"
						v-bind:draggable="true"
						@addTask="addTask"
						@moveTask="updateMove"
						@updateTask="updateTask"
						@removeTask="removeTask"
					/>
				</div>
				<div class="column item">
					<TaskColumn
						header="In progress"
						:tasks="inprogress"
						:reachLimit = "this.inprogress.length < this.max"
						:members="project.members"
						cardType="started"
						v-bind:draggable="true"
						@addTask="addTask"
						@moveTask="updateMove"
						@updateTask="updateTask"
						@removeTask="removeTask"
					/>
				</div>

				<div class="column item">
					<TaskColumn
						header="Done"
						:tasks="done"
						:reachLimit = "this.done.length < this.max"
						:members="project.members"
						cardType="completed"
						v-bind:draggable="true"
						@addTask="addTask"
						@moveTask="updateMove"
						@updateTask="updateTask"
						@removeTask="removeTask"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import TaskColumn from '@/components/Tasks/TaskColumn.vue'
import ProjectModal from '@/components/Projects/ProjectModal.vue'
import ProjectService from '@/api/services/ProjectService'
import TaskService from '@/api/services/TaskService'
import Toast from '@/components/Toast.vue'
import Loader from '@/components/Loader.vue'

export default {
  name: 'TeamProject',
  components: {
  TaskColumn,
	Toast,
	Loader,
	ProjectModal,
  },
	data() {
		return {
			isModalActive: false,
			teamModalType: "",
			isLoading: true,
			projectId: this.$route.params.slug,
			project: {
				project_id: "",
				description: "",
				members: [],
			},
			todo: [],
			inprogress: [],
			done: [],
			state: "",
			max: 2
		}
	},
	methods: {
		async addTask(completion_status, task) {
			let position;
			if (completion_status === "not started") {
				position = this.todo.length
				task["position"] = position
				this.todo.push(task)
				const addedTask = await this.createTask(task)
				this.todo[position]["task_id"] = addedTask.task_id

			} else if (completion_status === "started") {
				position = this.inprogress.length
				task["position"] = position
				this.inprogress.push(task)
				const addedTask = await this.createTask(task)
				this.inprogress[position]["task_id"] = addedTask.task_id

			} else if (completion_status === "completed") {
				position = this.done.length
				task["position"] = position
				this.done.push(task)
				const addedTask = await this.createTask(task)
				this.done[position]["task_id"] = addedTask.task_id

			} else {
				this.$refs.toast.result(null, {data: {error: "invalid completion_status"}});
			}

		},
		async updateMove(newPosition, status) {
				let currentTaskId;

				if (status === "started") {
					currentTaskId = this.inprogress[newPosition].task_id;

				} else if (status === "completed") {
					currentTaskId = this.done[newPosition].task_id;

				} else if (status === "not started") {
					currentTaskId = this.todo[newPosition].task_id;

				} else {
					this.$refs.toast.result(null, {data: {error: "invalid completion_status"}});
					return
				}
				try {
					const updateBody = {
						'project_id': this.projectId,
						'task_id': currentTaskId,
						'new_position': newPosition,
						'new_status': status,
					}
					await TaskService.updateTaskPosition(updateBody)
				} catch (error) {
					this.$refs.toast.result(null, error.response);
				}



		},
		async getProject(projectId) {
			try {
				const project = await ProjectService.getProject(projectId)
				this.project = project
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
		async getProjectTasks(projectId) {
			try {
				const tasks = await TaskService.getProjectTasks(projectId)
				this.todo = tasks.tasks.todo
				this.inprogress = tasks.tasks.inprogress
				this.done = tasks.tasks.completed
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
		async createTask(task) {
			try {
				return await TaskService.addTask(this.projectId, task)
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
		async updateTask(task) {
			try {
				await TaskService.updateTask(this.projectId, task)
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
		async removeTask(taskId, position, status) {
			try {
				TaskService.deleteTask(taskId)
				if (status === "started") {
					this.$delete(this.inprogress, position)

				} else if (status === "completed") {
					this.$delete(this.done, position)

				} else if (status === "not started") {
					this.$delete(this.todo, position)

				} else {
					console.log("unknown completion_status")
				}
			} catch (error) {
				this.$refs.toast.result(null, error.response);
			}
		},
	},
	mounted() {

		this.state = Math.random().toString(36).slice(2);
		Promise.all([this.getProject(this.projectId), this.getProjectTasks(this.projectId)]).then(() => {
			this.isLoading = false;
		});
	}
}
</script>

<style lang="scss">
  @import '@/assets/scss/_variables.scss';

	.team-header {
		text-align: left;

		.team-name {
			font-weight: bold;
			text-transform: uppercase;
		}

		.team-members {
			margin-top: 10px;
			@include breakpoint(tablet) {
				display: inline-block;
				margin-left: 10px;
				margin-top: 0;
			}
		}
	}

	#task-board {
		margin: 15px auto;
		overflow-x: auto;
		overflow-y: hidden;
		min-height: 75vh;
	}

	.items {
		margin: auto;

		.item {
			align-items: center;
			// margin: 5px;
			min-width: 350px;
			width: 100%;
		}
	}

	.container::-webkit-scrollbar{
		height:0px;
		width:0px;
		background: $grey-lighter;
		margin: 0px 5px;
		border-radius: 10px;

		@include breakpoint(tablet){
			height: 10px;
			width: 10px;
		}
	}

	.container::-webkit-scrollbar-thumb:horizontal{
		background: $grey;
		border-radius: 10px;
	}

	#tooltip {
		position: relative;
		display: inline-block;
		top: -10px;
	}

	.corrector{
		margin-top:50px;
		@include breakpoint(desktop){
			margin-left: 18%;
			margin-right: 5%;
		}
	}

	.headerInfo {
		position:relative;
		margin-top: 10px;
		@include breakpoint(tablet){
			margin-top: 15px;
		}
	}

	.tooltip-content {
		z-index: 999;
	}

</style>
