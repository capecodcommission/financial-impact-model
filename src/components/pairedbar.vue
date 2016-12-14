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
				<div class="btn-group">
					<tooltip effect = 'scale' placement = 'bottom' content = 'This is your current page'>
						<button v-link="{ name: 'pairedbar' }" class="btn btn-primary">Project & Financing Schedule</button>
					</tooltip>
				</div>
				<div class="btn-group"><button v-link="{ name: 'propertyOwnerCosts' }" class="btn btn-secondary">Property Owner Costs</button></div>
			</div>
			<div class="clearfix"></div>
		</div>
		<!-- CHART -->
		<div class = 'jumbotron'>
			<div class = 'row'>
				<treatment-summary :treatment="treatment"></treatment-summary>
			</div>
		</div>
		<div class = 'container-fluid'>
			<div class = 'row'>
				<div class = 'col-md-6 text-center'>
					<ul class = 'text-center'>
						<li>
							<h1 class = 'display-1'>
								<tooltip effect = 'scale' placement = 'bottom' content = 'This chart displays the project timeline for all treatments'>
									<b>Project Schedule</b>
								</tooltip>
							</h1>
						</li>
						<li>
							<!-- <img style = "width: 10%; height: 10%" src="{{ treatment.treatmentIcon | fullpath }}"> -->
							<vue-chart :chart-type = "chartType" :columns = "columns1" :rows = "rows1" :options = "options1"></vue-chart>
						</li>
					</ul>
				</div>
				<div class = 'col-md-6 text-center'>	
					<ul class = 'text-center'>
						<li>
							<h1 class = 'display-1'>
								<tooltip effect = 'scale' placement = 'bottom' content = 'This chart displays the financing timeline for each financed cost type for all treatments'>
									<b>Financing Schedule</b>
								</tooltip>
							</h1>
						</li>	
						<li><vue-chart :chart-type = "chartType" :columns = "columns2" :rows = "rows2" :options = "options2"></vue-chart></li>
						<li><button class = 'btn btn-primary pull-right' @click = 'excelExport'>export</button></li>
					</ul>
				</div>
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

	filters: {

	    fullpath ( icon ) {

	      return 'http://2016.watershedmvp.org/images/SVG/' + icon
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
				width: 800,
				height: 400,
				isStacked: true,
				colors: ['#ffffff', 'blue'],
				vAxis: {title: 'Treatment Name'},
				hAxis: {
					title: 'Year(s) From Current Year',
					viewWindow: { min: 0, max: 80 },
					ticks: []
				},
				chartArea: {
					width: "50%",
					height: "80%"
				}
			},
			options2: {
				legend: {
					position: 'none'
				},
				width: 800,
				height: 400,
				isStacked: true,
				colors: ['#ffffff', 'blue'],
				vAxis: {title: 'Cost Type'},
				hAxis: {
					title: 'Year(s) From Current Year',
					viewWindow: { min: 0, max: 80 },
					ticks: []
				},
				chartArea: {
					width: "40%",
					height: "80%"
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

			for (var i = 0; i < this.treatments.length; i++) {

				row1.push([
					'(' + this.treatments[i].treatmentId.toString() + ')' + ' ' + this.treatments[i].treatmentName.toString(),
					this.treatments[i].relativeStartYear,
					this.treatments[i].duration,
					this.treatments[i].relativeStartYear + this.treatments[i].duration
				])

				for (var j = 0; j < this.treatments[i].costTypes.length; j++) {
					
					if (this.treatments[i].costTypes[j].financeable & this.treatments[i].costTypes[j].finDur > 1) {

						row2.push([
							'(' + this.treatments[i].treatmentId.toString() + ')' + ' ' + this.treatments[i].costTypes[j].name,
							this.treatments[i].relativeStartYear,
							Number(this.treatments[i].costTypes[j].finDur),
							this.treatments[i].relativeStartYear + Number(this.treatments[i].costTypes[j].finDur)
						])
					}
				}
			}
		
		// for (var j = 0; j < this.treatment.costTypes.length; j++) {

		// 	if (this.treatment.costTypes[j].financeable & this.) {

		// 		row2.push([
		// 			this.treatment.costTypes[j].name,
		// 			this.treatment.relativeStartYear,
		// 			Number(this.treatment.costTypes[j].finDur),
		// 			this.treatment.relativeStartYear + Number(this.treatment.costTypes[j].finDur)
		// 		])
		// 	}
		// }
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
			// var row1 = this.rows1 = []
			// this.rows2 = []
			// var row2 = this.rows2

			// var title5cost = 12880

			// row1.push([
			// 	this.treatment.treatmentTypeId.toString(),
			// 	this.treatment.relativeStartYear,
			// 	this.treatment.duration,
			// 	this.treatment.relativeStartYear + this.treatment.duration
			// ])

			// for (var i = 0; i < this.treatment.costTypes.length; i++) {
			// 	row2.push([
			// 		this.treatment.costTypes[i].name,
			// 		this.treatment.relativeStartYear,
			// 		Number(this.treatment.costTypes[i].finDur),
			// 		this.treatment.relativeStartYear + Number(this.treatment.costTypes[i].finDur)
			// 	])
			// }
		}
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

	components: {
		'panel-heading-title': PanelHeadingTitle,
		'treatment-summary': TreatmentSummary,
		'tooltip': tooltip
		// 'cost-type-table-row-finance': CostTypeTableRowFinance,
		// 'cost-type-table-row-final-paying': CostTypeTableRowFinalPaying
	}
}

</script>

<style></style>
