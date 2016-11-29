<template>

<div id="scenario-view" class="row">
  <div class = 'col text-center'>
    <tooltip effect = 'scale' placement = 'right' content = '<p>Click to enable treatment technology selector</p>'>
      <button class = 'btn btn-success text-center' @click = 'showRight = true'>Show treatment window</button>
    </tooltip>
    <!-- <button class = 'btn btn-primary' @click = 'excelExport'>export</button> -->
  </div>
  <aside :show.sync = "showRight" placement="left" header="Treatment Technologies" width="200">
    <div class="col-xs-13">
      <treatment-sidebar></treatment-sidebar>
    </div>
  </aside>
  <div class="col">
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
import { getScenario, getTreatmentIndex, getFinanceOptions, getTreatments } from '../vuex/getters'
import { aside, tooltip } from 'vue-strap'
import TreatmentSidebar from './TreatmentSidebar'
import json2csv from 'nice-json2csv'

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
      financeOptions: getFinanceOptions,
      treat: getTreatments
    }
  },

  // Get scenario and finance options based on scenarioId passed from parent ScenarioView
  ready () {
    this.loadScenario(this.$router._currentRoute.params.id)
    this.loadFinanceOptions()
  },

  methods: {

    JSONflatten (data) {

      var result = {};

      function recurse(cur, prop) {

        if (Object(cur) !== cur) {

          result[prop] = cur;
        } else if (Array.isArray(cur)) {

          for (var i = 0, l = cur.length; i < l; i++)

            recurse(cur[i], prop + "[" + i + "]");

          if (l == 0) result[prop] = [];

        } else {
          var isEmpty = true;

          for (var p in cur) {

            isEmpty = false;
            recurse(cur[p], prop ? prop + "." + p : p);
          }

          if (isEmpty && prop) result[prop] = {};
        }
      }

      recurse(data, "");
      return result;
    },

    excelExport() {

      var arr = []

      for (var i = 0; i < this.treat.length; i++) {

        for (var j = 0; j < this.treat[i].costTypes.length; j++) {

          arr.push(this.JSONflatten(this.treat[i].costTypes[j]))
        }
      }

      var csvContent = json2csv.convert(arr)

      var a = document.createElement('a');

      a.textContent='download';
      a.download= "Treatments.csv";
      a.href='data:text/csv;charset=utf-8,'+escape(csvContent);
      document.body.appendChild(a);
      a.click()
      a.remove()
    }
  }
}
</script>

<style lang="scss" scoped>
#scenario-view {
  margin-top: 30px;
}
</style>
