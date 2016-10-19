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
				<div class="btn-group"><button v-link="{ name: 'propertyOwnerCosts' }" class="btn btn-primary">Property Owner Costs</button></div>
			</div>
			<div class="clearfix"></div>
		</div>
		<!-- CHART -->
		<div class = 'container-fluid'>
			<div class = 'row'>
				<div class = 'jumbotron text-center'>
					<h1 class = 'display-1'><b>Project & Financing Schedule</b></h1>
					<table class = 'table' style = "width: 500px; margin: 10px auto;">
						<colgroup>
							<col class = 'col-md-1'>
							<col class = 'col-md-1'>
						</colgroup>
						<tbody>
							<tr>
								<td><vue-chart :chart-type = "chartType" :columns = "columns1" :rows = "rows1" :options = "options1"></vue-chart></td>
							</tr>
							<tr>
								<td><vue-chart :chart-type = "chartType" :columns = "columns2" :rows = "rows2" :options = "options2"></vue-chart></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class = 'container-fluid'>
			<table class="table">
				<colgroup>
					<col class="col-md-1">
					<col class="col-md-1">
					<col class="col-md-1">
					<col class="col-md-1">
					<col class="col-md-1">
					<col class="col-md-1">
					<col class="col-md-1">
				</colgroup>
				<thead>
					<tr>
						<th class="text-center">Treatment ID (treatmentId)</th>
						<th class="text-center">Treatment Name (treatmentName)</th>
						<th class="text-center">Treatment Type ID (treatmentTypeId)</th>
						<th class="text-center">Project Start Year (relativeStartYear)</th>
						<th class="text-center">Project End Year (relativeStartYear + 20)</th>
						<th class="text-center">Finance Start Year (relativeStartYear)</th>
						<th class="text-center">Finance End Year (relativeStartYear + finDur)</th>
						<th class="text-center">Cost Type (costTypes.name)</th>
					</tr>
				</thead>
				<tbody>
					<template v-for="treatment in treatments">
						<tr v-for="(index, costType) in treatment.costTypes | filterBy 'true' in 'financeable'">
						<td>{{ treatment.treatmentId }}</td>
						<td>{{ treatment.treatmentName }}</td>
						<td>{{ treatment.treatmentTypeId }}</td>
						<td>{{ treatment.relativeStartYear }}</td>
						<td>{{ treatment.duration }}</td>
						<td>{{ treatment.relativeStartYear }}</td>
						<td>{{ costType.finDur }}</td>
						<td>{{ costType.name }}</td>
					</tr>
				</template>
			</tbody>
		</table>
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
import { calculatetitle5inflated } from '../vuex/actions'
import PanelHeadingTitle from './PanelHeadingTitle'
import TreatmentSummary from './TreatmentSummary'

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
			chartType: 'BarChart',
			columns1: [
				{
					'type': 'string',
					 'label': 'Treatment Type ID'
				},
				{
					'type': 'number',
					'label': 'Project Start Year'
				},
				{
					'type': 'number',
					'label': 'Project Duration'
				},
				{
					'type': 'number',
					'role': 'annotation'
				}
			],
			columns2: [
				{
					'type': 'string',
					 'label': 'Treatment Type ID'
				},
				{
					'type': 'number',
					'label': 'Finance Start Year'
				},
				{
					'type': 'number',
					'label': 'Finance Duration'
				},
				{
					'type': 'number',
					'role': 'annotation'
				}
			],
			rows1: [],
			rows2: [],
			options1: {
				legend: {
					position: 'none'
				},
				width: 700,
				height: 400,
				isStacked: true,
				colors: ['#ffffff', 'blue'],
				vAxis: {title: 'Technology ID'},
				hAxis: {
					title: 'Year(s) From Current Year',
					viewWindow: { min: 0, max: 50 },
					ticks: []
				}
			},
			options2: {
				legend: {
					position: 'none'
				},
				width: 700,
				height: 400,
				isStacked: true,
				colors: ['#ffffff', 'blue'],
				vAxis: {title: 'Cost Type'},
				hAxis: {
					title: 'Year(s) From Current Year',
					viewWindow: { min: 0, max: 80 },
					ticks: []
				}
			}
		}
	},

	ready() {
		var row1 = this.rows1
		var row2 = this.rows2
		var title5cost = 12880

		for (var k = 0; k < this.treatment.primsecarray.length; k++) {

			if (!(k % 5)) {

				this.options1.hAxis.ticks.push([k])
				this.options2.hAxis.ticks.push([k])
			}

			// this.inflate(this.treatment.treatmentId,title5cost,this.treatment.primsecarray.Years[k].year)
		}

		
			row1.push([
				this.treatment.treatmentTypeId.toString(),
				this.treatment.relativeStartYear,
				this.treatment.duration,
				this.treatment.relativeStartYear + this.treatment.duration
			])
		
		for (var j = 0; j < this.treatment.costTypes.length; j++) {1
			row2.push([
				this.treatment.costTypes[j].name,
				this.treatment.relativeStartYear,
				Number(this.treatment.costTypes[j].finDur),
				this.treatment.relativeStartYear + Number(this.treatment.costTypes[j].finDur)
			])
		}
		this.options2.hAxis.ticks.push([80])

		for (var i = 0; i < this.treatment.primsecarray.length; i++) {
			if (Object.keys(this.treatment.primsecarray[i].Towns).length == 0) {
				this.treatment.primsecarray[i].Towns.push({
					name: '',
					primary: 0.0,
					secondary: 0.0
				})
			}
		}
	},

	watch: {
		'treatment.treatmentId': function (val) {
			var row1 = this.rows1 = []
			this.rows2 = []
			var row2 = this.rows2

			var title5cost = 12880

			row1.push([
				this.treatment.treatmentTypeId.toString(),
				this.treatment.relativeStartYear,
				this.treatment.duration,
				this.treatment.relativeStartYear + this.treatment.duration
			])

			// for (var k = 0; k < this.treatment.primsecarray.Years.length; k++) {

			// 	this.inflate(this.treatment.treatmentId,title5cost,this.treatment.primsecarray.Years[k].year)
			// }

			for (var i = 0; i < this.treatment.costTypes.length; i++) {
				row2.push([
					this.treatment.costTypes[i].name,
					this.treatment.relativeStartYear,
					Number(this.treatment.costTypes[i].finDur),
					this.treatment.relativeStartYear + Number(this.treatment.costTypes[i].finDur)
				])
			}
		}
	},

	components: {
		'panel-heading-title': PanelHeadingTitle,
		'treatment-summary': TreatmentSummary
		// 'cost-type-table-row-finance': CostTypeTableRowFinance,
		// 'cost-type-table-row-final-paying': CostTypeTableRowFinalPaying
	}
}

</script>

<style></style>
