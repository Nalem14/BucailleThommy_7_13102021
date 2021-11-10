<template>
  <button :id="id || name" :name="name">
    <span>
        <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    id: String,
    name: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/scss/main.scss";
button {
    background-color: $color-secondary;
    border: 1px solid $color-primary;
    border-radius: 15px;
    color: $font-color;
    cursor: pointer;
    transition: opacity .2s ease-in-out;

    span {
        display: flex;
        margin: 5px 10px;
    }

    &:hover {
        transition: opacity .4s ease-in-out;
        opacity: .7;
    } 
}
</style>
