<template>
  <div class="treatment-detail-wrapper">
    <div class="panel panel-default">
      <div class="panel-heading col text-center">
          <tooltip effect = 'scale' placement = 'bottom' content = 'This is your selected treatment technology'>
            <button @click = 'gotm_Id' class = 'btn btn-primary'>{{ treatment.treatmentName }}</button>
          </tooltip><br><br><br>
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
          <treatment-summary data-step = '1' data-intro = 'For reference, this is your working Scenario ID and Embayment selected within the Scenario' :treatment="treatment"></treatment-summary>
            <div class = 'col-md-12 text-center'>
              <button class = 'btn btn-success pull-right' @click = 'startIntro'>Help</button><br>
              <tooltip effect = 'scale' placement = 'bottom' content = '<p>Select at least one Finance Type from the cost type table below</p><p>For the cost type with selected finance, enter Principle Forgiveness as a decimal. eg. 0.0325, 0.0214</p>'>
                <button class = 'btn btn-primary'>Financeables</button>
              </tooltip>
            </div>
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
                  <th data-step = '2' data-intro = 'Select 1 of 4 financing types for each Cost Type, along with a financing duration and Principal Forgivess rate.' class = 'text-center'>
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
          </div>
        </div>
        <div class = "row">
          <div class="col-xs-12">
            <div class = 'col text-center'>
              <tooltip effect = 'scale' placement = 'bottom' content = 'Enter Additional Paying Types as decimal. eg. 0.025, 0.0314'>
                <button class = 'btn btn-primary'>Additional Payments</button>
              </tooltip>
            </div>
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
                  <th data-step = '4' data-intro = 'Enter additional Property Taxes and Betterments as a percent-reduction to costs' class="text-center"> Additional Paying Types
                    <div class="row text-center"><hr style="width: 90%; color: black; height: 1px; background-color:black;" />
                      <div class="col-md-6 text-center">
                        <tooltip effect = 'scale' placement = 'bottom' content = 'Enter Additional Paying Types as decimal. eg. 0.025, 0.0314'>Property Taxes</tooltip>
                      </div>
                      <div class="col-md-5 text-center">
                        <tooltip effect = 'scale' placement = 'bottom' content = 'Enter Additional Paying Types as decimal. eg. 0.025, 0.0314'>Betterments</tooltip>
                      </div>
                    </div>
                  </th>
                  <th class="text-center">Grand Total (Financed minus Betterments / Property Taxes)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(index, costType) in treatment.costTypes" is="cost-type-table-row-final-paying" :cost-type="costType"></tr>
              </tbody>
            </table>
          </div>
        <div class="row">
          <div class="col-xs-12">
            <input class="form-control text-center" type="text" v-model = "treatment.finnotes" placeholder = "User input notes">
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
import {introJs} from '../../node_modules/intro.js/intro.js'

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

  methods: {

    gotm_Id() {

      var win = window.open('http://www.cch2o.org/Matrix/detail.php?treatment=' + this.treatment.tm_Id, '_blank');

      if (win) {
          //Browser has allowed it to be opened
          win.focus();
      } else {
          //Browser has blocked it
          alert('Please allow popups for this website');
      }

    },

    startIntro() {

      introJs().start()
    }
  },

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
