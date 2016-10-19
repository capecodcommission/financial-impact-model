<template>
<div class="treatment-detail-wrapper">
	<div class="panel panel-default">
		<div class="panel-heading">
			<!-- BUTTONS -->
			<div class = "btn-group btn-group-justified">
				<div class="btn-group"><button v-link="{ name: 'treatmentDetail' }" class="btn btn-primary">Treatment(s) Details</button></div>
				<div class="btn-group"><button v-link="{ name: 'financeTreatment' }" class="btn btn-primary">Finance Treatment(s)</button></div>
				<div class="btn-group"><button v-link="{ name: 'pie' }" class="btn btn-primary">Scenario Cost Sharing</button></div>
				<div class="btn-group"><button v-link="{ name: 'pairedbar' }" class="btn btn-primary">Project & Financing Schedule</button></div>
			</div>
			<div class="clearfix"></div>
		</div>
		<div class = 'container-fluid'>
			<div class = 'row'>
				<div class = 'jumbotron text-center'>
					<h1 class = 'display-1'><b>Scenario Cost Sharing</b></h1>
					<vue-chart :chart-type = "chartType" :columns = "columns" :rows = "rows" :options = "options"></vue-chart>
				</div>
			</div>
		</div>
		<div class = 'container-fluid'>
			<div class = 'jumbotron text-center'>
				<h1 class = 'display-1'>Total Scenario Cost <small>(Including inflation & financing)</small> <br> {{ totalCost | currency }}</h1><br>
				<ul class = "text-left">
					<li>Total Federal:<b>{{ totalFed | currency}}</b></li>
					<li>Total State:<b>{{ totalState | currency}}</b></li>
					<li>Total Regional:<b>{{ totalReg | currency}}</b></li>
					<li>Total Principal Forgiveness:<b>{{ totalPrinFor | currency}}</b></li>
					<li>Total Property Taxes / Fees:<b>{{ totalProp | currency}}</b></li>
					<li>Total Betterment:<b>{{ totalBtrmnt | currency}}</b></li>
					<li>Total Unaccounted For:<b>{{ totalUncctFor | currency}}</b></li>
				</ul>
			</div>
		</div>
		<div class = 'jumbotron'>
			<div class = 'row'>
				<treatment-summary :treatment="treatment"></treatment-summary>
			</div>
		</div>
	</div>
</div>
</template>

<script>

import { getTreatments, getSelectedTreatment } from '../vuex/getters'
import { primarysecondaryArray } from '../vuex/actions'
import PanelHeadingTitle from './PanelHeadingTitle'
import TreatmentSummary from './TreatmentSummary'

export default {

	vuex: {
		getters: {
			treatments: getTreatments,
			treatment: getSelectedTreatment
		},
		actions: {
			primarysecondaryArray
		}
	},

	data () {
		return {

			// Chart options from vue-charts node package. (ChartsJS)
			chartType: 'PieChart',
			columns: [
				{
					'type': 'string',
					'label': 'Cost Sharing'
				},
				{
					'type': 'number',
					'label': 'Cost'
				}
			],
			rows: [
				['Federal', 6000000],
				['State', 6050000],
				['Regional', 6200000],
				['Property Tax / Fees', 5000000],
				['Betterments', 3000000],
				['Principal Forgiveness', 3000000],
				['Unaccounted For', 3000000]
			],
			options: {
				width: 1500,
				height: 800,
				tooltipTemplate: "<% if (label) {%><%=label %>: <%}%><%= value + ' $' %>"
			}
        }
	},

	computed: {

		// Sum of sumofannualcapitaltotals for all cost types
		totalCost () {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					if (this.treatments[i].costTypes[j].annualized.sumOfAnnualCapitalTotals) {
						sum += this.treatments[i].costTypes[j].annualized.sumOfAnnualCapitalTotals
					}
				}
			}
			return sum
		},

		// Sum of Federal grants for all cost type
		totalFed () {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					if (this.treatments[i].costTypes[j].grants.federal) {
						sum += this.treatments[i].costTypes[j].grants.federal
					}
				}
			}
			this.rows[0][1] = sum
			return sum
		},

		// Sum of state grants for all cost type
		totalState () {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					if (this.treatments[i].costTypes[j].grants.state) {
						sum += this.treatments[i].costTypes[j].grants.state
					}
				}
			}
			this.rows[1][1] = sum
			return sum
		},

		// Total regional grants for all cost types
		totalReg () {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					if (this.treatments[i].costTypes[j].grants.regional) {
						sum += this.treatments[i].costTypes[j].grants.regional
					}
				}
			}
			this.rows[2][1] = sum
			return sum
		},

		// Sum of principal multiplied by principal forgiveness for each cost type
		totalPrinFor() {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					for (var k = 0; k < this.treatments[i].costTypes[j].annualizedarray.length; k++) {
						sum += this.treatments[i].costTypes[j].annualizedarray[k].principal * this.treatments[i].costTypes[j].prinFor
					}
				}
			}
			this.rows[5][1] = sum
			return sum
		},

		// Sum of sumofannualcapitaltotals multiplied by percentage of property taxes
		totalProp () {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					if (this.treatments[i].costTypes[j].annualized.sumOfAnnualCapitalTotals) {
						sum += this.treatments[i].costTypes[j].annualized.sumOfAnnualCapitalTotals * this.treatments[i].costTypes[j].addtlpytyps.Property_TaxesorFees
					} else {
						sum += this.treatments[i].costTypes[j].treatTotal * this.treatments[i].costTypes[j].addtlpytyps.Property_TaxesorFees
					}
				}
			}
			this.rows[3][1] = sum
			return sum
		},

		// Sum of sumofannualcapitaltotals multiplied by percentage of betterments
		totalBtrmnt () {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					if (this.treatments[i].costTypes[j].annualized.sumOfAnnualCapitalTotals) {
						sum += this.treatments[i].costTypes[j].annualized.sumOfAnnualCapitalTotals * this.treatments[i].costTypes[j].addtlpytyps.Betterments
					} else {
						sum += this.treatments[i].costTypes[j].treatTotal * this.treatments[i].costTypes[j].addtlpytyps.Betterments
					}
				}
			}
			this.rows[4][1] = sum
			return sum
		},

		// Sum of remaining costs unaccounted for by property taxes or betterments
		totalUncctFor () {
			var sum = 0
			for (var i = 0; i < this.treatments.length; i++) {
				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					if (this.treatments[i].costTypes[j].finTotal) {
						sum += this.treatments[i].costTypes[j].finTotal
					}
				}
			}
			this.rows[6][1] = sum
			return sum
		}
	},

	ready() {
	},

	components: {
		'panel-heading-title': PanelHeadingTitle,
		'treatment-summary': TreatmentSummary
	}
}

</script>

<style></style>
