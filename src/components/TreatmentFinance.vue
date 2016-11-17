<template>
  <div class="treatment-detail-wrapper">
    <div class="panel panel-default">
      <div class="panel-heading">
        <panel-heading-title>
          <tooltip effect = 'scale' placement = 'bottom' content = 'This is your selected treatment technology'>
            <button class = 'btn btn-primary'>{{ treatment.treatmentName }}</button>
          </tooltip>
        </panel-heading-title><br><br><br>
        <!-- BUTTONS -->
  			<div class = "btn-group btn-group-justified">
  				<div class="btn-group">
            <button v-link="{ name: 'treatmentDetail' }" class="btn btn-secondary">Treatment(s) Details</button>
          </div>
  				<div class="btn-group">
            <tooltip effect = 'scale' placement = 'bottom' content = 'This is your current page'>
              <button v-link="{ name: 'financeTreatment' }" class="btn btn-primary">Finance Treatment(s)</button>
            </tooltip>
          </div>
  				<div class="btn-group">
            <button :disabled = "!active" v-link="{ name: 'pie' }" class="btn btn-secondary">Scenario Cost Sharing</button>
          </div>
  			</div>
        <div class="clearfix"></div>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-xs-12">
            <tooltip effect = 'scale' placement = 'bottom' content = '<p>Select at least one Finance Type from the cost type table below</p><p>For the cost type with selected finance, enter Principle Forgiveness as a decimal. eg. 0.0325, 0.0214</p>'>
              <button class = 'btn btn-primary'>Financeables</button>
            </tooltip>
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
                  <th class = 'text-center'>Cost Type</th>
                  <th class = 'text-center'>
                    <tooltip effect = 'scale' placement = 'bottom' content = 'Select financing option from dropdown'>Finance Type</tooltip>
                  </th>
                  <th class="text-center">
                    <tooltip effect = 'scale' placement = 'bottom' content = 'Enter duration in years'>Finance Duration</tooltip>
                  </th>
                  <th class="text-center">
                    <tooltip effect = 'scale' placement = 'bottom' content = 'Enter Primcipal Forgiveness as a decimal. Eg. .0325, .0214'>Principal Forgiveness</tooltip>
                  </th>
                  <th class="text-center">Total (Financing minus Principal Forgiveness)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(index, costType) in treatment.costTypes" is="cost-type-table-row-finance" :cost-type="costType"></tr>
              </tbody>
            </table>
            <!-- <tooltip effect = 'scale' placement = 'bottom' content = 'Financing not applicable on these cost types'>
              <button class = 'btn btn-primary'>Non-Financeables</button>
            </tooltip>
            <table class="table">
              <colgroup>
                <col class="col-md-2">
                <col class="col-md-8">
                <col class="col-md-2">
              </colgroup>
              <thead>
                <tr>
                  <th></th>   
                  <th></th>
                  <th class = 'text-center'>Total (Inflated)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(index, costType) in treatment.costTypes | filterBy 'false' in 'financeable'">
                  <td>{{ costType.name }}</td>
                  <td>
                    <div v-if = '!costType.financeable' class = 'text-center disabled'>
                      <small>This cost type isn't financeable</small>
                    </div>
                  </td>
                  <td class = 'text-center'>{{ '$' + Math.round(costType.treatTotal, 1).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table> -->
          </div>
        </div>
        <div class = "row">
          <div class="col-xs-12">
            <tooltip effect = 'scale' placement = 'bottom' content = 'Enter Additional Paying Types as decimal. eg. 0.025, 0.0314'>
              <button class = 'btn btn-primary'>Additional Payments</button>
            </tooltip>
            <table class="table">
              <colgroup>
                <col class="col-md-4">
                <col class="col-md-2">
                <col class="col-md-4">
                <col class="col-md-2">
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center">Cost Type</th>
                  <th class="text-center">Financed & Non-Financed Costs</th>
                  <th class="text-center"> Additional Paying Types
                    <div class="row text-center"><hr style="width: 90%; color: black; height: 1px; background-color:black;" />
                      <div class="col-md-6 text-center">
                        <tooltip effect = 'scale' placement = 'bottom' content = 'Enter Additional Paying Types as decimal. eg. 0.025, 0.0314'>Property Taxes</tooltip>
                      </div>
                      <div class="col-md-5 text-center">
                        <tooltip effect = 'scale' placement = 'bottom' content = 'Enter Additional Paying Types as decimal. eg. 0.025, 0.0314'>Betterments</tooltip>
                      </div>
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
          <div class = "col-md-12">
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
import { getSelectedTreatment, getFinanceOptions, getTreatments } from '../vuex/getters'
import { updateFinTotals, primarysecondaryArray } from '../vuex/actions'
import PanelHeadingTitle from './PanelHeadingTitle'
import TreatmentSummary from './TreatmentSummary'
import CostTypeTableRowFinance from './CostTypeTableRowFinance'
import CostTypeTableRowFinalPaying from './CostTypeTableRowFinalPaying'
import { tooltip } from 'vue-strap'

export default {
  components: {
    'panel-heading-title': PanelHeadingTitle,
    'treatment-summary': TreatmentSummary,
    'cost-type-table-row-finance': CostTypeTableRowFinance,
    'cost-type-table-row-final-paying': CostTypeTableRowFinalPaying,
    'tooltip':tooltip
  },
  data () {

    return {

      active: false,
      activeArr: []
    }
  },

  props: ['disabled'],

  watch: {

    'treatment': function(val) {

      this.treatment.stage = 2
      this.activeArr.push([this.treatment.stage])

      if (this.activeArr.length === this.treat.length) {

        this.active = true
      }
    }
  },

  vuex: {

    actions: {

      updateFinTotals,
      primarysecondaryArray
    },

    getters: {

      treatment: getSelectedTreatment,
      financeOptions: getFinanceOptions,
      treat: getTreatments
    }
  },

  ready() {

    this.treatment.stage = 2

    for (var i = 0; i < this.treat.length; i++) {
      
      if (this.treat[i].stage > 1) {

        this.activeArr.push([this.treat[i].stage])
      }
    }

    if (this.activeArr.length === this.treat.length) {

      this.active = true
    }
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
