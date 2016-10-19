<template>
  <h3 class="panel-title pull-left">
    <slot>
      Treatment Tech Name
    </slot>
  </h3>
</template>
<script>
</script>
<style lang="scss" scoped>
.panel-heading h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: normal;
  width: 75%;
  padding-top: 8px;
}
</style>
