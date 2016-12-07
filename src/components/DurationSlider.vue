<template>
  <input id="project-slider"
    type="text"
    value="{{ sliderValue }}"
    data-slider-id='projectSlider'
    data-slider-min="{{ min }}"
    data-slider-max="{{ max }}"
    data-slider-step="1"
    data-slider-value="[{{ sliderValue }}]"
    data-duration="{{ duration }}"
    data-slider-ticks = "[1,10,20,30,40,50]"
    data-slider-ticks-labels = "[1,10,20,30,40,50]"
    />
</template>
<script>
  import Slider from 'bootstrap-slider'
  export default {
    data () {
      return {
        slider: null
      }
    },

    props: ['min', 'max', 'relativeStartYear', 'duration'],

    computed: {

      // set duration to 20, return array of treatment parameters
      sliderValue () {
        this.duration = 20
        return [ this.relativeStartYear , this.relativeStartYear + this.duration ]
      }
    },

    methods: {

      // Dispatch range-change function on slide
      notify (slider) {
        this.$dispatch('range-change', slider)
      }
    },

    watch: {

      // Watch property change
      'sliderValue': {
        handler (val, oldVal) {
          this.slider.setValue(val, true, false)
        }
      }
    },

    ready () {

      // Instantiate bootstrap-slider
      let self = this
      self.slider = new Slider('#project-slider', {
      	formatter: function(value) {
          if (value[1] - value[0] == 20){
            return 'Start on year ' + value[0] + ' to year ' + value[1]
          } 
      	}
      })

      // Notify slider that sliding has stopped, to update new slider value
      self.slider.on("slideStop", function(slideEvt){
        let slider = slideEvt
        self.notify(slider)
      })
    }

  }
</script>
<style lang="scss">
@import '../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css';

.slider {
  &.slider-horizontal {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
