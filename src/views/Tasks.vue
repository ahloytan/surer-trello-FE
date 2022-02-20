<template>
    <div id="tasks" class="corrector container">
        <Toast ref="toast"></Toast>
        <Loader :isLoading="isLoading"></Loader>
        <div v-if="this.any_display==false">
            <h1 class="is-size-1 has-text-weight-semibold  has-text-centered">No Tasks or Meetings</h1>
            <!-- <h1 class="is-size-5 has-text-weight-medium is-italic has-text-centered mt-2">!</h1> -->
            <img alt="No Tasks or Meetings!"  src="../assets/images/team.png" />
        </div>

        <div v-else class="container" id="task-board">
            <div class="columns items">
            <div class="column item" v-if="this.meeting_display==true">
                    <userMeetings
                    />
            </div>
            <div class="column item"
            v-for="(project_name,project_id) in projects_dict"
            v-bind:key="project_id+'-'+project_name">
                    <projectTasks
                        :header="project_name"
                        :project_id="project_id"
                    />
            </div>

            </div>
        </div>

    </div>
</template>

<script>
import ProjectTasks from '@/components/Tasks/ProjectTasks.vue'
// import UserProjectTasks from '@/api/services/UserProjectTasks'
import UserMeetings from '@/components/UserMeetings.vue'
import UserProjects from '@/api/services/UserProjects'
import Toast from '@/components/Toast.vue'
import Loader from '@/components/Loader.vue'

export default {
  name: 'User-Projects',
  components: {
    ProjectTasks,
    UserMeetings,
    Toast,
    Loader
  },
    data() {
        return {
            projects_dict: {},
            isLoading: true,
            meeting_display: true,
            user_email: ""
        }
    },
    computed: {
        isMobile: () => {
            return screen.width < 769
        },
        any_display: function(){
            let proj_size = Object.keys(this.projects_dict).length;
            if ((this.meeting_display==false) && (proj_size==0)){
                return false
            }
            else{
                return true
            }
        }
    },
    methods: {
        async getUserProjects(user_email) {
            try{
                const projects_dict_result = await UserProjects.getUserProjects(user_email)
                for (const property in projects_dict_result){
                    this.projects_dict[property] = projects_dict_result[property]
                }
            } catch (error) {
                this.$refs.toast.result(null, error.response);
            }
        },

        async getMeetingDisplay(user_email) {
            try{
                const res = await UserProjects.getMeetingDisplay(user_email);
                this.meeting_display = res;
                }
                catch (error) {
                this.$refs.toast.result(null, error.response);
            }
        },
    },
    async mounted() {
        this.user_email = this.$cookies.get("user")['userEmail'];
        await this.getUserProjects(this.user_email);
        await this.getMeetingDisplay(this.user_email);
        this.isLoading = false;
    }
}

</script>



<style lang="scss">
@import '@/assets/scss/_variables.scss';
    .task-container{
        margin-top:20px;
    }

    #task-board {
        margin: 15px auto;
        overflow-x: auto;
        overflow-y: hidden;
        min-height: 75vh;
    }

    .corrector{
      padding: 0 15px;
      @include breakpoint(desktop){
        margin-left: 18%;
        margin-right: 5%;
      }
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
    .columns {
        align-items: right;
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

    .meeting-cards {
      max-height: 55vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .task-cards {
      max-height: 55vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
</style>
