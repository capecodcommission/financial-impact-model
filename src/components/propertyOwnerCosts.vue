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
			</div>
		</div>
		<div class = 'container-fluid'>
			<div class = 'row'>
				<div class = 'col text-center'>
					<ul class = 'text-center'>
						<li><h1 class = 'display-1 text-center'><b>Scenario Cost Sharing</b></h1></li>
						<li><vue-chart :chart-type = "chartType" :chart-events = "chartEvents" :columns = "columns" :rows = "rows" :options = "options"></vue-chart></li>
						<li><button class = 'btn btn-primary pull-right' @click = 'excelExport'>export</button></li>
					</ul>
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
					'label': 'Primary'
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
					'label': 'Secondary'
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
			options: {
				width: 1380,
				height: 600,
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
					left: 500,
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

			var total = '<tr><td>' + 'Total:' + '</td>' + '<td>' + '$' + primary.toFixed(2) + '</td></tr>'
			var year = '<tr><td>' + 'Year:' + '</td>' + '<td>' + year + '</td></tr>'
			var title5 = '<tr><td>' + 'Title 5 Cost:' + '</td>' + '<td>' + '$' + t5 + '</td></tr>'

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

			var total = '<tr><td>' + 'Total:' + '</td>' + '<td>' + '$' + secondary.toFixed(2) + '</td></tr>'
			var year = '<tr><td>' + 'Year:' + '</td>' + '<td>' + year + '</td></tr>'
			var title5 = '<tr><td>' + 'Title 5 Cost:' + '</td>' + '<td>' + '$' + t5 + '</td></tr>'

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
</style>
