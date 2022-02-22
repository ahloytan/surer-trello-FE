<template>
  <div class="task-container">
    <div class="header">
      <h2 class="is-size-6 has-text-weight-bold">{{ header }}</h2>
    </div>

    <div class="tasks">
      <draggable
        v-if="draggable"
        :list="tasks" group="tasks"
        :options="{delayOnTouchOnly:true, delay: 400, animation: 250}"
        @change="updateStatus($event, cardType)">
        <TaskCard v-for="(task, index) in tasks"
          :key="task.task_id"
          :task="task"
          :members="members"
          :cardType="cardType"
          v-bind:isModalActive="isModalActive"
          v-bind:draggable="true"
          @updateTask="updateTask"
          @removeTask="removeTask(index, task.task_id)"
        />
      </draggable>

      <TaskCard
        v-else
        v-for="task in tasks"
        :key="task.task_id"
        :task="task"
        :cardType="cardType"
        v-bind:isModalActive="isModalActive"
        v-bind:draggable="false"
      />

    </div>

    <div v-if="draggable" class="add" id="add-task">
      <p @click="isModalActive = true; isNewTask = true"><i class="fas fa-plus-circle"></i>  Add a task</p>
    </div>

    <div v-else class="add" id="add-meeting">
      <p @click="isMeetingActive = true;"><i class="fas fa-plus-circle"></i>  Add a meeting</p>
    </div>


    <TaskModal
      v-bind:isModalActive="isModalActive"
      v-bind:isNewTask="true"
      :cardType="cardType"
			:members="members"
      @close="isModalActive = false"
    />

  </div>
</template>

<script>
// @ is an alias to /src
import TaskCard from '@/components/Tasks/TaskCard.vue'
import TaskModal from '@/components/Tasks/TaskModal.vue'
import draggable from "vuedraggable";

export default {
  name: 'TaskColumn',
  components: {
    TaskCard,
    TaskModal,
    draggable
  },
  props: {
    header: String,
    tasks: Array,
    draggable: Boolean,
    cardType: String,
    members: Array,
    projectid: String
  },
  data() {
    return {
        isModalActive: false,
        isMeetingActive: false
    }
  },
  methods: {
    addTask(status, task) {
      this.$emit("addTask", status, task)
    },
    updateStatus(event, status) {
      console.log(event, status)
      if (event.added) {
        this.$emit("moveTask", event.added.newIndex, status)
      } else if (event.moved) {
        this.$emit("moveTask", event.moved.newIndex, status)
      }
    },
    updateTask(task) {
      this.$emit("updateTask", task)
    },
    removeTask(position, taskId) {
      this.$emit("removeTask", taskId, position, this.cardType)
    }
  }

}
</script>

<style lang="scss">
  @import '@/assets/scss/_variables.scss';

  .header {
    margin: 5px;
  }

  .task-container {
    background-color: $grey-light;
    border-radius:5px;
    padding: 10px;
    max-width: 380px;
    margin: auto;
  }

  .add {
    color: $grey;
    margin-top: 10px;
    cursor: pointer;
  }

  .tasks {
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>
