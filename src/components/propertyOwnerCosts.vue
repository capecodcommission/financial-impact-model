<template>
<div class="treatment-detail-wrapper">
	<div class="panel panel-default">
		<div class="panel-heading text-center">
			<tooltip effect = 'scale' placement = 'bottom' content = 'This is your selected treatment technology'>
            	<button @click = 'gotm_Id' class = 'btn btn-primary'>{{ treatment.treatmentName }}</button>
          	</tooltip><br><br><br>
			<!-- BUTTONS -->
			<div class = "btn-group btn-group-justified">
				<div class="btn-group"><button v-link="{ name: 'treatmentDetail' }" class="btn btn-secondary">Treatment(s) Details</button></div>
				<div class="btn-group"><button v-link="{ name: 'financeTreatment' }" class="btn btn-secondary">Finance Treatment(s)</button></div>
				<div class="btn-group"><button v-link="{ name: 'pie' }" class="btn btn-secondary">Scenario Cost Sharing</button></div>
				<div class="btn-group"><button v-link="{ name: 'pairedbar' }" class="btn btn-secondary">Project & Financing Schedule</button></div>
				<div class="btn-group">
					<tooltip effect = 'scale' placement = 'bottom' content = 'This is your current page'>
						<button v-link="{ name: 'propertyOwnerCosts' }" class="btn btn-primary">Property Owner Costs</button>
					</tooltip>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
		<div class = 'jumbotron'>
			<div class = 'row'>
				<treatment-summary :treatment="treatment"></treatment-summary>
				<button @click = 'startIntro' class = 'btn btn-success pull-right'>Help</button>
			</div>
		</div>

		<div class = 'container-fluid'>
			<div class = 'row'>
				<div class = 'col-md-6 text-center'>
					<ul class = 'text-center'>
						<li>
							<tooltip effect = 'scale' placement = 'bottom' content = 'This chart displays the first-year cost breakdown of primary/secondary water users by town'>
								<h1 data-position = 'top' data-step = '4' data-intro = 'This chart displays the first-year cost breakdown of primary/secondary water users by town' class = 'display-1 text-center'><b>First Project Year Breakdown</b></h1>
							</tooltip>
						</li><br><br><br>
						<li class = 'pull-left'><b>Primary:</b></li>
						<li data-position = 'top' data-step = '6' data-intro = 'Here is the town breakdown' v-html = "rows1[0][2].substring(0,rows1[0][2].indexOf('Year'))"></li><br>
						<li class = 'pull-left'><b>Secondary:</b></li>
						<li v-html = "rows1[0][4].substring(0,rows1[0][4].indexOf('Year'))"></li><br>
						<li class = 'pull-left'><b>Title 5 Cost:    <br><br><br><br><br><br><br></b></li>
						<li class = 'pull-left' v-html = "rows1[0][4].substring(rows1[0][4].indexOf('Title 5 Cost:') + 18)"></li>
					</ul>
				</div>
				<div class = 'col-md-6 text-center'>
					<ul class = 'text-center'>
						<li>
							<tooltip effect = 'scale' placement = 'bottom' content = 'This chart displays the individual primary and secondary homeowner costs by town by year given selected financing types, durations, principle forgivess, taxes, and betterments, compared to the cost of a title 5 septic system over the same project and financing years'>
								<h1 data-position = 'top' data-step = '1' data-intro = 'This chart displays the individual primary and secondary homeowner costs by town by year given selected financing types, durations, principle forgivess, taxes, and betterments, compared to the cost of a title 5 septic system over the same project and financing years' class = 'display-1 text-center'><b>Scenario Cost Sharing</b></h1>
							</tooltip>
						</li>
						<li data-position = 'top' data-step = '2' data-intro = 'Each line represents the individual costs of a Primary or Secondary homeowner by town. A Primary water user is a year-round resident, while a Secondary water user is a seasonal resident'>
							<div v-if = "treatment.primsecarray">
								<vue-chart data-position = 'top' data-step = '3' data-intro = 'Mouse-over each line to see cost breakdown by town, compared to the cost of a title 5 system' :chart-type = "chartType" :chart-events = "chartEvents" :columns = "columns" :rows = "rows" :options = "options"></vue-chart>
							</div>
							<div v-else class = 'text-center disabled'>
								<small>No applicable Financing selected</small>
							</div>
						</li>
						<li><button class = 'btn btn-primary pull-right' @click = 'excelExport'>export</button></li>
					</ul>
				</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- <pre>{{ rows | json}}</pre> -->
</template>

<script>

import { getTreatments, getSelectedTreatment } from '../vuex/getters'
import { calculatetitle5inflated } from '../vuex/actions'
import PanelHeadingTitle from './PanelHeadingTitle'
import TreatmentSummary from './TreatmentSummary'
import { tooltip } from 'vue-strap'
import json2csv from 'nice-json2csv'
import {introJs} from '../../node_modules/intro.js/intro.js'

export default {

	vuex: {
		getters: {

			treatments: getTreatments,
			treatment: getSelectedTreatment
		},
		actions: {

			inflate: calculatetitle5inflated
		}
	},

	data () {
		return {

			// Chart options from vue-charts node package. (ChartsJS)
			chartType: "LineChart",
			columns: [
				{
					'type': 'number',
					'label': 'year'
				},
				{
					'type': 'number',
					'label': 'Primary Water User'
				},
				{ // Create custom html toolips for each line
					'type': 'string',
					'role': 'tooltip',
					'p': {
						'html': true
					}
				},
				{
					'type': 'number',
					'label': 'Secondary Water User'
				},
				{
					'type': 'string',
					'role': 'tooltip',
					'p': {
						'html': true
					}
				}
			],
			rows: [],
			rows1: [],
			options: {
				width: 800,
				height: 400,
				tooltip: {
					isHtml: true
				},
				vAxis: {
					title: 'Property Owner Cost (USD)',
					logScale: true
				},
				hAxis: {
					title: 'Year(s) From Current Year',
					viewWindow: { min: 0, max: 80 },
					ticks: []
				},
				chartArea: {
					width: '50%',
					height: '80%'
				}
			}
		}
	},

	ready() {

		var primSum = 0
		var secSum = 0
		var yearprim = 0
		var yearsec = 0
		var name = []
		var rows = this.rows
		var title5cost = 12880

		for (var i = 0; i < this.treatment.primsecarray.length; i++) {

			if (!(i % 5)) {

				this.options.hAxis.ticks.push([i])
			}

			for (var j = 0; j < this.treatment.primsecarray[i].Towns.length; j++) {

				// Intermediary array push: [["1","Sandwich",100,200],["1","Mashpee",100,200], etc...]
				name.push([
					this.treatment.primsecarray[i].year,
					this.treatment.primsecarray[i].Towns[j].name,
					this.treatment.primsecarray[i].Towns[j].primary,
					this.treatment.primsecarray[i].Towns[j].secondary
				])	

				yearprim += this.treatment.primsecarray[i].Towns[j].primary
				yearsec += this.treatment.primsecarray[i].Towns[j].secondary
			}
			
			// Push year, primary/secondary yearly totals, and custom tooltips (html tables)
			rows.push([
				this.treatment.primsecarray[i].year,
				yearprim,
				this.customTipprim(this.treatment.primsecarray[i].year,name, yearprim,this.treatment.primsecarray[i].titleFiveInflatedCost),
				yearsec,
				this.customTipsec(this.treatment.primsecarray[i].year,name, yearsec, this.treatment.primsecarray[i].titleFiveInflatedCost)
			])

			yearprim = 0
			yearsec = 0
		}

		const newrows = rows.find( (t) => t[1] )
		this.rows1 = []
		this.rows1.push(newrows)
		const index = rows.indexOf(newrows)
		rows.splice(index,1)

		this.options.hAxis.ticks.push([80])
	},

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

		// Create function to flatten 'name' array into html table for custom toolip by filtering name array by current year
		customTipprim: function(year,array, primary,t5) {

			var filtered = array.filter((el) => el[0] === year)
			
			var begin = '<div><table>'
			var end = '</table></div>'
			var data = []

			for (var i = 0; i < filtered.length; i++) {

				// [1] is town name, [2] is primary sum, [3] is secondary sum
				data += '<tr><td>' + filtered[i][1] + '</td>' + '<td><b> ' + '$' + filtered[i][2].toFixed(2) + '</b></td></tr>'
			}

			var total = '<tr><td>' + 'Total:' + '</td>' + '<td><b>' + '$' + primary.toFixed(2) + '</b></td></tr>'
			var year = '<tr><td>' + 'Year:' + '</td>' + '<td><b>' + year + '</b></td></tr>'
			var title5 = '<tr><td>' + 'Title 5 Cost:' + '</td>' + '<td><b>' + '$' + t5 + '</b></td></tr>'

			return begin + data + total + year + title5 + end
		},

		customTipsec: function(year,array, secondary, t5) {

			var filtered = array.filter((el) => el[0] === year)
			
			var begin = '<div><table>'
			var end = '</table></div>'
			var data = []

			for (var i = 0; i < filtered.length; i++) {

				data += '<tr><td>' + filtered[i][1] + '</td>' + '<td><b> ' + '$' + filtered[i][3].toFixed(2) + '</b></td></tr>'
			}

			var total = '<tr><td>' + 'Total:' + '</td>' + '<td><b>' + '$' + secondary.toFixed(2) + '</b></td></tr>'
			var year = '<tr><td>' + 'Year:' + '</td>' + '<td><b>' + year + '</b></td></tr>'
			var title5 = '<tr><td>' + 'Title 5 Cost:' + '</td>' + '<td><b>' + '$' + t5 + '</b></td></tr>'

			return begin + data + total + year + title5 + end
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

	      for (var i = 0; i < this.treatments.length; i++) {

	        for (var j = 0; j < this.treatments[i].costTypes.length; j++) {

	          arr.push(this.JSONflatten(this.treatments[i].costTypes[j]))
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
	    },

	    startIntro() {

	      introJs().setOption('showProgress', true).start()
	    }		
	},

	watch: {
		'treatment.treatmentId': function (val) {

			var primSum = 0
			var secSum = 0
			var yearprim = 0
			var yearsec = 0
			var name = []
			var rows = this.rows = []
			this.options.hAxis.ticks = []

			for (var i = 0; i < this.treatment.primsecarray.length; i++) {

				if (!(i % 5)) {

					this.options.hAxis.ticks.push([i])
				}

				for (var j = 0; j < this.treatment.primsecarray[i].Towns.length; j++) {

					// Intermediary array push: [["1","Sandwich",100,200],["1","Mashpee",100,200], etc...]
					name.push([
						this.treatment.primsecarray[i].year,
						this.treatment.primsecarray[i].Towns[j].name,
						this.treatment.primsecarray[i].Towns[j].primary,
						this.treatment.primsecarray[i].Towns[j].secondary
					])	

					yearprim += this.treatment.primsecarray[i].Towns[j].primary
					yearsec += this.treatment.primsecarray[i].Towns[j].secondary
				}
				
				// Push year, primary/secondary yearly totals, and custom tooltips (html tables)
				rows.push([
					this.treatment.primsecarray[i].year,
					yearprim,
					this.customTipprim(this.treatment.primsecarray[i].year,name, yearprim, this.treatment.primsecarray[i].titleFiveInflatedCost),
					yearsec,
					this.customTipsec(this.treatment.primsecarray[i].year,name, yearsec, this.treatment.primsecarray[i].titleFiveInflatedCost)
				])

				yearprim = 0
				yearsec = 0
			}

			const newrows = rows.find( (t) => t[1] )
			this.rows1 = []
			this.rows1.push(newrows)
			const index = rows.indexOf(newrows)
			rows.splice(index,1)
		}
	},

	components: {
		'panel-heading-title': PanelHeadingTitle,
		'treatment-summary': TreatmentSummary,
		'tooltip': tooltip
	}
}

</script>

<style>
td {
  padding: 3px 0;
}
table {
	border-collapse: separate;
	border-spacing: 10px 0;
}
ul {
  list-style-type: none;
}	
li {
	margin: 10px 0;
}
</style>
