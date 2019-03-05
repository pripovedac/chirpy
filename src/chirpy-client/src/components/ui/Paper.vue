<template>
    <div class="paper">
        <slot></slot>
    </div>
</template>

<script>
    export default {}
</script>

<style scoped>
    .paper {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    }
</style>
