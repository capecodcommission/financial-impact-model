<template>
  <tr>
    <td 
      :title = 
        "[
          costType.name === 'Operations & Maintenance ' ? 'This cost incorporates the daily Operations and Maintenance expected to incur during the running and maintaining a successfully treatment facility' : 
          costType.name === 'Wastewater Collection ' ? 'Collection construction includes activities for centralized sewer and satellite facilities comprising of three costs: pipes in the ground to collect wastewater cost, lift cost to move wastewater through the system, and connection cost to connect to the pipes' : 
          costType.name === 'Wastewater Transport and Disposal ' ? 'This cost incorporates transporting the load from the Collection area to a wastewater treatment facility and from the wastewater treatment facility to the disposal site. It also includes the cost of disposing the load at that site' : 
          costType.name === 'Capital ' ? 'The cost to design, permit and build facilities, including land costs' :
          costType.name === 'Replacement ' ? 'The cost to replace selected technology' : ''
        ]">
          {{ costType.name }}
    </td>
    <td class="text-center">
      <div data-step = '5' data-intro = 'For other cost types, enter an amount to be inflated out to the project start year' v-if="costType.editable">
        <input type="number" class="form-control input-sm text-center" v-model.number="costType.cost"/>
        <small>{{'$'+Math.round(costType.cost,1).toLocaleString()}}</small>
      </div>
      <div v-else>
        {{ '$' + Math.round(costType.inflated, 1).toLocaleString() }}
      </div>
    </td>
    <td class = 'text-center'>
      <div v-if="costType.grantable" class="input-group">
        <input type="number" class="form-control input-sm" v-model.number="costType.grants.federal" number /><br><small>{{'$'+costType.grants.federal.toLocaleString()}}</small>
        <span class="input-group-btn"></span>
        <input type="number" class="form-control input-sm" v-model.number="costType.grants.regional" number style="margin-left:-1px" /><br><small>{{'$'+costType.grants.regional.toLocaleString()}}</small>
        <span class="input-group-btn"></span>
        <input type="number" class="form-control input-sm" v-model.number="costType.grants.state" number style="margin-left:-2px" /><br><small>{{'$'+costType.grants.state.toLocaleString()}}</small>
      </div>
      <div v-else class="text-center disabled">
        <small>This cost type isn't grantable</small>
      </div>
    </td>
    <td class="text-center">
      {{ '$' + Math.round(costTotal, 1).toLocaleString()  }}
    </td>
  </tr>
</template>
<script>
import { calculateInflated } from '../vuex/actions'
import { getSelectedTreatment } from '../vuex/getters'
export default {

  vuex: {
    actions: {
      calculateInflated
    },
    getters: {
      treatment: getSelectedTreatment
    }
  },

  props: ['costType','title'],

  // If inflated, total should be inflated minus grants, else 0
  computed: {
    costTotal () {
      if (this.costType.editable) {
        this.costType.treatTotal = this.costType.inflated - this.costType.grants.federal - this.costType.grants.regional - this.costType.grants.state
        return this.costType.treatTotal
      } else if( this.costType.inflated ) {
        this.costType.treatTotal = this.costType.inflated - this.costType.grants.federal - this.costType.grants.regional - this.costType.grants.state
        return this.costType.treatTotal
      } else {
        return 0
      }
    }
  },

  // Watch cost. On change, trigger inflation function with changed cost from input
  watch: {
    'costType.cost': function (val) {

      this.calculateInflated(val, this.treatment.relativeStartYear, this.treatment.treatmentId, this.costType.name)
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
