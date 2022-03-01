<template>
  <b-modal v-model="modalSub" :width="640">
		<div class="card">
			<div class="card-content">
				<div class="task-info">

					<div class="task-header columns is-mobile">
						<div class="task-title column is-8 is-size-5 has-text-weight-bold">
							<h1 v-if="!editingTask" class="is-inline-block mr-2">
								{{this.cardTask.title }}
							</h1>
							<h1 v-else class="is-inline-block mr-3">
								<b-field>
									<b-input v-model="cardTask.title" placeholder="Add title for this task" required></b-input>
								</b-field>
							</h1>

							<div v-if="!editingTask || !isMobile" id="status">
								<b-tag v-if="this.cardType === 'started'" type="is-warning"><p class="is-uppercase">In progress</p></b-tag>
								<b-tag v-else-if="this.cardType === 'completed'" type="is-success"><p class="is-uppercase">Done</p></b-tag>
								<b-tag v-else-if="this.cardType === 'not started'" type="is-danger"><p class="is-uppercase">To do</p></b-tag>
							</div>
						</div>

						<div class="column has-text-right" v-if="cardTask">
							<b-button
								v-if="editingTask && cardTask.title && cardTask.title.length > 0"
								type="is-link is-success is-light"
								@click="$emit('close'); saveTask();"
							>
								<i class="far fa-save"></i> Save
							</b-button>
							<b-button v-else-if="!editingTask" type="is-link is-light" @click="editingTask = true">
								<i class="far fa-edit"></i> Edit
							</b-button>
						</div>
					</div>

					<div class="due">
						<div class="due-date" v-if="cardTask.deadline || editingTask">
							<span class="has-text-weight-bold"> Due: </span>
							<span v-if="cardTask.deadline && !editingTask">{{formatDate(this.cardTask.deadline)}}</span>
						</div>

						<div id="date-picker" v-if="editingTask">
							<b-datepicker
								v-model="cardTask.deadline"
								:placeholder="formatDate(cardTask.deadline)"
								icon="calendar-plus"
								:min-date="new Date(new Date().setDate(new Date().getDate() -1))"
								:focused-date="new Date()"
								:date-formatter="(date) => date.toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })"
								>
							</b-datepicker>
						</div>
					</div>

					<div class="assignees mt-3">
						<h2
							v-if="cardTask.assignees && cardTask.assignees.length > 0 || editingTask"
							class="is-size-6 has-text-weight-bold"
						>
							Assignees
						</h2>
						<div class="list-assignees mt-1">
							<div class="avatar is-size-7"
								v-for="person in cardTask.assignees"
								v-bind:key="'avatar-'+person.fname"
								v-bind:title="'' + person.fname + ' ' + person.lname">
								{{person.fname[0]}}{{person.lname[0]}}
							</div>

							<div id="dropdown-assignees" class="is-clickable">
								<b-dropdown
									multiple
									ref="dropdown"
									aria-role="list">
									<i v-if="editingTask" slot="trigger" class="fas fa-plus-circle mt-2"></i>

									<b-dropdown-item
										v-for="(member, index) in members"
										:key="'optionlist'+index"
                    class="liWhite"
										aria-role="listitem">
										<b-checkbox
											v-model="cardTask.assignees"
											:native-value="member"
										>
											{{ member.fname + " " + member.lname}}
										</b-checkbox>
									</b-dropdown-item>
								</b-dropdown>

							</div>
						</div>
					</div>

					<div class="task-description mt-3">
						<h2 class="is-size-6 has-text-weight-bold">Description</h2>
						<p class="placeholder" v-if="(!cardTask.description || cardTask.description === '') && !editingTask">
							Edit to add description
						</p>
						<p v-if="!editingTask">{{ this.cardTask.description }}</p>

						<b-field v-else>
							<b-input
								v-model="cardTask.description"
								type="textarea"
								rows="8"
								:value="cardTask.description"
								placeholder="Add description for this task">
							</b-input>
						</b-field>
					</div>

					<div id="delete-btn">
						<b-button
							v-if="!isNewTask && !editingTask"
							type="is-link is-danger"
							@click="$emit('close'); deleteTask();"
						>
							Delete
						</b-button>
					</div>

				</div>
			</div>
		</div>
	</b-modal>
</template>

<script>
	import moment from 'moment'
	export default {
		name: 'TaskModal',
		props: {
			isModalActive: Boolean,
			isNewTask: Boolean,
			cardType: String,
			task: Object,
			members: Array,
		},
		data() {
			return {
				editingTask: this.isNewTask || '',
				cardTask: this.task ? this.task : {
					"title": "",
					"description": "",
					"assignees": [],
					"position": 0,
					"deadline": null
				},
				assigneeOptions:  this.members,
			}
		},
		computed: {
			isMobile: () => {
				return screen.width <= 769
			},

      //https://stackoverflow.com/questions/40574661/avoid-mutating-a-prop-directly-since-the-value-will-be-overwritten
      modalSub:{
        get: function(){
          return this.isModalActive
        },
        set: function(){
          this.$emit('close')
        }
      }
		},
		methods: {
			formatDate(date) {
				if (date) {
					return moment(date).format("Do MMM YY")
				}
				return "Select a due date"
			},
			saveTask() {
				if (this.isNewTask) {
					// Call parent (TaskColumn) to add task to array
					const newTask = {
						...this.cardTask,
						completion_status: this.cardType
					}
					this.$parent.addTask(this.cardType, newTask)
					this.cardTask = {
						"title": "",
						"description": "",
						"assignees": [],
						"position": 0,
						"deadline": null
					};
				} else {
					// Call parent (TaskCard) to edit task in array
					const updatedTask = {...this.cardTask}
					this.$parent.editTask(updatedTask)
					this.editingTask = false
				}
			},
			deleteTask() {
				this.$parent.removeTask()
			}
		},
		mounted() {
			if (this.cardTask.deadline) {
				this.cardTask.deadline = new Date(this.cardTask.deadline)
			}
		}
	}
</script>

<style lang="scss">
  @import '@/assets/scss/_variables.scss';

	.card {
		margin: 0 10px;
		.card-content {
			text-align: left;
		}
	}

	.avatar {
		background: $dark-green;
		color: #fff;
		padding: 6px;
		display: inline-block;
		margin-right: 3px;
		width: 30px;
		height: 30px;
		border-radius: 30px;
		text-align: center;
		font-weight: bold;
		text-transform: uppercase;
		cursor: pointer;
	}

	.due {
		display: flex;
		align-items: center;
	}

	.placeholder {
		color: $grey
	}

	#date-picker {
		margin-left: 10px;
	}

	#delete-btn {
		margin-top: 10px;
		text-align: right;
	}

	#dropdown-assignees {
		display: inline-block;
	}

	#status {
		@include breakpoint(tablet) {
			display: inline-block;
		}
	}

  a.liWhite {
		background: white !important;
		color: #333 !important;
	}
</style>
