<template>
  <button
    class="{{ danger ? 'danger' : success ? 'success' : '' }}"
    :id="id"
    :name="name"
  >
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
    name: String,
    danger: Boolean,
    success: Boolean,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
button {
  background-color: $color-secondary;
  border: 2px solid darken($color-secondary, 10);
  border-radius: 15px;
  color: lighten($font-color, 100);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

  span {
    display: flex;
    margin: 5px 10px;
  }

  &:hover {
    transition: background-color 0.4s ease-in-out;
    transition: transform 0.4s ease-in-out;
    background-color: lighten($color-secondary, 5);
    transform: scale(1.1);
  }

  &.success {
    background-color: $color-success;
    border-color: darken($color-success, 10);
  }

  &.danger {
    background-color: $color-danger;
    border-color: darken($color-danger, 10);
  }
}
</style>
