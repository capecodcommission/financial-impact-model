<template>
  <div class="panel panel-primary" >
    <div class="panel-heading text-center">
      <tooltip effect = 'scale' placement = 'bottom' content = '<p>Select treatment technology below to view and manipulate cost-associated data.</p><p>Navigate to the next page by selecting and configuring each technology.</p>'>
        <button class = 'btn btn-primary'>?</button>
      </tooltip>
    </div>
    <div class="panel-body">
      <div id="treatment-sidebar">
        <div class="list-group">
          <template v-for="(index, treatment) in treatments">
            <div  v-bind:class="['list-group-item', index == treatmentIndex ? 'active' : '', treatment.stage == 1 ? 'visited' : '', treatment.stage == 2 ? 'visited1' : '']">
            <!-- WHY CAN'T WE CHANGE BELOW TO: <img v-bind:src="imgSrc"> -->
              <img src="{{ treatment.treatmentIcon | fullpath }}" @click="selectTreatment(treatment, $event)">
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
import { tooltip } from 'vue-strap'

export default {

  components: {

    tooltip
  },

  vuex: {

    actions: {

      changeTreatmentIndex
    },

    getters: {

      treatments: getTreatments,
      treatmentIndex: getTreatmentIndex
    }
  },

  data () {

    return {

      activeArr: []
    }
  },

  props: ['content'],

  filters: {

    fullpath ( icon ) {

      return 'http://2016.watershedmvp.org/images/SVG/' + icon
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
  &.visited {
    background-color: #80bfff;
  }
  &.visited1 {
    background-color: #ffb366;
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
