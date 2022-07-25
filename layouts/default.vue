<template>
    <div class="layout-default">
        <Navigation/>
        <slot/>
    </div>
</template>

<style lang="scss" scoped>

.layout-default {
    color: var(--text);
    background-color: var(--selected-ui);
    overflow-x: hidden;
    min-height: 100vh;
}

</style>