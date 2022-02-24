<template>
  <div class="project-container container-fluid" @redirect="this.$emit('click')">
    <div class="header m-3">
      <div class="columns">
        <div class="column">
          <div class="right">
            <h2 class="is-size-6 has-text-weight-bold">Project: {{ description }} </h2>
          </div>
        </div>
        <div class="column">
          <div class="right">
            <h2 class="is-size-6 has-text-weight-bold">Last Modified At: {{ last_modified }}</h2>
          </div>
        </div>
        <div class="column">
          <div class="avatar rounded-circle is-size-7"
            v-for="person in members"
            v-bind:key="'avatar-'+ person.fname"
            v-bind:title="person.fname + ' ' + person.lname + ' '"
            >
            {{person.fname[0]}}{{person.lname[0]}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ProjectRow',
  props: {
    description: String,
    last_modified: String,
    members: Array,
  },
  data() {
    return {

    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import '@/assets/scss/_variables.scss';

  .project-container {
    height: 170px;
    margin: auto;
    padding: 10px;
    max-width: max;
    cursor: pointer;
    border-radius:5px;
    background-color: $grey-light;

    @include breakpoint(tablet2){
      height: 75px;
		}
  }

  .right {
    text-align: center;

    @include breakpoint(tablet2){
      text-align: start;
		}
  }
  

</style>
