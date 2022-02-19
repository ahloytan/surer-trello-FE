<template>
  <div id="dashboard">
    <div class="columns is-desktop">
      <div class="column is-one-fifth">
      </div>
      <div class="column is-four-fifths-desktop">
        <div id="selectHolder">
          <div class="select is-link mt-3">
            <select id="ddMenu" @change="toProj()">
              <option value="" disabled selected>Filter By Project</option>
              <option value="total">All</option>
            </select>
          </div>
        </div>
        <div class="my-3 columns is-tablet">
          <div class="column is-half-tablet">
            <b-tag type="is-link is-light mb-2">Tasks Overview</b-tag>
            <div class="is-flex is-justify-content-center">
              <Card v-if="loaded" header="Completed" :msg="complete" color="is-success"></Card>
              <Card v-if="loaded" header="Overdue" :msg="overdue" color="is-danger"></Card>
            </div>
            <div class="is-flex is-justify-content-center">
              <Card v-if="loaded" header="Incomplete" :msg="incomplete" color="is-warning"></Card>
              <Card v-if="loaded" header="Total" :msg="total" color="is-link"></Card>
            </div>
          </div>
          <div id="donutHolder" class="column is-half-tablet">
            <b-tag type="is-link is-light mb-2">Tasks assigned to you </b-tag>
            <canvas id="donutChart"></canvas>
          </div>
        </div>
        <div class="my-6 columns is-tablet">
          <div id="barHolder" class="column is-half-tablet">
            <b-tag type="is-link is-light mb-2">By project</b-tag>
            <canvas id="barChart"></canvas>
          </div>
          <div id="lineHolder" class="column is-half-tablet">
            <b-tag type="is-link is-light mb-2">Due this week</b-tag>
            <canvas id="lineChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import ChartService from '@/api/services/ChartService'
import Card from '@/components/Card.vue'

export default {
  name: 'App',
  components: {
    Card
  },
  data(){
    //https://stackoverflow.com/questions/49614837/how-to-reference-data-variable-from-another-data-variable-in-vue-2
    let options1 = {
        scales: {
            yAxes: [{
              //https://stackoverflow.com/questions/37922518/how-to-set-start-value-as-0-in-chartjs
                ticks: {beginAtZero: true,stepSize: 1}
            }]
        }
    }
    return {
      theJson : null,
      complete: 0,
      overdue: 0,
      incomplete: 0,
      total: 0,
      loaded: false,
      ratio: 1.75,
      donut: {
            type: 'doughnut',
            data: {
              datasets: [{hoverOffset: 1,borderWidth: 2}],
            }
          }, //end of donut
      bar: {
        type: 'bar',
          data: {
            datasets: [{
              label: 'Upcoming Tasks',
              backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 205, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)','rgba(153, 102, 255, 0.2)','rgba(201, 203, 207, 0.2)','rgba(255,146,80,0.2)', 'rgba(47, 161, 68, 0.2)','rgba(158, 202, 229, 0.2)'],
              borderColor: ['#ff6385','#ffa040','#ffcc56','#4bc0c0','#36a3eb','#9966ff','#c9cbcf','#ED56D5','#C0DB26','#43E2AA'],
              borderWidth: 1
            }]
          },
          options: options1
        }, //end of bar
      line: {
        type: 'line',
        data: {
          datasets: [{
            label: 'No. of Tasks',
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            steppedLine: true,
          }]
        },
        options: options1
      }
    }
  },
  async mounted(){
    //response
    let baseJson = await ChartService.getDashboard();
    let ddMenu = document.getElementById('ddMenu');
    this.theJson = baseJson;

    for (let i in baseJson){
      if (i !== "total"){
        ddMenu.innerHTML += '<option value='+ i +'>' + baseJson[i].description + '</option>'
      } //end of if
    }

    this.myEventHandler();
    window.onresize = this.myEventHandler;

    this.filter("total");
    this.loaded = true;

  },
  methods:{
    myEventHandler() {
      window.innerWidth - 7 > 382 ? this.ratio = 1.75 : this.ratio = 1.5;
    },

    toProj(){
      let ddMenu = document.getElementById('ddMenu');

      //https://stackoverflow.com/questions/24785713/chart-js-load-totally-new-data
      //remove and clear chart whenever filter applied
      document.getElementById('barChart').remove();
      document.getElementById('donutChart').remove();
      document.getElementById('lineChart').remove();

      document.getElementById('barHolder').innerHTML += '<canvas id="barChart"></canvas>';
      document.getElementById('donutHolder').innerHTML += '<canvas id="donutChart"></canvas>';
      document.getElementById('lineHolder').innerHTML += '<canvas id="lineChart"></canvas>';

      this.filter(ddMenu.value);
    },

    //Change charts accoding to filter
    filter(type){
      let fJson = this.theJson
      var that = this;

      //cards info
      this.complete = fJson[type]["no_completed_tasks"];
      this.incomplete = fJson[type]["no_incomplete_tasks"];
      this.overdue = fJson[type]["no_overdue_tasks"];
      this.total = fJson[type]["total_tasks"];

      // console.log(this.complete, this.incomplete, this.overdue, this.total);


      //donut chart
      let donutChartData = [];
      let donutBase = fJson[type]["tasks_completion_status"];
      for (let d in donutBase){
        donutChartData.push(donutBase[d]);
      }

      // https://stackoverflow.com/questions/20966817/how-to-add-text-inside-the-doughnut-chart-using-chart-js
      this.donut.plugins = [{
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;

          ctx.restore();
          var fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";

          var text = (that.complete / that.total * 100).toFixed(0);
          text = that.total == 0 ? 0 + '%': text + '%';
          var textX = Math.round((width - ctx.measureText(text).width) / 2);
          var textY = height / that.ratio;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }];


      //Conditional formatting to display pie chart as a greyed out version if user has no tasks
      const sum = donutChartData.reduce((partial_sum, a) => partial_sum + a,0);

      if (sum > 0){
        this.donut.data.labels = ['Upcoming', 'In Progress','Completed',];
        this.donut.data.datasets[0].data = donutChartData;
        this.donut.data.datasets[0].backgroundColor = ['#76f7d7','#ffe08a','#d776f7'];
      } else {
        this.donut.data.labels = ["No Assigned Tasks"]
        this.donut.data.datasets[0].data = [1];
        this.donut.data.datasets[0].backgroundColor = ['rgba(201, 203, 207)'];
      }

      //bar chart
      let barChartLabel = [];
      let barChartData = [];
      for (let i in fJson){
        if (i !== "total"){
          let desc = fJson[i].description;
          barChartLabel.push(desc);
          barChartData.push(fJson[i].no_upcoming_tasks);
        } //end of if
      }

      this.bar.data.labels= barChartLabel;
      this.bar.data.datasets[0].data = barChartData;

      //line chart
      let lineChartLabel = [];
      //https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-current-week-in-javascript
      for (let e = 0; e <= 6; e++){
        let cur = new Date();
        let first = cur.getDate() - cur.getDay() + 1; // First day is the day of the month - the day of the week
        let firstday = new Date(cur.setDate(first));
        firstday.setDate(firstday.getDate() + e);
        lineChartLabel.push(String(firstday.getDate()) + '/' + String(firstday.getMonth() + 1));
      }
      this.line.data.labels = lineChartLabel;
      this.line.data.datasets[0].data = fJson[type].no_due_this_week;

      //https://vue-chartjs.org/guide/#troubleshooting troubleshooting
      //https://github.com/apertureless/vue-chartjs/issues/695 chart not appearing
      //https://www.digitalocean.com/community/tutorials/vuejs-vue-chart-js example
      new Chart(document.getElementById('donutChart'), this.donut);
      new Chart(document.getElementById('barChart'), this.bar);
      new Chart(document.getElementById('lineChart'), this.line);

    } //end of filter
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/_variables.scss';

#selectHolder{
  text-align: left;
  margin-left: 15px;
}

.message-body{
  font-size: 24px;
}

.message{
  width: 140px;
  margin: 15px !important;

  @include breakpoint(xl_desktop){
    width: 180px;
  }

}

option[value=""][disabled] {
  display: none;
}


</style>
