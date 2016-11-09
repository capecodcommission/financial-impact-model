<template>
<div class="treatment-detail-wrapper">
	<div class="panel panel-default">
		<div class="panel-heading">
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
		<div class = 'container-fluid'>
			<div class = 'row'>
				<div class = 'jumbotron text-center'>
					<h1 class = 'display-1'><b>Scenario Cost Sharing</b></h1>
					<vue-chart :chart-type = "chartType" :chart-events = "chartEvents" :columns = "columns" :rows = "rows" :options = "options"></vue-chart>
				</div>
			</div>
		</div>
		<div class = 'jumbotron'>
			<div class = 'row'>
				<treatment-summary :treatment="treatment"></treatment-summary>
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
				},
				{
					'type': 'number',
					'label': 'Title 5 Liability'
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
				width: 1500,
				height: 800,
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
					this.treatment.primsecarray[i].Towns[j].secondary,
					this.treatment.primsecarray[i].titleFiveInflatedCost
				])	

				yearprim += this.treatment.primsecarray[i].Towns[j].primary
				yearsec += this.treatment.primsecarray[i].Towns[j].secondary
			}
			
			// Push year, primary/secondary yearly totals, and custom tooltips (html tables)
			rows.push([
				this.treatment.primsecarray[i].year,
				yearprim,
				this.customTipprim(this.treatment.primsecarray[i].year,name, yearprim),
				yearsec,
				this.customTipsec(this.treatment.primsecarray[i].year,name, yearsec),
				this.treatment.primsecarray[i].titleFiveInflatedCost,
				this.customTipt5(this.treatment.primsecarray[i].year,name,this.treatment.primsecarray[i].titleFiveInflatedCost)
			])

			yearprim = 0
			yearsec = 0
		}

		this.options.hAxis.ticks.push([80])
	},

	methods: {

		// Create function to flatten 'name' array into html table for custom toolip by filtering name array by current year
		customTipprim: function(year,array, primary) {

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

			return begin + data + total + year + end
		},

		customTipsec: function(year,array, secondary) {

			var filtered = array.filter((el) => el[0] === year)
			var begin = '<div><table>'
			var end = '</table></div>'
			var data = []

			for (var i = 0; i < filtered.length; i++) {

				data += '<tr><td>' + filtered[i][1] + '</td>' + '<td><b> ' + '$' + filtered[i][3].toFixed(2) + '</b></td></tr>'
			}

			var total = '<tr><td>' + 'Total:' + '</td>' + '<td>' + '$' + secondary.toFixed(2) + '</td></tr>'
			var year = '<tr><td>' + 'Year:' + '</td>' + '<td>' + year + '</td></tr>'

			return begin + data + total + year + end
		},
		customTipt5: function(year,array,title5cost) {

			var filtered = array.filter((el) => el[0] === year)
			var begin = '<div><table>'
			var end = '</table></div>'
			var data = []

			var total = '<tr><td>' + 'Total:' + '</td>' + '<td><b>' + '$' + title5cost.toFixed(2) + '</td></tr>'
			var year = '<tr><td>' + 'Year:' + '</td>' + '<td>' + year + '</td></tr>'

			return begin + data + total + year + end
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
						this.treatment.primsecarray[i].Towns[j].secondary,
						this.treatment.primsecarray[i].titleFiveInflatedCost
					])	

					yearprim += this.treatment.primsecarray[i].Towns[j].primary
					yearsec += this.treatment.primsecarray[i].Towns[j].secondary
				}
				
				// Push year, primary/secondary yearly totals, and custom tooltips (html tables)
				rows.push([
					this.treatment.primsecarray[i].year,
					yearprim,
					this.customTipprim(this.treatment.primsecarray[i].year,name, yearprim),
					yearsec,
					this.customTipsec(this.treatment.primsecarray[i].year,name, yearsec),
					this.treatment.primsecarray[i].titleFiveInflatedCost,
					this.customTipt5(this.treatment.primsecarray[i].year,name,this.treatment.primsecarray[i].titleFiveInflatedCost)
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
