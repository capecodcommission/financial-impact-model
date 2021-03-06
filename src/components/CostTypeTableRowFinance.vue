<template>
  <tr>
    <td>{{ costType.name }}</td>
      <td>
        <div v-if = 'costType.financeable'>
          <select class="form-control" v-model="costType.financeOption" debounce = "1000">
            <tooltip effect = 'scale' placement = 'bottom' content = 'This is your current page'>
              <option v-for="(index,option) in financeOptions" value = "{{option.id}}" debounce = "1000">
              {{option.name}}
              </option>
            </tooltip>
          </select>
        </div>
        <div v-else class = 'text-center disabled'>
          <small>Not financeable</small>
        </div>
      </td>
      <td>
        <div v-if = 'costType.financeable'>
          <input class="form-control text-center input-sm" type="number" min="1" v-model.number = "costType.finDur" debounce = "1000">
        </div>
        <div v-else class = 'text-center disabled'>
          <small>Not financeable</small>
        </div>
      </td>
      <td class = 'text-center'>
        <div data-step = '3' data-intro = 'Once a Finance Type is selected, enter a Principal Forgiveness rate as a decimal (eg. .0325, .0214)' v-if = 'costType.financeable'>
          <input class="form-control text-center" type="number" min="0" max="1" step="0.01" v-model.number = "costType.prinFor" debounce = "1000">
          <small>{{(costType.prinFor * 100).toFixed(2) + '%'}}</small>
        </div>
        <div v-else class = 'text-center disabled'>
          <small>Not financeable</small>
        </div>
      </td>
    </div>
    <td class="text-center" type="number">
      <div v-if = 'costType.financeable'>
        {{ '$' + Math.round(costType.annualized.sumOfAnnualCapitalTotals, 1).toLocaleString() }}
      </div>
      <div v-else class = 'text-center'>
          {{ '$' + Math.round(costType.treatTotal, 1).toLocaleString() }}
      </div>
    </td>
  </tr>
</template>
<script>

// Import getter and action functions from vuex/
import { getSelectedTreatment, getFinanceOptions } from '../vuex/getters'
import { updateFinTotals, updateCapTotalTownTreatment, annualTownTreatment, primarysecondaryArray } from '../vuex/actions'
import {tooltip} from 'vue-strap'

export default {

  components: {

    tooltip
  },

  props: {
    costType: {
      name: String,
      inflated: Number,
      editable: {
        type: Boolean,
        default: false
      },
      grantable: {
        type: Boolean,
        default: true
      }
    }
  },

  data() {
    return {
      townarray: []
    }
  },

  vuex: {
    getters: {
      treatment: getSelectedTreatment,
      financeOptions: getFinanceOptions
    },
    actions: {
      updateFinTotals,
      updateCapTotalTownTreatment,
      annualTownTreatment,
      primarysecondaryArray
    }
  },

  methods: {

    // Set the finDur to the selected financeOption's maxDuration
    setFinDurToFinanceOptionsMaxDuration: function (val) {
      return this.costType.finDur = this.financeOptions[val].maxDuration
    },

    // If user enters finance duration greater than max duration of finance type, set finance
    // duration to maxDuration.  If entered finance duration is less than max duration of finance
    // type, set finance duration to 1 (value 1 or greater is required by API even though no
    // finance doesn't have an actual duration).
    setfinDurParams: function (val) {
      if (val > this.financeOptions[this.costType.financeOption].maxDuration) {
        alert("Finance duration greater than " + this.financeOptions[this.costType.financeOption].maxDuration + ".  Finance duration will now be set to the maximum duration of: " + this.financeOptions[this.costType.financeOption].name + ".")
        this.costType.finDur = this.financeOptions[this.costType.financeOption].maxDuration
      } else if (val < 1) {
        alert("Finance duration must be greater than or equal to one.  Finance duration will now be set to 1.")
        this.costType.finDur = 1
      } else {
        return this.costType.finDur
      }
    },

    // If user selects no finance duration and enters a value for finance duration or principle
    // forgiveness, alert to the user that no finance doesn't allow apply financing options and
    // set finDur to necessary value of 1, while setting principle forgiveness to default value
    // of 0.  If user selects a finance option other than no finance and enters a value less than
    // 0, set to 0 & throw alert OR enters a value greater than 1, set to 1 & throw alert.
    setprinFor: function (val) {
      if (val > 0 && this.costType.financeOption === 0) {
        alert("Principle forgiveness is disabled without financing.  Principle forgiveness will now be set to 0.")
        return this.costType.prinFor = 0
      } else if (val < 0 && this.costType.financeOption === 0) {
        alert("Principle forgiveness is disabled without financing.  Principle forgiveness will now be set to 0.")
        return this.costType.prinFor = 0
      } else if (val < 0 && this.costType.financeOption !== 0) {
        alert("Principle forgiveness must cannot be a value less than 0 and will now be set to 0.")
        return this.costType.prinFor = 0
      } else if (val > 1 && this.costType.financeOption !== 0) {
        alert("Principle forgiveness cannot be a value greater than 1 and will now be set to 1.")
        return this.costType.prinFor = 1
      }
    }
  },

  computed: {

    // If treattotal exists, run two actions (obtain sumofannualcapitaltotals and annual totals array) using treatment parameters, return sumofannualcapitaltotals updated by action, or return 0 if empty
    costTotal () {
      if (this.costType.treatTotal) {
        return this.costType.annualized.sumOfAnnualCapitalTotals
      } else {
        return 0
      }
    }
  },

  // Watch properties for changes, if any property changes, trigger functions
  watch: {
    'costType.finDur': function(val) {
      this.setfinDurParams(val)

      this.updateFinTotals(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,val,this.costType.prinFor)
      this.updateCapTotalTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,val,this.costType.prinFor,this.costType.name)
      this.annualTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,val,this.costType.prinFor,this.costType.name)
    },

    'costType.prinFor': function(val) {

      this.setprinFor(val)
      this.updateFinTotals(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,this.costType.finDur,val)
      this.updateCapTotalTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,this.costType.finDur,val,this.costType.name)
      this.annualTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,this.costType.finDur,val,this.costType.name)
    },

    'costType.financeOption': function(val) {

      this.setFinDurToFinanceOptionsMaxDuration(val)
      this.updateFinTotals(this.treatment.treatmentId,this.costType.treatTotal,val,this.treatment.relativeStartYear,this.costType.finDur,this.costType.prinFor)
      this.updateCapTotalTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,val,this.treatment.relativeStartYear,this.costType.finDur,this.costType.prinFor,this.costType.name)
      this.annualTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,val,this.treatment.relativeStartYear,this.costType.finDur,this.costType.prinFor,this.costType.name)
    },

    'treatment.treatmentId': function(val) {
  
    },

    'costType.annualtownarray': function(val) {

      for (var i = 0; i < this.treatment.costTypes.length; i++) {

        if (!Object.keys(this.treatment.costTypes[i].annualtownarray).length == 0) {

          this.townarray.push(this.treatment.costTypes[i].annualtownarray)
        }
      }

      var newarray = JSON.stringify(this.townarray)

      this.primarysecondaryArray(this.treatment.treatmentId,newarray)
    }
  },

  ready () {
    this.updateFinTotals(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,this.costType.finDur,this.costType.prinFor)
    // this.updateCapTotalTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,this.costType.finDur,this.costType.prinFor,this.costType.name)
    // this.annualTownTreatment(this.treatment.treatmentId,this.costType.treatTotal,this.costType.financeOption,this.treatment.relativeStartYear,this.costType.finDur,this.costType.prinFor,this.costType.name)

    // var newarray = []

    // for (var i = 0; i < this.treatment.costTypes.length; i++) {

    //   if (!Object.keys(this.treatment.costTypes[i].annualtownarray).length == 0) {

    //     newarray.push(this.treatment.costTypes[i].annualtownarray)
    //   }
    // }

    // this.primarysecondaryArray(this.treatment.treatmentId,newarray)
  }
}
</script>
<style lang="scss" scoped>
  .input-group-btn { width:0px; }
  input[type=number] {
    text-align: right;
  }
  .disabled {
    small {
      color: #ccc;
      font-style: italic;
    }
  }
</style>
