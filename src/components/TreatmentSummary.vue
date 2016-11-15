<template>
  <dl class="dl-horizontal">
    <dt>Scenario Number</dt>
    <dd>{{ treatment.scenarioId }}</dd>
    <dt>Embayment</dt>
    <dd>{{ treatment.EmbaymentName }}</dd>
  </dl>
</template>
<script>
export default {
  props: ['treatment']
}
</script>
