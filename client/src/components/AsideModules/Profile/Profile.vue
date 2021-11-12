<template>
  <div v-if="shouldShowModule()">
    <figure>
      <img :src="user.avatar" alt="Avatar de {{ user.name }}" />
    </figure>

    <div>
      <h2>{{ user.name }}</h2>
      <span> /u/{{ user.name.toLowerCase().trim().replace(" ", "-") }} </span>
    </div>

    <p>
      {{ user.about }}
    </p>

    <span>
      <!-- If user profile == auth user -->
      <Button v-if="true" link to="/profile/settings"><i class="fas fa-cog"></i> Gérer mon compte</Button><br>
      <!-- Else -->
      <Button><i class="fas fa-plus-circle"></i> Follow</Button>
      <Button success><i class="fas fa-comments"></i> Chat</Button>
      <Button danger><i class="fas fa-flag"></i> Report</Button>
      <!-- Endif -->
    </span>
  </div>
</template>

<script>
import ModuleMixin from "../../../mixins/AsideModule.mixin";
import Button from "../../Button.vue";

export default {
  name: "Profile",
  components: {
    Button,
  },
  mixins: [ModuleMixin],
  data() {
    return {
      user: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
        about: "Ma super bio personelle",
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div:first-child {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0.1px solid $border-color;
  background-color: $container-color;
  border-radius: 5px;
  margin-top: 20px;

  figure {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    img {
      width: 50%;
      height: auto;
      border: 3px solid $color-secondary;
      border-radius: 50%;
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    margin: 10px 20px;

    span {
      color: lighten($font-color, 30);
    }
  }

  p {
    margin-bottom: 20px;
  }

  button {
    margin: 0 10px;
    margin-bottom: 20px;
  }
}
</style>
