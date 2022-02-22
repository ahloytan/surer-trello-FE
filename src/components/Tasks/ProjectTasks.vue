<template>
  <div class="task-container">
    <Toast ref="toast"></Toast>
    <Loader :isLoading="isLoading"></Loader>
    <div v-if="this.tasks_array.length == 0">
        <div class="header">
          <h2 class="is-size-6 has-text-weight-bold">{{ header }}</h2>
        </div>
        <div class="project-task-card" id="no_tasks">
          No tasks for this project! &#9757;
        </div>
    </div>

    <div v-else class="task-cards">
    <div class="header">
      <h2 class="is-size-6 has-text-weight-bold">{{ header }}</h2>
    </div>
        <div
        v-for="task in tasks_array"
        v-bind:key="task.task_id"
        v-bind:class="(task.completion_status).replaceAll(' ','')">
          <div class="project-task-card" v-on:click="showDetails(task.title,task.description,task.deadline, task.completion_status);">
            <p class="task-detail"><b>Task:  </b>{{task.title}} </p>
            <p class="task-detail"><b>Description:  </b>{{task.description}}</p>
            <p class="task-detail"><b>Due:  </b>{{task.deadline}}</p>
            <p>&nbsp;</p>
            <p id="completion_status">{{task.completion_status}}</p>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
  import Toast from '@/components/Toast.vue'
  import Loader from '@/components/Loader.vue'
  import UserProjectTasks from '@/api/services/UserProjectTasks'
  export default {
  name: 'ProjectTasks',
  components: {
    Toast,
    Loader
  },
  data() {
      return {
          tasks_array: [],
          isLoading: true,
          user_email: "",
          // isCardModalActive: false
      }
  },
  props: {
    header: String,
    project_id: String
  },
  methods: {
  showDetails: function(title,description,due_date,completion_status){
    this.$buefy.dialog.alert({
      title: `${title}`,
      message:`
      <p><b>Description</b>: ${description}<br>
               <b>Due By</b>: ${due_date}<br>
               <b>Status</b>: ${completion_status}</p>`,
      confirmText: "Cool!"
    });
},
    async getUserProjectTasks(user_email) {
        try{
            var task_details_array = await UserProjectTasks.getUserProjectTasks(user_email,this.$props.project_id)
            this.tasks_array = task_details_array
        } catch (error) {
            this.$refs.toast.result(null, error.response);
        }
      },
  },
  async mounted() {
      this.user_email = this.$cookies.get("user")['userEmail'];
      await this.getUserProjectTasks(this.user_email);
      this.isLoading = false;
  }
}

</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
  .modal-card-title{
    width:100%;
  }

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

  .project-task-card {
    margin: 10px 0;
    background: #fff;
    padding: 10px;
    text-align: left;
    margin-right: 8px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px $grey-lighter;
    position: relative;
    cursor: pointer;
    margin-bottom:10px
  }

  #completion_status{
    position: absolute;
    bottom: 8px;
    right: 16px;
    font-size: 13px;
    padding-top:5px;
    padding-bottom:5px;
    padding-left: 10px;
    padding-right:10px;
    border-radius:5px;
    color: black;
    font-weight:bold;
    // border-style:solid;
    border-color:black;
    // border-width: thin;
  }

  .started #completion_status{
    background:rgb(178, 240, 178);
  }

  .notstarted #completion_status{
    background:rgb(243, 201, 201);
  }

  .completed #completion_status{
    color:green;
    background:white;
    border-style: solid;
    border-width:thin;
    border-color: green;
  }

  .task-detail{
      margin:2px;
    }
  #no_tasks{
    // font-weight:bold;
    padding:25px;
    background:rgb(248,248,248);
    text-align:center;
  }
</style>
