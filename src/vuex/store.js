import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Create state object that all Vues share, JSON from API is loaded here
const state = {
  treatmentIndex: 0,
  scenarios: [],

  financeOptions: [],

  scenario: {
    id: false,
    treatments: [
      {
        treatmentName: 'TreatmentName',
        treatmentId: 2,
        treatmentIcon: 'Cluster.png',
        costTypes: [],
        relativeStartYear: 7,
        duration: 2
      }
    ]
  }
}

// Create mutations; functions to change data in the state
const mutations = {

  LOAD_SCENARIOS (state, scenarios) {

    state.scenarios = scenarios
  },

  // Load finace option JSON, remove O&M Cost (last item in array)
  LOAD_FINANCE_OPTIONS (state, options) {
    options.pop()
    options[0].maxDuration = 1
    state.financeOptions = options
  },

  // Loads treatment array into state, also creates nested properties
  LOAD_SCENARIO (state, scenario) {
    for (var i = 0; i < scenario.treatments.length; i++) {
      scenario.treatments[i]['primsecarray'] = {"Years":[]}
      scenario.treatments[i]['stage'] = 0 // TODO: Track current route index by treatment
     
      for (var j = 0; j < scenario.treatments[i].costTypes.length; j++) {
        scenario.treatments[i].costTypes[j]["treatTotal"] = 0
        scenario.treatments[i].costTypes[j]["finDur"] = 20
        scenario.treatments[i].costTypes[j]["prinFor"] = 0
        scenario.treatments[i]["treatnotes"] = ''
        scenario.treatments[i]["finnotes"] = ''
        scenario.treatments[i].costTypes[j]["addtlpytyps"] = {
          Property_TaxesorFees: 0,
          Betterments: 0
        },
        scenario.treatments[i].costTypes[j]["finNonFin"] = 0
        scenario.treatments[i].costTypes[j]["finTotal"] = 0
        scenario.treatments[i].costTypes[j]["annualizedarray"] = {}
        scenario.treatments[i].costTypes[j]["annualtownarray"] = {}
        scenario.treatments[i].costTypes[j]["townprimsec"] = {}
        scenario.treatments[i].costTypes[j]["financeOption"] = 0
        scenario.treatments[i].costTypes[j]["finDur"] = 1

        if (scenario.treatments[i].costTypes[j]["name"] === "OM Cost") {
          scenario.treatments[i].costTypes[j]["name"] = "Operations & Maintenance xxxx"
        }

        scenario.treatments[i].costTypes[j]["name"] = scenario.treatments[i].costTypes[j]["name"].slice("Cost",-4)
      }
    }
    state.scenario = scenario
  },

  // Returns new scenario JSON based on relative start year duration slider, also creates new nested properties
  UPDATE_TREATMENT (state, treatment) {
    let index = state.treatmentIndex
    for (var i = 0; i < treatment.costTypes.length; i++) {
      treatment['stage'] = 1
      treatment.costTypes[i]["treatTotal"] = 0
      treatment.costTypes[i]["finDur"] = 20
      treatment.costTypes[i]["prinFor"] = 0
      treatment["treatnotes"] = ''
      treatment["finnotes"] = ''
      treatment.costTypes[i]["addtlpytyps"] = {
        Property_TaxesorFees: 0,
        Betterments: 0
      },
      treatment.costTypes[i]["finNonFin"] = 0
      treatment.costTypes[i]["finTotal"] = 0
      treatment.costTypes[i]["annualizedarray"] = {}
      treatment.costTypes[i]["annualtownarray"] = {}
      treatment.costTypes[i]["townprimsec"] = {}
      treatment.costTypes[i]["financeOption"] = 0
      treatment.costTypes[i]["finDur"] = 1

      if (treatment.costTypes[i]["name"] === "OM Cost") {
        treatment.costTypes[i]["name"] = "Operations & Maintenance xxxx"
      }

      treatment.costTypes[i]["name"] = treatment.costTypes[i]["name"].slice("Cost",-4)
    }
    state.scenario.treatments.splice(index, 1, treatment)
  },

  // Last leg of changeTreatmentIndex action, changes element index of treatment array
  CHANGE_TREATMENT_INDEX (state, index) {
    state.treatmentIndex = index
  },

  // Last leg of action getFinTotals, takes API reponse and inserts into proper costType
  UPDATE_ANNUALIZED (state, treatmentId, costToFinance, annualized) {
    const treatment = state.scenario.treatments.find((t) => t.treatmentId === treatmentId)
    const currCostType = treatment.costTypes.find((costType) => costType.treatTotal === costToFinance)
    currCostType.annualized = annualized
  },

  // Appends array of year-over-year principal, interest, and annual total
  UPDATE_CAPTOTALTOWNTREATMENT (state, treatmentId, costToFinance, annualizedarray) {
    const treatment = state.scenario.treatments.find((t) => t.treatmentId === treatmentId)
    const currCostType = treatment.costTypes.find((costType) => costType.treatTotal === costToFinance)
    currCostType.annualizedarray = annualizedarray

  },

  // Inserts inflated cost given uninflated cost
  UPDATE_INFLATED (state, treatmentId, name, data) {
    const treatment = state.scenario.treatments.find((t) => t.treatmentId === treatmentId)
    const currCostType = treatment.costTypes.find((costType) => costType.name === name)
    currCostType.inflated = data
  },

  // Inserts towntotal array into named cost type
  UPDATE_TOWNTOTALS (state, treatmentId, name, data) {
    const treatment = state.scenario.treatments.find((t) => t.treatmentId === treatmentId)
    const currCostType = treatment.costTypes.find((costType) => costType.name === name)
    currCostType.annualtownarray = data
  },

  // Finds treatmentId, then costType.name, then inserts response into property
  UPDATE_TOWNPRIMSEC (state, treatmentId, data) {
    const treatment = state.scenario.treatments.find((t) => t.treatmentId === treatmentId)
    treatment.primsecarray = data
  },

  // Finds treatmentId, then current year, then inserts inflated cost into title5cost property
  UPDATE_TITLE5 (state, treatmentId, year, data) {
    const treatment = state.scenario.treatments.find((t) => t.treatmentId === treatmentId)
    const currentyear = treatment.primsecarray.Years.find((y) => y.year === year)
    currentyear.title5cost = data
  }
}

export default new Vuex.Store({
  state,
  mutations
})
