<template>
  <b-modal v-model="modalSub" :width="640">
    <div class="card">
			<div class="card-content has-text-left">
				<div class="create-project"
					v-if="teamModalType === 'cProj'">
					<h2 class="is-size-6 has-text-weight-bold">Create New Project</h2>
					<div class="task-description mt-3">
						<b-field
							v-bind:type="createProjectMsgType"
							v-bind:message="createProjectMsg">
							<b-input
								v-model="projectDescription"
								type="textarea"
								required
								placeholder="Enter Project Name"
								maxlength="25"
								rows="2"
								>
							</b-input>
						</b-field>
					</div>

					<div class="btns">
						<b-button
							type="is-link is-success"
							@click="projectDescription !== '' ? ($emit('close'), createProject(projectDescription),projectDescription='') : (createProjectMsg='Enter project name', createProjectMsgType='is-danger')">
							Create
						</b-button>
					</div>

				</div>

				<div class="create-project"
					v-else-if="teamModalType === 'jProj'">
					<h2 class="is-size-6 has-text-weight-bold">Join Project Team</h2>
					<div class="task-description mt-3">
						<b-field
							v-bind:type="joinTeamMsgType"
							v-bind:message="joinTeamMsg">
							<b-input
								v-model="projectId"
								type="number"
								required
								rows="1"
								placeholder="Enter Project ID">
							</b-input>
						</b-field>
					</div>

					<div class="btns">
						<b-button
							type="is-link is-success"
							@click="checkProjectId() ? (joinTeam(projectId),projectId='',$emit('close')) : (joinTeamMsg='Invalid Project ID', joinTeamMsgType='is-danger')">
							Join Team
						</b-button>
					</div>

				</div>

        <div class="create-project"
          v-else-if="teamModalType === 'cDesc'">
          <h2 class="is-size-6 has-text-weight-bold">Edit Project Details</h2>
          <div class="task-description mt-3">
            <b-field
              v-bind:type="joinTeamMsgType"
            >
              <b-input
                v-model="projNameChange"
                rows="1"
                placeholder="Enter new name">
              </b-input>
            </b-field>
            <b-field
            v-bind:type="joinTeamMsgType"
            v-bind:message="joinTeamMsg"
            >
              <b-input
                v-model="projDescChange"
                rows="1"
                placeholder="Enter new description">
              </b-input>
            </b-field>
          </div>

          <div class="btns">
            <b-button
              type="is-link is-success"
              @click="(projNameChange && projDescChange) ? (changeProjDetails(projNameChange, projDescChange), $emit('close')) : (joinTeamMsg='Please enter something in both fields', joinTeamMsgType='is-danger')">
              Change
            </b-button>
          </div>

        </div>

			</div>
		</div>
	</b-modal>
</template>

<script>
	export default {
		name: 'ProjectModal',
		props: {
			availableProjects: Array,
			isModalActive: Boolean,
			teamModalType: String,
			task: Object,
			members: Array,
		},
		data() {
			return {
				projectDescription: "",
				projectId: "",
        projNameChange: "",
        projDescChange: "",
				joinTeamMsg: "",
				joinTeamMsgType: "",
				createProjectMsg: "",
				createProjectMsgType: "",
				resetEmpty: "",
			}
		},
		computed: {
      //https://stackoverflow.com/questions/40574661/avoid-mutating-a-prop-directly-since-the-value-will-be-overwritten
      modalSub:{
        get: function(){
          return this.isModalActive
        },
        set: function(){
          this.$emit('close', "joinTeamMsg='';createProjectMsg='';createProjectMsgType='';joinTeamMsgType='';joinTeamMsg='';resetEmpty='' ")
        }
      }
		},
		methods: {
			createProject(description) {
				this.$parent.createProject(description)
				this.createProjectMsg = "",
				this.createProjectType = "",
				this.projectDescription = ""
			},
			joinTeam(projectId){
				this.$parent.joinTeam(projectId)
			},
			checkProjectId(){
				this.joinTeamMsg=''
				this.joinTeamMsgType=''

				let valid = this.availableProjects.includes(parseInt(this.projectId))
				if (!valid) {this.projectId = ''}
				return valid
			},
      changeProjDetails(name, desc){
        this.$parent.changeProjDetails(name, desc)
      },
		},
		mounted() {
		}
	}
</script>

<style lang="scss">
  @import '@/assets/scss/_variables.scss';

	.card {
		margin: 0 15px;
	}

	.avatar {
    width: 30px;
    height: 30px;
		padding: 6px;
		color: $white;
		cursor: pointer;
		font-weight: bold;
		margin-right: 3px;
		text-align: center;
		border-radius: 30px;
    display: inline-block;
    background: $dark-green;
		text-transform: uppercase;
	}

	.btns {
		margin-top: 10px;
		text-align: right;
	}

</style>
