<template>
  <div>
    <section class="community__header">
      <figure>
        <img
          :src="community.icon"
          alt="Image de la communauté {{ community.name }}"
        />
      </figure>
      <h2>
        {{ community.name }}
        <small>c/{{ community.slug }}</small>
      </h2>

      <Button><i class="fas fa-plus-circle"></i> Suivre</Button>
    </section>

    <tabs :options="{ useUrlFragment: false }">
      <tab name="Publications">
        <form action="#" method="post">
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="Titre de votre publiction"
            maxlength="255"
          />

          <div>
            <textarea
              name="title"
              id="title"
              rows="10"
              placeholder="Contenu de votre publication"
            ></textarea>
          </div>
          <Button success>Envoyer ma publication</Button>
        </form>
        <Posts />
      </tab>
      <tab name="A propos">
        <h3>A propos</h3>
        <p>{{ community.about }}</p>
      </tab>
    </tabs>
  </div>
</template>

<script>
import Posts from "../components/Posts/Posts";
import PageMixin from "../mixins/Page.mixin";
import { Tabs, Tab } from "vue3-tabs-component";
import Input from "../components/Form/Input";
import Button from "../components/Form/Button";

export default {
  name: "Community",
  components: {
    Posts,
    Tabs,
    Tab,
    Input,
    Button,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true);
    this.setModules(["TopCommunity"]);
  },
  data() {
    return {
      community: {
        id: 1,
        name: "Actualitée",
        slug: "actualitee",
        about: "A propos de cette communauté",
        icon: "https://i.pravatar.cc/300",
      },
      metaDatas: {
        title: "Communauté de zozo | Groupomania",
        meta: [
          {
            name: "description",
            content: "A propos de la communauté de zozo",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
}
.community__header {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: $container-color;

  figure {
    display: flex;
    justify-content: center;
    margin: 10px 20px;

    img {
      width: 120px;
      height: 120px;
      border: 3px solid $color-secondary;
      border-radius: 120px;
    }
  }

  h2 {
    display: flex;
    flex-direction: column;
    font-size: 1.6em;
    small {
      color: lighten($font-color, 50);
      font-size: 1rem;
    }
  }

  // Button
  > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 20px;
  }
}

form {
  :deep(input) {
    width: 100%;
    margin-bottom: 10px;
  }
  textarea {
    width: 100%;
    border: 1px solid $color-secondary;
    border-radius: 15px;
    padding: 10px;
  }
  > :deep(div) {
    display: flex;
    justify-content: center;
    width: 100%;

    button {
      width: 90%;
      margin-top: 10px;
    }
  }
}
</style>
