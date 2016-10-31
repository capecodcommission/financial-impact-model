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
				<div class="btn-group"><button v-show = 'active' v-link="{ name: 'financeTreatment' }" class="btn btn-primary">Finance Treatment(s)</button></div>
				<!-- <div class="btn-group"><button v-link="{ name: 'pie' }" class="btn btn-primary">Cost Sharing</button></div>
				<div class="btn-group"><button v-link="{ name: 'pairedbar' }" class="btn btn-primary">Project & Financing Schedule</button></div> -->
			</div>
      <div class="clearfix"></div>
    </div>
    <div class="panel-body">
      <div class="row">
        <div class="col-md-4">
          <h5>Technology Project Start and Duration <small>(in years)</small></h5>
        </div>
        <div class="col-md-6">
          <duration-slider
          :relative-start-year="treatment.relativeStartYear"
          :duration="treatment.duration"
          :min="1"
          :max="50"
          v-on:range-change="onDurationChange"
          >
          </duration-slider>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <table class="table">
            <colgroup>
            <col class="col-md-3">
            <col class="col-md-2">
            <col class="col-md-4">
            <col class="col-md-2">
            </colgroup>
            <thead>
              <tr>
                <th>Cost Type</th>
                <th>Inflated</th>
                <th class="text-center">
                  Grants
                  <div class="row">
                    <div class="col-md-4">Federal</div>
                    <div class="col-md-4">Regional</div>
                    <div class="col-md-4">State</div>
                  </div>
                </th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(index, costType) in treatment.costTypes" is="cost-type-table-row" :cost-type="costType"></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <treatment-summary :treatment="treatment"></treatment-summary>
      </div>
      <div class = "row">
        <div class = "col-xs-3">
          <input class="form-control text-center" type="text" v-model = "treatment.treatnotes" placeholder = "User input notes">
        </div>
      </div>
    </div>
  </div>
</div>
</div>

</template>

<script>

import { updateTreatment } from '../vuex/actions'
import { getSelectedTreatment, getTreatmentIndex, getTreatments } from '../vuex/getters'

import DurationSlider from './DurationSlider'
import CostTypeTableRow from './CostTypeTableRow'
import PanelHeadingTitle from './PanelHeadingTitle'
import TreatmentSummary from './TreatmentSummary'

export default {
  components: {

    'panel-heading-title': PanelHeadingTitle,
    'duration-slider': DurationSlider,
    'cost-type-table-row': CostTypeTableRow,
    'treatment-summary': TreatmentSummary

  },

  data () {

    return {

      active: false,
      activeArr: []
    }
  },

  methods: {

    // When slider is updated, activeate action to reload treatment JSON using relative start year, duration, and current treatment selected
    onDurationChange( sliderValue ) {

      this.updateTreatment( sliderValue[0], this.treatment.duration, this.treatment.treatmentId )
    }
  },

  ready() {

    for (var i = 0; i < this.treat.length; i++) {

      if (this.treat[i].stage > 0) {

        this.activeArr.push([this.treat[i].stage])
      }
    }

    if (this.activeArr.length === this.treat.length) {

      this.active =  true
    }
  },

  watch: {

    'treatment': function(val) {

      if (this.treatment.stage === 0) {

        this.treatment.stage = 1

        this.activeArr.push([this.treatment.stage])
      }

      if (this.activeArr.length === this.treat.length) {

        this.active = true
      }
    }
  },

  vuex: {
    actions: {

      updateTreatment
    },
    getters: {
      
      treatment: getSelectedTreatment,
      treatdex: getTreatmentIndex,
      treat: getTreatments
    }
  }
}

</script>

<style lang="scss" scoped>

thead {
 tr {
   th {
     text-align: center;
   }
 }
}

</style>
