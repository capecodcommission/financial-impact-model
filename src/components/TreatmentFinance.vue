<template>
  <div class="treatment-detail-wrapper">
    <div class="panel panel-default">
      <div class="panel-heading">
        <panel-heading-title>
          {{ treatment.treatmentName }} ({{ treatment.treatmentId }})
        </panel-heading-title>
        <!-- BUTTONS -->
  			<div class = "btn-group btn-group-justified">
  				<div class="btn-group"><button v-link="{ name: 'treatmentDetail' }" class="btn btn-primary">Treatment(s) Details</button></div>
  				<div class="btn-group"><button v-link="{ name: 'financeTreatment' }" class="btn btn-primary">Finance Treatment(s)</button></div>
  				<div class="btn-group"><button v-link="{ name: 'pie' }" class="btn btn-primary">Scenario Cost Sharing</button></div>
  			</div>
        <div class="clearfix"></div>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-xs-12">
            <h4>Financeables</h4>
            <table class="table">
              <colgroup>
                <col class="col-md-4">
                <col class="col-md-2">
                <col class="col-md-2">
                <col class="col-md-2">
                <col class="col-md-2">
              </colgroup>
              <thead>
                <tr>
                  <th>Cost Type</th>
                  <th>Finance Type</th>
                  <th>Finance Duration</th>
                  <th>Principle Forgiveness</th>
                  <th class="text-center">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(index, costType) in treatment.costTypes | filterBy 'true' in 'financeable'" is="cost-type-table-row-finance" :cost-type="costType"></tr>
              </tbody>
            </table>
            <h4>Non-Financeables</h4>
            <table class="table">
              <colgroup>
                <col class="col-md-4">
                <col class="col-md-8">
              </colgroup>
              <thead>
                <tr>
                  <th>Cost Type</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(index, costType) in treatment.costTypes | filterBy 'false' in 'financeable'">
                  <td>{{ costType.name }}</td>
                  <td>{{ '$' + Math.round(costType.treatTotal, 1).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class = "row">
          <div class="col-xs-12">
            <h4>Final Paying</h4>
            <table class="table">
              <colgroup>
                <col class="col-md-2">
                <col class="col-md-2">
                <col class="col-md-1">
                <col class="col-md-2">
              </colgroup>
              <thead>
                <tr>
                  <th>Cost Type</th>
                  <th>Financed & Non-Financed Costs</th>
                  <th class="text-center"> Additional Paying Types
                    <div class="row text-center">
                      <div class="col-md-5 text-center">Property Taxes</div>
                      <div class="col-md-2 text-center">Betterments</div>
                    </div>
                  </th>
                  <th class="text-center">$ Amount Financed/Non-Financeable</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(index, costType) in treatment.costTypes" is="cost-type-table-row-final-paying" :cost-type="costType"></tr>
              </tbody>
            </table>
          </div>
        <div class="row">
          <div class="col-xs-12">
            <treatment-summary :treatment="treatment"></treatment-summary>
          </div>
        <div class = "row">
          <div class = "col-xs-3">
            <input class="form-control text-center" type="text" v-model = "treatment.finnotes" placeholder = "User input notes">
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSelectedTreatment, getFinanceOptions } from '../vuex/getters'
import { updateFinTotals, primarysecondaryArray } from '../vuex/actions'
import PanelHeadingTitle from './PanelHeadingTitle'
import TreatmentSummary from './TreatmentSummary'
import CostTypeTableRowFinance from './CostTypeTableRowFinance'
import CostTypeTableRowFinalPaying from './CostTypeTableRowFinalPaying'

export default {
  components: {
    'panel-heading-title': PanelHeadingTitle,
    'treatment-summary': TreatmentSummary,
    'cost-type-table-row-finance': CostTypeTableRowFinance,
    'cost-type-table-row-final-paying': CostTypeTableRowFinalPaying
  },
  data () {
    return {
    }
  },

  vuex: {
    actions: {
      updateFinTotals,
      primarysecondaryArray
    },
    getters: {
      treatment: getSelectedTreatment,
      financeOptions: getFinanceOptions
    }
  },

  ready() {

  },

  computed: {
    finTotal () {
      let total = 1
      return total
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
