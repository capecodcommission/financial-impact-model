<template>
<alert :show.sync = "!active" type = "success" placement="top-right" duration = "3000" width="400px" dismissable>
  <span class="glyphicon glyphicon-plane"></span>
  <strong>Tutorial</strong>
  <h1>Mouse-over buttons to learn about the application</h1>
</alert>
<alert :show.sync = "active" type = "success" placement="top-right" duration = "3000" width="400px" dismissable>
  <span class="glyphicon glyphicon-plane"></span>
  <strong>Tutorial</strong>
  <h1>Now that you've gone through all treatments, please continue to the next page</h1>
</alert>
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
          <tooltip effect = 'scale' placement = 'bottom' content = 'This is your current page'>
            <button v-link="{ name: 'treatmentDetail' }" class="btn btn-primary">Treatment(s) Details</button>
          </tooltip>
        </div>
				<div class="btn-group">
          <button :disabled = "!active" v-link="{ name: 'financeTreatment' }" class="btn btn-secondary">Finance Treatment(s)</button>
        </div>
			</div>
      <div class="clearfix"></div>
    </div>
    <div class="panel-body">
      <div class="row">
        <div class="col-md-3">
          <tooltip effect = 'scale' placement = 'bottom' content = 'Select a 20-year range to update costs in the table below'>
            <button class = 'btn btn-primary'>Technology Project Start and Duration <small>(in years)</small></button>
          </tooltip>
        </div>
        <div class="col-md-5">
          <duration-slider
          :relative-start-year="treatment.relativeStartYear"
          :duration="treatment.duration"
          :min="1"
          :max="50"
          v-on:range-change="onDurationChange"
          >
          </duration-slider>
        </div>
      </div><br>
      <div class="row">
        <div class="col-xs-12">
          <table class="table">
            <colgroup>
            <col class="col-md-3">
            <col class="col-md-2">
            <col class="col-md-4">
            <col class="col-md-3">
            </colgroup>
            <thead>
              <tr>
                <th>
                  <tooltip effect = 'scale' placement = 'bottom' content = 'There are multiple components to the cost of a wastewater technology – capital, replacement, operations and maintenance (O&M), other (both financeable and non-financeable), transport and disposal, and wastewater collection. Not every technology has each cost type, and cost types might be “grantable” (can be paid for with grants) and/or “financeable” (can be financed), or neither.'>Cost Type</tooltip>
                </th>
                <th>
                  <tooltip effect = 'scale' placement = 'bottom' content = '<p>Approximated future dollar value of cost type at project start year</p>'>Inflated</tooltip>
                </th>
                <th>
                  <tooltip effect = 'scale' placement = 'bottom' content = 'Amount of money given by an organization (especially government) for a particular purpose. Finance Impact Model allows users to pay for each cost type deemed “grantable” by specifying amounts of grants given by federal, regional, or state agencies.'>Grants</tooltip>
                  <div class="row"><hr style="width: 90%; color: black; height: 1px; background-color:black;" />
                    <div class="col-md-4">
                      <tooltip effect = 'scale' placement = 'bottom' content = 'Enter amount in dollars $'>Federal</tooltip>
                    </div>
                    <div class="col-md-4">
                      <tooltip effect = 'scale' placement = 'bottom' content = 'Enter amount in dollars $'>Regional</tooltip>
                    </div>
                    <div class="col-md-3">
                      <tooltip effect = 'scale' placement = 'bottom' content = 'Enter amount in dollars $'>State</tooltip>
                    </div>
                  </div>
                </th>
                <th>Total (Inflated minus grants)</th>
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
        <div class = "col-md-12">
          <input class="form-control text-center" type="text" v-model = "treatment.treatnotes" placeholder = "User input notes">
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<script src="jquery.js"></script>
<script src="filesaver.js"></script>
<script src="tableexport.js"></script>
</template>

<script>

import { updateTreatment } from '../vuex/actions'
import { getSelectedTreatment, getTreatmentIndex, getTreatments } from '../vuex/getters'
import { tooltip, alert } from 'vue-strap'

import DurationSlider from './DurationSlider'
import CostTypeTableRow from './CostTypeTableRow'
import PanelHeadingTitle from './PanelHeadingTitle'
import TreatmentSummary from './TreatmentSummary'
import json2csv from 'nice-json2csv'

export default {
  components: {

    'panel-heading-title': PanelHeadingTitle,
    'duration-slider': DurationSlider,
    'cost-type-table-row': CostTypeTableRow,
    'treatment-summary': TreatmentSummary,
    tooltip,
    alert

  },

  data () {

    return {

      active: false,
      activeArr: []
    }
  },

  props: ['disabled'],

  methods: {

    // When slider is updated, activeate action to reload treatment JSON using relative start year, duration, and current treatment selected
    onDurationChange( sliderValue ) {

      this.updateTreatment( sliderValue[0], this.treatment.duration, this.treatment.treatmentId )
    },

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
