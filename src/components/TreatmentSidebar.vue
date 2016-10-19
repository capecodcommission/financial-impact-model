<template>
  <div class="panel panel-primary">
    <div class="panel-heading"><h3 class="panel-title">Treatments Techs</h3></div>
    <div class="panel-body">
      <div id="treatment-sidebar">
        <div class="list-group">
          <template v-for="(index, treatment) in treatments">
            <div
              v-bind:class="['list-group-item', index == treatmentIndex ? 'active' : '']"
            >
            <!-- WHY CAN'T WE CHANGE BELOW TO: <img v-bind:src="imgSrc"> -->
              <img
                src="{{ treatment.treatmentIcon | fullpath }}"
                @click="selectTreatment(treatment, $event)"
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { changeTreatmentIndex } from '../vuex/actions'
import { getTreatments, getTreatmentIndex } from '../vuex/getters'

export default {
  vuex: {
    actions: {
      changeTreatmentIndex
    },
    getters: {
      treatments: getTreatments,
      treatmentIndex: getTreatmentIndex
    }
  },

  filters: {
    fullpath ( icon ) {
      return 'http://www.cch2o.org/Matrix/icons/' + icon
    }
  },

  // Change treatmentindex on-click, activate css class
  methods: {

    // Activate action to change treatment index on selection of treatment icon
    selectTreatment ( treatment, event ) {
      let $treatment = $(event.target).parent()
      if(!$treatment.hasClass('active')) {
        $('#treatment-sidebar .list-group-item').removeClass('active')
        $treatment.addClass('active')

        this.changeTreatmentIndex( $('#treatment-sidebar .active').index() )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-group-item {
  background-color: #ECECEC;
  &.active {
    background-color: #337ab7;
  }
}
img {
  cursor: pointer;
  width: 100%;

  .active & {
    cursor: inherit;
  }
}
</style>
