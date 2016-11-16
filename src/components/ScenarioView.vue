<template>

<div id="scenario-view" class="row">
  <div class="col-xs-2">
    <treatment-sidebar></treatment-sidebar>
</div>
<div class="col-sm-10">
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

import TreatmentSidebar from './TreatmentSidebar'

export default {

  components: {

    'treatment-sidebar': TreatmentSidebar

  },

  data () {
    return {
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
