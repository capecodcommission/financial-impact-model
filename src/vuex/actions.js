import api from '../api'

// Actions obtain JSON from API, pass response to state mutations via dispatch

// Load JSON containing finance options array
export const loadFinanceOptions = function ({ dispatch, state }) {
  
  api.getFinanceOptions().then(function (response) {

    dispatch('LOAD_FINANCE_OPTIONS', response.data)

  }, function (response) {

    console.log(response)

  })
}

export const loadScenarios = function({dispatch, state}) {

  api.getScenarios().then(function (response) {

    dispatch('LOAD_SCENARIOS', response.data)

  }, function (response) {

    console.log(response)
  })
}

// Load treatments array from API given the scenario id
export const loadScenario = function ({ dispatch, state }, scenarioId) {

  api.getScenario( scenarioId ).then(function (response) {

    let scenario = {
      id: scenarioId,
      treatments: response.data
    }

    dispatch('LOAD_SCENARIO', scenario)

    dispatch('CHANGE_TREATMENT_INDEX', 0)

  }, function (response) {

    console.log(response)

  })
}

// Get new treatments array based on relative start year and duration
export const updateTreatment = function ({ dispatch, state }, relativeStartYear, duration, treatmentId) {

  api.updateTreatment( relativeStartYear, duration, treatmentId ).then(function (response) {

    dispatch('UPDATE_TREATMENT', response.data)

  }, function (response) {

    console.log(response)

  })
}

// change index of treatment array based on icon selection
export const changeTreatmentIndex = function ({ dispatch, state }, index) {
  dispatch('CHANGE_TREATMENT_INDEX', index)
}

// Obtain sumofannualcapitaltotals based on treatment parameters, dispatch mutation to store
export const updateFinTotals = function ({ dispatch, state }, treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate) {

  api.getSumOfAnnualCapitalTotals( treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate ).then(function (response) {

    dispatch('UPDATE_ANNUALIZED', treatmentId, costToFinance, response.data)
  }, function (response) {
    
    console.log(response)
  })
}

// Obtain annual total array based on treatment parameters, dispatch state mutation
export const updateCapTotalTownTreatment = function({ dispatch, state }, treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate) {

  api.getAnnualCapitalTotalsforTreatment (treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate).then(function (response) {

    dispatch('UPDATE_CAPTOTALTOWNTREATMENT', treatmentId, costToFinance, response.data)

  }, function (response) {
    
    console.log(response)
  })
}

// Obtain inflated cost, dispatch push to array
export const calculateInflated = function ({dispatch, state}, cost, relativeStartYear, treatmentId, costTypeName) {

  api.getInflatedCost (cost, relativeStartYear).then(function (response) {

    dispatch('UPDATE_INFLATED', treatmentId, costTypeName, response.data)

  }, function (response) {

    console.log(response)
  })
}

// Get array of annual costs by town by cost type
export const annualTownTreatment = function({ dispatch, state }, treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate, costTypeName) {

  api.getTownAnnuals (treatmentId, costToFinance, financeOption, relativeStartYear, financeDuration, principalForgivenessRate, costTypeName).then(function (response) {

    dispatch('UPDATE_TOWNTOTALS', treatmentId, costTypeName, response.data)

  }, function (response) {

    console.log(response)
  })
}

// Get array of primary / secondary homes by town by cost type
export const primarysecondaryArray = function({ dispatch, state }, treatmentId, array) {

  api.townPrimarySecondary (array).then(function (response) {

    dispatch('UPDATE_TOWNPRIMSEC', treatmentId, response.data)

  }, function (response) {

    console.log(response)
  })
}

// Obtain inflated cost, dispatch push to array
export const calculatetitle5inflated = function ({dispatch, state}, treatmentid, cost, year) {

  api.getInflatedCost (cost, year).then(function (response) {

    dispatch('UPDATE_TITLE5', treatmentid, year, response.data)

  }, function (response) {

    console.log(response)
  })
}


