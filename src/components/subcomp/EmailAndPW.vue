<template>
  <section>
    <b-field label="Email" :type="{'is-danger': emailErr}" :message="[{'Please enter an email': emailErr}]">
        <b-input
        v-model="email"
        name="email"
        type="email"
        maxlength="30"
        placeholder="Please Enter Your Email"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="clearEmail">
        >
        </b-input>
    </b-field>

    <b-field label="Password" :type="{'is-danger': pwErr}" :message="[{'Password must have at least 8 characters': pwErr }]">
        <b-input
        v-model="password"
        name="pw"
        type="password"
        maxlength="64"
        placeholder="Please Enter Your Password"
        password-reveal
        >
        </b-input>
    </b-field>
  </section>
</template>
<script>


	export default {
		name: 'emailAndPW',
    props: ['emailErr','pwErr'],
		components: {
		},
		data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      clearEmail() {
          this.email = '';
        },
      clearPassword(){
        this.password = '';
      }
    }
	}
</script>
