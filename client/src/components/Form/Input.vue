<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      :max="max"
      :minlength="minlength"
      :maxlength="maxlength"
      :autofocus="autofocus"
      v-model="value"
      :value="value"
    />
  </div>
</template>

<script>
export default {
  name: "Input",
  components: {
  },
  emits: ['update:modelValue'],
  props: {
    id: String,
    name: String,
    type: String,
    placeholder: String,
    label: String,
    required: Boolean,
    min: String,
    max: String,
    minlength: String,
    maxlength: String,
    autofocus: Boolean,
    modelValue: String
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
label {
  color: lighten($font-color, 20);
  margin-bottom: 10px;
}

input,
textarea {
  border: 1px solid $color-secondary;
  border-radius: 15px;
  padding: 10px;
}

input {
  height: 30px;
  padding: 0 10px;
}
</style>
