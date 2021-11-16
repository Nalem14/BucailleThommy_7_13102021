<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :validate="validate"
      :required="required"
      :min="min"
      :max="max"
      :minlength="minlength"
      :maxlength="maxlength"
      :autofocus="autofocus"
      :value="value"
    />
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    id: String,
    name: String,
    type: String,
    placeholder: String,
    label: String,
    validate: Boolean,
    required: Boolean,
    min: String,
    max: String,
    minlength: String,
    maxlength: String,
    autofocus: Boolean,
    value: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
