<!-- https://buefy.org/documentation/toast -->
<template>
  <section>

  </section>
</template>

<script>
    export default {
        data() {
            return {
                indefinteToast: null
            }
        },
        methods: {
            result(status, msg) {
                this.$buefy.toast.open({
                    message: msg && msg.data.error ? msg.data.error : "Error connecting to server",
                    type: status ? "is-success" : "is-danger"
                })
            },
        }
    }
</script>
