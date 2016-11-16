// Create nested routes
export default function (router) {
  router.map({
    '/': {
      component: require('./components/Start.vue')
    }, // TODO: Track current routes per treatment
    '/scenario/:id': { // :id is a route parameter that can be passed into a function
      component: require('./components/ScenarioView.vue'),
      subRoutes: {
        '/treatmentsDetails' : { // Routes hereafter are nested within /scenario/:id
          name: 'treatmentDetail',
          component: require('./components/TreatmentDetail.vue'),
        },
        '/financeTreatments' : {
          name: 'financeTreatment',
          component: require('./components/TreatmentFinance.vue'),
        },
        '/scenarioCostSharing' : {
          name: 'pie',
          component: require('./components/pie.vue'),
        },
        '/projectAndFinancing': {
          name: 'pairedbar',
          component: require('./components/pairedbar.vue')
        },
        '/propertyOwnerCosts': {
          name: 'propertyOwnerCosts',
          component: require('./components/propertyOwnerCosts.vue')
        }
      }
    }
  })
  router.redirect({
    '*': '/'
  })
  // router.beforeEach((transition)=>{
  //   transition.next()
  // })
}
