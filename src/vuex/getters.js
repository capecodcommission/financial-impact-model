// Functinos to retrieve data from the state
export function getTreatmentIndex (state) {
  return state.treatmentIndex
}

export function getFinanceOptions (state) {
  return state.financeOptions
}

export function getScenario (state) {
  return state.scenario
}

export function getTreatments (state) {
  return state.scenario.treatments
}

export function getSelectedTreatment (state) {
  return state.scenario.treatments[state.treatmentIndex]
}

export function getScenarios (state) {
	return state.scenarios
}
