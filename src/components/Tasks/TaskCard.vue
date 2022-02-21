<template>
	<div class="task-card">
		<div class="task-inner" @click="openModal">
			<div id="title">
				<p>{{ task.title }}</p>
			</div>

			<div class="avatar mt-2 is-size-7"
				v-for="person in task.assignees"
				v-bind:key="'avatar-'+person.fname">
				{{person.fname[0]}}{{person.lname[0]}}
			</div>

			<div class="info columns is-desktop" v-if="task.deadline || task.date">
				<div class="column">
					<p class="has-text-weight-bold" v-if="task.deadline">
						<i class="far fa-clock"></i>
						{{ formatDate(task.deadline)}}
					</p>
					<p class="has-text-weight-bold" v-else>
						<i class="far fa-clock"></i>
						{{ formatDate(task.date)}}
					</p>
				</div>

				<div v-if="!draggable" class="column status has-text-left-mobile">
					<b-tag v-if="task.completion_status === 'started'" type="is-warning"><p class="is-uppercase">In progress</p></b-tag>
					<b-tag v-else-if="task.completion_status === 'completed'" type="is-success"><p class="is-uppercase">Done</p></b-tag>
					<b-tag v-else-if="task.completion_status === 'not started'" type="is-danger"><p class="is-uppercase">To do</p></b-tag>
				</div>
			</div>
		</div>

    <TaskModal
		v-bind:isModalActive="isModalActive"
		v-bind:isNewTask="false"
		:task="task"
		:cardType="cardType"
		:members="members"
		@close="isModalActive = false"
    />

	</div>
</template>
<script>
	import TaskModal from '@/components/Tasks/TaskModal.vue'
	import moment from 'moment'
	//TODO: Call parent (TaskColumn) edit task function
	export default {
		name: 'TaskCard',
		components: {
			TaskModal
		},
		props: {
			task: Object,
			draggable: Boolean,
			cardType: String,
			members: Array,
		},
		data() {
			return {
				isModalActive: false
			}
		},
		methods: {
			editTask(updatedTask) {
				//TODO: call api to update task
				this.$emit('updateTask', updatedTask)
			},
			formatDate: (date) => {
				return moment(date).format("Do MMM YY")
			},
			openModal() {
				if (this.cardType !== "meeting") {
					this.isModalActive = true
				} else {
					// link to meeting page
				}
			},
			removeTask() {
				this.$emit('removeTask')
			}
		}
	}
</script>
<style lang="scss">
  @import '@/assets/scss/_variables.scss';
	.task-card {
		margin: 10px 0;
		background: #fff;
		padding: 10px;
		text-align: left;
		margin-right: 8px;
		border-radius: 5px;
		box-shadow: 2px 2px 2px $grey-lighter;
	}

	.task-inner {
		cursor: pointer;
	}

	.info {
		font-size: $size-small;
		margin-top: 5px;
	}

	.status {
		text-align: right;
		font-weight: bold;
	}
</style>
