<template>
  <div :class="['message ' + color]">
    <div class="message-header">
      <p class="m-auto" v-html="header"></p>
    </div>
    <div :id="id" class="message-body">{{output}}</div>
  </div>
</template>

<script>
    export default {
        props: ["header","msg","color","id"],
        data() {
            return {
              default: 0,
              output:0
            }
        },
        watch:{
          'msg': function(){
            this.counter();
          }
        },
        mounted(){
          this.counter();
        },
        methods:{
          //https://codepen.io/Amaik/pen/ExaaLgE
          //Number counter animation 
            counter() {
              let start = this.default;
              let end = this.msg;
              this.default = this.msg;

              if (this.msg){
                let current = start,
                range = end - start,
                increment = end > start ? 1 : -1,
                step = Math.abs(Math.floor(1500 / range)),
                timer = setInterval(() => {
                 current += increment;
                 this.output = current;
                 if (current == end) {
                  clearInterval(timer);
                 }
                }, step);
              } else {
                this.output = 0;
              } //end of if-else

           }
        }
    }
</script>
