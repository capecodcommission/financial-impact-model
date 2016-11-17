<template>
  <tr>
    <td>{{ costType.name }}</td>
    <td class="text-center">{{ '$' + Math.round(sumOfAnnualCapitalTotals1, 1).toLocaleString() }}</td>
    <td>
     <div class="input-group col-md-12">
        <input type="number" class="form-control input-sm" min="0" max="1" step="0.01" v-model.number="costType.addtlpytyps.Property_TaxesorFees" number />
        <span class="input-group-btn"></span>
        <input type="number" class="form-control input-sm" min="0" max="1" step="0.01" v-model.number="costType.addtlpytyps.Betterments" number />
      </div>
    </td>
    <td class="text-center">
      {{ '$' + Math.round(finTotal, 1).toLocaleString() }}
    </td>
  </tr>
</template>
<script>
import { getSelectedTreatment, getFinanceOptions } from '../vuex/getters'
import { updateFinTotals } from '../vuex/actions'

export default {
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

  vuex: {
    getters: {
      treatment: getSelectedTreatment,
      financeOptions: getFinanceOptions
    },
    actions: {
      updateFinTotals
    }
  },

  computed: {

    // If sumofannualcapitaltotals exists, set fintotal to sumofannualcapitaltotals minus a percentage of itself from property taxes/betterments, else set fintotal to treattotal minus a percentage of itself.
    // This is to account for costtypes that don't need to access a summation from the API, like 'Other' financeables
    finTotal () {
      if (this.costType.annualized.sumOfAnnualCapitalTotals) {
        this.costType.finTotal = this.costType.annualized.sumOfAnnualCapitalTotals - (this.costType.annualized.sumOfAnnualCapitalTotals * (this.costType.addtlpytyps.Property_TaxesorFees + this.costType.addtlpytyps.Betterments))
      } else {
        this.costType.finTotal = this.costType.treatTotal - (this.costType.treatTotal * (this.costType.addtlpytyps.Property_TaxesorFees + this.costType.addtlpytyps.Betterments))
      }
      return this.costType.finTotal
    },

    // if sumofannualcapitaltotals exists, show that, else treattotal for each costtype
    sumOfAnnualCapitalTotals1 () {
      if (this.costType.annualized.sumOfAnnualCapitalTotals){
        return this.costType.annualized.sumOfAnnualCapitalTotals
      } else {
        return this.costType.treatTotal
      }
    }

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
