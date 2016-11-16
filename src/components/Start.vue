<template>
<div class = 'jumbotron full vertical-center'>
  <div class = 'container text-center'>
      <img src="http://www.capecodcommission.org/gfx/home-logo.jpg" class="img-fluid" alt="Responsive image">
    <!-- <h1><b>Cape Cod Commission</b></h1> -->
    <h2><b>Financial Impact Model</b></h2>
    <br>
    <br>
    <h4>Enter <a href = 'http://2016.watershedmvp.org/login'>Scenario ID</a></h4>
    <div class = 'row'>
      <div class="col-lg-4 col-lg-offset-4">
        <typeahead type="number" class="text-center" placeholder='100' aria-describedby="sizing-addon2" :on-hit = 'fetchScenario' :data = 'scenidArr'></typeahead>
        <button class = 'btn btn-primary' @click = 'fetchScenario' :data = 'scenidArr'>Enter</button>
        <alert :show.sync = "treatments.length === 0" type = "danger" duration="5000" width="400px" dismissable>
            <span class="glyphicon glyphicon-flag"></span>
            <strong>Oops!</strong>
            <h3>No Treatments found. Enter valid scenario id to continue</h3>
      </alert>
      </div>
    </div><br>
    
    <div class = 'row text-center'>
      <button type = "button" class = "btn btn-success" id = 'disclaimer' @click = "toggle1">Disclaimer</button>
      <div id="popup" v-show = "active1">Cape Cod Commission2 is consectetur adipiscing elit. Maecenas dolor tortor, convallis vitae imperdiet at, mollis vitae felis. Sed sed felis vel risus bibendum semper et vel lorem. Proin et dapibus nunc, non accumsan risus. Praesent nibh nibh, aliquet id arcu id, euismod lobortis sem. Etiam et tempor neque, sed congue ipsum. Nullam arcu velit, accumsan quis eros vel, scelerisque semper sem. Quisque posuere tempus dui sed tempor. Nunc venenatis feugiat nisi sed molestie. Vivamus congue venenatis volutpat. Proin vulputate elit mi, eu mollis dui feugiat vitae. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed dui ipsum, blandit dignissim condimentum eu, tincidunt et metus.
      </div>
      <button type="button" class="btn btn-success" id = 'about' @click = "toggle2">About</button>
      <div id="popup1" v-show = "active2">The Cape Cod Commission developed the WatershedMVP application for professionals, municipal officials and community members in order to assist in creating the most cost-effective and efficient solutions to Cape Cod’s wastewater problem. The application is an informational resource intended to provide regional estimates for planning purposes. WatershedMVP is an initiative of the Cape Cod Commission’s Strategic Information Office (SIO). To learn more about the WatershedMVP application and the Cape Cod Commission and its SIO, please <a href="http://www.capecodcommission.org/index.php?id=205&maincatid=2">Contact Us</a>
      </div>
      
    </div>
  </div>
</div>
<!-- <pre>{{treatments | json}}</pre> -->

</template>

<script>

import { loadScenario } from '../vuex/actions'
import { getTreatments } from '../vuex/getters'
import { typeahead, alert } from 'vue-strap'

export default {

  components: {

    typeahead,
    alert
  },

  data () {

    return {

      active1: false,
      active2: false,
      scenarioId: '',
      scenidArr: [
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '26',
      '29',
      '31',
      '32',
      '33',
      '34',
      '35',
      '37',
      '38',
      '42',
      '43',
      '46',
      '47',
      '48',
      '50',
      '53',
      '54',
      '56',
      '58',
      '62',
      '63',
      '64',
      '65',
      '66',
      '67',
      '70',
      '71',
      '72',
      '77',
      '78',
      '79',
      '80',
      '81',
      '82',
      '83',
      '84',
      '85',
      '86',
      '89',
      '90',
      '91',
      '92',
      '93',
      '95',
      '98',
      '99',
      '100',
      '101',
      '102',
      '103',
      '104',
      '105',
      '106',
      '107',
      '108',
      '109',
      '110',
      '112',
      '113',
      '114',
      '116',
      '119',
      '120',
      '121',
      '123',
      '124',
      '125',
      '127',
      '128',
      '129',
      '130',
      '131',
      '132',
      '133',
      '134',
      '135',
      '136',
      '137',
      '138',
      '139',
      '140',
      '141',
      '142',
      '143',
      '144',
      '146',
      '147',
      '148',
      '149',
      '150',
      '151',
      '152',
      '153',
      '154',
      '155',
      '156',
      '157',
      '158',
      '159',
      '160',
      '161',
      '162',
      '163',
      '165',
      '166',
      '167',
      '169',
      '170',
      '171',
      '172',
      '173',
      '176',
      '177',
      '180',
      '181',
      '188',
      '189',
      '190',
      '192',
      '194',
      '196',
      '197',
      '198',
      '199',
      '201',
      '202',
      '203',
      '204',
      '209',
      '210',
      '211',
      '212',
      '213',
      '214',
      '215',
      '216',
      '217',
      '218',
      '219',
      '220',
      '221',
      '222',
      '223',
      '224',
      '225',
      '227',
      '228',
      '229',
      '231',
      '232',
      '234',
      '235',
      '237',
      '239',
      '240',
      '241',
      '242',
      '243',
      '244',
      '246',
      '247',
      '248',
      '249',
      '250',
      '251',
      '252',
      '253',
      '255',
      '256',
      '257',
      '258',
      '260',
      '261',
      '262',
      '263',
      '265',
      '277',
      '278',
      '280',
      '281',
      '284',
      '286',
      '287',
      '288',
      '289',
      '290',
      '291',
      '292',
      '293',
      '294',
      '295',
      '296',
      '297',
      '306',
      '309',
      '310',
      '311',
      '312',
      '349',
      '352',
      '353',
      '354',
      '355',
      '356',
      '357',
      '358',
      '362',
      '365',
      '366',
      '367',
      '368',
      '372',
      '385',
      '386',
      '387',
      '388',
      '389',
      '390',
      '391',
      '392',
      '393',
      '394',
      '395',
      '397',
      '409',
      '418',
      '419',
      '421',
      '422',
      '429',
      '430',
      '431',
      '432',
      '433',
      '434',
      '435',
      '436',
      '437',
      '439',
      '441',
      '442',
      '446',
      '447',
      '448',
      '450',
      '452',
      '453',
      '462',
      '463',
      '464',
      '468',
      '471',
      '472',
      '475',
      '478',
      '486',
      '487',
      '488',
      '490',
      '491',
      '492',
      '496',
      '497',
      '499',
      '500',
      '501',
      '502',
      '503',
      '504',
      '506',
      '507',
      '508',
      '510',
      '513',
      '514',
      '515',
      '521',
      '523',
      '524',
      '532',
      '536',
      '540',
      '544',
      '549',
      '550',
      '551',
      '552',
      '553',
      '554',
      '555',
      '563',
      '564',
      '565',
      '566',
      '568',
      '569',
      '571',
      '582',
      '585',
      '611',
      '613',
      '630',
      '636',
      '637',
      '638',
      '639',
      '640',
      '641',
      '642',
      '645',
      '647',
      '648',
      '649',
      '650',
      '651',
      '653',
      '654',
      '655',
      '657',
      '658',
      '659',
      '660',
      '661',
      '662',
      '663',
      '664',
      '665',
      '666',
      '668',
      '669',
      '670',
      '671',
      '672',
      '673',
      '674',
      '675',
      '676',
      '684',
      '687',
      '688',
      '689',
      '692',
      '693',
      '694',
      '695',
      '697',
      '699',
      '700',
      '701',
      '702',
      '703',
      '704',
      '705',
      '706',
      '707',
      '708',
      '709',
      '710',
      '711',
      '712',
      '713',
      '714',
      '715',
      '716',
      '717',
      '719',
      '720',
      '721',
      '722',
      '723',
      '724',
      '726',
      '728',
      '729',
      '730',
      '731',
      '733',
      '734',
      '735',
      '736',
      '737',
      '738',
      '740',
      '743',
      '744',
      '750',
      '751',
      '752',
      '753',
      '754',
      '755',
      '756',
      '757',
      '758',
      '759',
      '760',
      '761',
      '762',
      '763',
      '767',
      '769',
      '1769',
      '1770',
      '1771',
      '1772',
      '1773',
      '1774',
      '1775',
      '1776',
      '1778',
      '1779',
      '1780',
      '1781',
      '1782',
      '1783',
      '1784',
      '1785',
      '1788',
      '1789',
      '1809',
      '1812',
      '1840',
      '1845',
      '1846',
      '1847',
      '1848']
    }
  },

  vuex: {

    actions: {

      loadScenario
    },

    getters: {

      treatments: getTreatments
    }
  },

  methods: {
    
    // Activate ScenarioView.vue with nested route TreatmentDetail.vue using scenarioId passed from html input to data above
    fetchScenario (x) {

      this.scenarioId = x

      this.loadScenario(x)
    },

    // Change acive state from TRUE to FALSE, shown/hidden via respective v-show
    toggle1 () {

      this.active1 = !this.active1
    },

    toggle2 () {

      this.active2 = !this.active2
    }
  },

  watch: {

    'treatments': function (val) {

      if (val.length === 0) {

      } else {

        this.$router.go('/scenario/' + this.scenarioId + '/treatmentsDetails')
      }
    }
  }
}

</script>

<style lang="scss">

.scenario-picker {
  text-align: center;

  .form-control {
    text-align: center;
  }
}

</style>
