<template>
<div class = 'jumbotron full vertical-center'>
  <div class = 'container text-center'>
      <img src="http://www.capecodcommission.org/gfx/home-logo.jpg" class="img-fluid" alt="Responsive image">
    <!-- <h1><b>Cape Cod Commission</b></h1> -->
    <h2><b>Financial Impact Model</b></h2>
    <br>
    <br>
    <button @click = 'startIntro' class = 'btn btn-success' data-step = '1' data-intro = 'Welcome to the Financial Impact Model!'>New User?</button>
    <h4>Enter <a href = 'http://2016.watershedmvp.org/login'>Scenario ID</a></h4>
    <div class = 'row'>
      <div class="col-lg-4 col-lg-offset-4">
        <typeahead data-step = '2' data-intro = 'Enter a partial or full Scenario ID, then use the arrow keys or mouse to select a result' type="number" class="text-center" placeholder='100' aria-describedby="sizing-addon2" :on-hit = 'fetchScenario' :data = 'scenidArr'></typeahead>
        <small>Click result or use keyboard arrows in search results to select</small>
        <alert :show.sync = "isNotThere" type = "danger" duration="5000" width="400px" dismissable>
            <span class="glyphicon glyphicon-flag"></span>
            <strong>Oops!</strong>
            <h3>No Treatments found. Enter valid scenario id to continue</h3>
      </alert>
      </div>
    </div><br>
    
    <div class = 'row text-center'>
      <button type = "button" class = "btn btn-success" id = 'disclaimer' @click = "toggle1">Disclaimer</button>
      <div id="popup" v-show = "active1">The application is an informational resource intended to provide financial estimates for planning purposes. Financial Impact Model is an initiative of the Cape Cod Commission’s Strategic Information Office (SIO).
      </div>
      <button type="button" class="btn btn-success" id = 'about' @click = "toggle2">About</button>
      <div id="popup1" v-show = "active2">The Cape Cod Commission developed the WatershedMVP application for professionals, municipal officials and community members in order to assist in creating the most cost-effective and efficient solutions to Cape Cod’s wastewater problem. The application is an informational resource intended to provide regional estimates for planning purposes. WatershedMVP is an initiative of the Cape Cod Commission’s Strategic Information Office (SIO). To learn more about the WatershedMVP application and the Cape Cod Commission and its SIO, please <a href="http://www.capecodcommission.org/index.php?id=205&maincatid=2">Contact Us</a>
      </div>
    </div>
  </div>
</div>
<!-- <pre>{{scenarios | json}}</pre> -->
</template>
<script>

import { loadScenario, loadScenarios } from '../vuex/actions'
import { getTreatments, getScenarios } from '../vuex/getters'
import { typeahead, alert } from 'vue-strap'
import {introJs} from '../../node_modules/intro.js/intro.js'

export default {

  components: {

    typeahead,
    alert
  },

  data () {

    return {

      active1: false,
      active2: false,
      scenarioId: '',
      scenidArr: [],
      isNotThere: false
    }
  },

  vuex: {

    actions: {

      loadScenario,
      loadScenarios
    },

    getters: {

      treatments: getTreatments,
      scenarios: getScenarios
    }
  },

  ready() {

      this.loadScenarios()
  },

  methods: {
    
    // Activate ScenarioView.vue with nested route TreatmentDetail.vue using scenarioId passed from html input to data above
    fetchScenario (x) {

      this.scenarioId = x

      this.loadScenario(x)
    },

    // Change acive state from TRUE to FALSE, shown/hidden via respective v-show
    toggle1 () {

      this.active1 = !this.active1
    },

    toggle2 () {

      this.active2 = !this.active2
    },

    startIntro() {

      introJs().start()
    }
  },

  watch: {

    'treatments': function (val) {

      if (val.length === 0) {

        this.isNotThere = true

      } else {

        this.$router.go('/scenario/' + this.scenarioId + '/treatmentsDetails')
      }
    },

    'scenarios': function(val) {

      for (var i = 0; i < this.scenarios.length; i++) {

        this.scenidArr.push([this.scenarios[i]['scenarioId']].toString())
      }
    }
  }
}

</script>

<style lang="scss">
@import '../../node_modules/intro.js/introjs.css';
.scenario-picker {
  text-align: center;

  .form-control {
    text-align: center;
  }
}

</style>
