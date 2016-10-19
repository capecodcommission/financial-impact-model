<template>
  <dl class="dl-horizontal">
    <dt>Scenario Number</dt>
    <dd>{{ treatment.scenarioId }}</dd>
    <dt>Embayment</dt>
    <dd>({{ treatment.EmbaymentId }}) {{ treatment.EmbaymentName }}</dd>
    <dt>Sub-Embayment Name</dt>
    <dd>({{ treatment.SubEmbaymentId }}) {{ treatment.SubEmbaymentName }}</dd>
  </dl>
</template>
<script>
export default {
  props: ['treatment']
}
</script>
