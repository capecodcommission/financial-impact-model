import Vue from 'vue'
import VueResource from 'vue-resource'

import { API_ROOT } from './config'

Vue.use(VueResource)

Vue.http.options.crossOrigin = true
Vue.http.headers.common['Authorization'] = '123123'

// Export (out of this script) functions to access API 
export default {

  // Obtain finance options JSON from API
  getFinanceOptions () {
    return Vue.http.get(API_ROOT + 'getFinanceOptions')
  },

  // Obtain treatment arrays based on scenario id
  getScenario (id) {
    return Vue.http.get(API_ROOT + 'getScenario/' + id)
  },

  // Obtain new treatment JSOn based on start year/duration from slider
  updateTreatment( relativeStartYear, duration, treatmentId ) {
    let data = {
      treatmentId: treatmentId,
      relativeStartYear: relativeStartYear,
      duration: duration
    }

    return Vue.http.post(API_ROOT + 'getUpdatedTreatmentTimeline', data)
  },

  // Obtain sumofannualcapitaltotals from API based on treatment parameters
  getSumOfAnnualCapitalTotals (treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate) {
    let data = {
      treatmentId: treatmentId,
      costToFinance: costToFinance,
      financeOption: financeOption,
      relativeStartYear: relativeStartYear,
      financeDuration: financeDuration,
      principalForgivenessRate: principalForgivenessRate
    } 

    return Vue.http.post(API_ROOT + 'sumOfAnnualCapitalTotalsForTreatment', data)
  },

  // Obtain annual total array for each cost type based on treatment parameters
  getAnnualCapitalTotalsforTreatment (treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate) {
    let data = {
      treatmentId: treatmentId,
      costToFinance: costToFinance,
      financeOption: financeOption,
      relativeStartYear: relativeStartYear,
      financeDuration: financeDuration,
      principalForgivenessRate: principalForgivenessRate
    }

    return Vue.http.post(API_ROOT + 'annualCapitalTotalsForTreatment', data)
  },

  // Inflate cost given uninflated cost and relative start year
  getInflatedCost (cost, relativeStartYear) {
    let data = {
      cost: cost,
      relativeStartYear: relativeStartYear
    }

    return Vue.http.post(API_ROOT + 'calculateInflatedCost', data)
  },

  // Obtain capital totals array by year and town
  getTownAnnuals (treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate, costTypeName) {
    let data = {
      treatmentId: treatmentId,
      costToFinance: costToFinance,
      financeOption: financeOption,
      relativeStartYear: relativeStartYear,
      financeDuration: financeDuration,
      principalForgivenessRate: principalForgivenessRate,
      costTypeName: costTypeName
    } 

    if (costTypeName === "OM Cost") {
      return Vue.http.post(API_ROOT + 'omAnnualCapitalTotalsPerTownForTreatment', data)
    } else {
      return Vue.http.post(API_ROOT + 'costTypeAnnualCapitalTotalsPerTownForTreatment', data)
    }
  },

  // Obtain capital totals array by year and town
  townPrimarySecondary (array) {
    return Vue.http.post(API_ROOT + 'calculateAnnualCostTypesTotalForTreatment', array)
  }

}
