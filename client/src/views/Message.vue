<template>
  <section>
    <div>
      <h2>Messagerie privé</h2>
      <p>
        D'ici, accéder à la liste de vos messages privés, consultez-les ou
        envoyez un nouveau message.
      </p>
    </div>
    <!-- Left side -->
    <div class="messages__left">
      <ul>
        <li
          v-for="(contact, index) in contacts"
          :key="index"
          :class="contact.new ? 'messages__left--not-seen' : ''"
        >
          <a href="#!" @click="showMessages(contact.name)">
            {{ contact.name }}
            <small>Il y a 3 secondes</small>
          </a>
        </li>
      </ul>
    </div>

    <!-- Right side -->
    <div class="messages__right">
      <ul>
        <li v-for="message in messagesToShow" :key="message.id">
          <span
            >{{ message.from }} <small>le {{ message.createdAt }}</small></span
          >
          <p>{{ message.content }}</p>
        </li>
      </ul>

      <form action="#" method="post">
        <Input type="hidden" name="to" :value="messageTo" />
        <Input
          type="text"
          name="message"
          value=""
          placeholder="Enttrez votre message ..."
        />
        <Button>Envoyer</Button>
      </form>
    </div>
  </section>
</template>

<script>
import PageMixin from "../mixins/Page.mixin";
import Input from "../components/Form/Input";
import Button from "../components/Form/Button";

export default {
  name: "MessagePage",
  components: {
    Input,
    Button,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false);
    this.setModules([]);
    this.showContacts();

    if (this.contacts.length > 0) {
      this.showMessages(this.contacts[0]);
    }
  },
  methods: {
    showContacts() {
      let tmpArray = [];
      this.contacts = this.messages.map(function (msg) {
        if (tmpArray.includes(msg.from) === false && msg.from !== "Nalem") {
          tmpArray.push(msg.from);
          return { name: msg.from, new: !msg.seen };
        }
        if (tmpArray.includes(msg.to) === false && msg.to !== "Nalem") {
          tmpArray.push(msg.to);
          return { name: msg.to, new: !msg.seen };
        }
      }, this);

      this.contacts = this.contacts.filter((v) => typeof v !== "undefined");
    },
    showMessages(from) {
      this.messagesToShow = this.messages.filter(
        (v) =>
          (v.from === from || v.from === "Nalem") &&
          (v.to === from || v.to === "Nalem")
      );
      this.messageTo = from;
    },
  },
  data() {
    return {
      contacts: [],
      messages: [
        {
          id: 1,
          content: "Coucou ça va ?",
          createdAt: "2021-11-16 18:59:00",
          updatedAt: "2021-11-16 18:59:00",
          seen: false,
          from: "Nalem",
          to: "Yevons",
        },
        {
          id: 2,
          content: "Coucou ça va bien et toi ?",
          createdAt: "2021-11-16 18:59:00",
          updatedAt: "2021-11-16 18:59:00",
          seen: false,
          from: "Yevons",
          to: "Nalem",
        },
        {
          id: 3,
          content: "Quoi de beau ?",
          createdAt: "2021-11-16 18:59:00",
          updatedAt: "2021-11-16 18:59:00",
          seen: false,
          from: "Yevons",
          to: "Nalem",
        },
        {
          id: 4,
          content: "Hey !",
          createdAt: "2021-11-16 18:59:00",
          updatedAt: "2021-11-16 18:59:00",
          seen: false,
          from: "Luxios",
          to: "Nalem",
        },
        {
          id: 5,
          content: "Bonjour...",
          createdAt: "2021-11-16 18:59:00",
          updatedAt: "2021-11-16 18:59:00",
          seen: false,
          from: "Maêl",
          to: "Nalem",
        },
        {
          id: 6,
          content: "Salutation !",
          createdAt: "2021-11-16 18:59:00",
          updatedAt: "2021-11-16 18:59:00",
          seen: false,
          from: "Britney",
          to: "Nalem",
        },
        {
          id: 7,
          content: "Bonjour bonjour !",
          createdAt: "2021-11-16 18:59:00",
          updatedAt: "2021-11-16 18:59:00",
          seen: true,
          from: "Nalem",
          to: "Rico",
        },
      ],
      messagesToShow: [],
      messageTo: "",
      metaDatas: {
        title: "Messagerie | Groupomania",
        meta: [
          {
            name: "description",
            content: "Gestion de vos messages privés",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: $container-color;
  justify-content: center;

  @media screen AND (min-width: 768px) {
    flex-direction: row;
  }

  > div:first-child {
    flex-basis: 100%;
    text-align: center;
    margin-top: 20px;
  }

  .messages__left {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    background-color: darken($container-color, 5);
    border: 1px solid $border-color;
    border-radius: 15px;
    margin: 20px;

    @media screen AND (min-width: 768px) {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: 0;
    }

    ul {
      margin: 10px 20px;

      li {
        width: 100%;
        height: 32px;
        border-bottom: 1px solid $border-color;
        text-align: center;
        font-weight: normal;

        &.messages__left--not-seen {
          background-color: darken($container-color, 3);
          font-weight: bold;
        }

        &:last-child {
          border-bottom: none;
        }

        a {
          display: block;
          width: 100%;
          height: 100%;
          text-decoration: none;

          small {
            display: block;
            font-size: 0.7em;
            color: lighten($font-color, 30);
          }
        }
      }
    }
  }

  .messages__right {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: flex-end;
    border: 1px solid $border-color;
    border-radius: 15px;
    margin: 20px;
    background-color: darken($container-color, 3);

    @media screen AND (min-width: 768px) {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: 0;
    }

    ul {
      margin: 10px 20px;

      li {
        width: 100%;
        margin-top: 20px;

        span {
          color: lighten($font-color, 40);
          font-style: italic;
        }
      }
    }

    form {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;

      @media screen AND (min-width: 768px) {
        flex-direction: row;
      }

      // Hidden input for messageTo
      > div:first-child {
        display: none;
      }

      // Input and button
      > div {
        flex: 1;
        margin: 10px 20px;

        :deep(input) {
          width: 100%;
        }

        :deep(button) {
          width: 100%;

          @media screen AND (min-width: 768px) {
            width: 50%;
          }
        }
      }

      // Button
      > div:last-child {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
