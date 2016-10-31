<template>

<div class = 'jumbotron full vertical-center'>
  <div class = 'container text-center'>
    <h1><b>Cape Cod Commission</b></h1>
    <h2><b>Financial Impact Model</b></h2>
    <br>
    <br>
    <h4>Enter Scenario ID</h4>
    <div class = 'row'>
      <div class="col-lg-4 col-lg-offset-4">
        <typeahead type="number" class="form-control text-center" placeholder='100' aria-describedby="sizing-addon2" :on-hit = 'fetchScenario' :data = 'scenidArr'></typeahead>
      </div>
    </div><br>
    <div class = 'row text-center'>
      <button type = "button" class = "btn btn-success" id = 'disclaimer' @click = "toggle1">Disclaimer</button>
      <div id="popup" v-show = "active1">Cape Cod Commission2 is consectetur adipiscing elit. Maecenas dolor tortor, convallis vitae imperdiet at, mollis vitae felis. Sed sed felis vel risus bibendum semper et vel lorem. Proin et dapibus nunc, non accumsan risus. Praesent nibh nibh, aliquet id arcu id, euismod lobortis sem. Etiam et tempor neque, sed congue ipsum. Nullam arcu velit, accumsan quis eros vel, scelerisque semper sem. Quisque posuere tempus dui sed tempor. Nunc venenatis feugiat nisi sed molestie. Vivamus congue venenatis volutpat. Proin vulputate elit mi, eu mollis dui feugiat vitae. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed dui ipsum, blandit dignissim condimentum eu, tincidunt et metus.
      </div>
      <button type="button" class="btn btn-success" id = 'about' @click = "toggle2">About</button>
      <div id="popup1" v-show = "active2">Cape Cod Commission is consectetur adipiscing elit. Maecenas dolor tortor, convallis vitae imperdiet at, mollis vitae felis. Sed sed felis vel risus bibendum semper et vel lorem. Proin et dapibus nunc, non accumsan risus. Praesent nibh nibh, aliquet id arcu id, euismod lobortis sem. Etiam et tempor neque, sed congue ipsum. Nullam arcu velit, accumsan quis eros vel, scelerisque semper sem. Quisque posuere tempus dui sed tempor. Nunc venenatis feugiat nisi sed molestie. Vivamus congue venenatis volutpat. Proin vulputate elit mi, eu mollis dui feugiat vitae. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed dui ipsum, blandit dignissim condimentum eu, tincidunt et metus.
      </div>
    </div>
  </div>
</div>
<!-- <pre>{{treatments | json}}</pre> -->

</template>

<script>

import { loadScenario } from '../vuex/actions'
import { getTreatments } from '../vuex/getters'
import { typeahead } from 'vue-strap'

export default {

  components: {

    typeahead
  },

  data () {

    return {

      active1: false,
      active2: false,
      scenarioId: '',
      scenidArr: ['1846','1847','1848','1849','1850']
    }
  },

  vuex: {

    actions: {

      loadScenario
    },

    getters: {

      treatments: getTreatments
    }
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
    }
  },

  watch: {

    'treatments': function (val) {

      if (val.length === 0) {

        alert('Invalid Scenario. Please enter valid Scenario ID')
      } else {

        this.$router.go('/scenario/' + this.scenarioId + '/treatmentsDetails')
      }
    }
  }
}

</script>

<style lang="scss">

.scenario-picker {
  text-align: center;

  .form-control {
    text-align: center;
  }
}

</style>
