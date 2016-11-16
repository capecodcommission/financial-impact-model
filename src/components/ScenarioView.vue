<template>

<div id="scenario-view" class="row">
  <tooltip effect = 'scale' placement = 'right' content = '<p>Click to enable treatment technology selector</p>'>
    <button class = 'btn btn-success text-center' @click = 'showRight = true'>Show treatment window</button>
  </tooltip>
  <aside :show.sync = "showRight" placement="left" header="Treatment Technologies" width="200">
    <div class="col-xs-13">
      <treatment-sidebar></treatment-sidebar>
    </div>
  </aside>
  <div class="col-sm-12">
    <router-view></router-view>
    <!-- UNCOMMENT WHEN DEBUGGING -->
    <!-- <pre>
    {{ treatmentIndex | json }}
    </pre>
    <pre>
      {{ scenario | json }}
    </pre>
    <pre>
    {{ financeOptions | json }}
    </pre> -->
  </div>
</div>

</template>

<script>

import { loadScenario, loadFinanceOptions } from '../vuex/actions'
import { getScenario, getTreatmentIndex, getFinanceOptions } from '../vuex/getters'
import { aside, tooltip } from 'vue-strap'

import TreatmentSidebar from './TreatmentSidebar'

export default {

  components: {

    'treatment-sidebar': TreatmentSidebar,
    'aside': aside,
    'tooltip': tooltip

  },

  data () {

    return {

      showRight: false
    }
  },

  vuex: {
    actions: {
      loadScenario,
      loadFinanceOptions
    },
    getters: {
      treatmentIndex: getTreatmentIndex,
      scenario: getScenario,
      financeOptions: getFinanceOptions
    }
  },

  // Get scenario and finance options based on scenarioId passed from parent ScenarioView
  ready () {
    this.loadScenario(this.$router._currentRoute.params.id)
    this.loadFinanceOptions()
  }
}
</script>

<style lang="scss" scoped>
#scenario-view {
  margin-top: 30px;
}
</style>
