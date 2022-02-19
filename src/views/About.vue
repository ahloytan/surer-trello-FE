<template>
  <div id="about">
    <div class="columns">
      <div class="column is-one-fifth">
      </div>
      <div class="column is-four-fifth">
        <h1>This is an about page</h1>
        <Calendar/>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar.vue';


export default {
  components: {
    Calendar
  },
}
</script>
