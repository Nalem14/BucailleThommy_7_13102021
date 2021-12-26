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
        <li>
          <a href="#!" @click="newMessage()"> Nouveau msg. </a>
        </li>

        <li
          v-for="(contact, index) in contacts"
          :key="index"
          :class="contact.new ? 'messages__left--not-seen' : ''"
        >
          <a href="#!" @click="showMessages(contact.id)">
            {{ contact.name }}
            <small>{{ formatDateTime(contact.lastMessage) }}</small>
          </a>
        </li>
      </ul>
    </div>

    <!-- Right side -->
    <div class="messages__right">
      <ul>
        <li v-if="messageTo == ':new'">
          <p>
            Indiquez l'utilisateur à qui vous souhaitez envoyer un message
            ci-dessous.
          </p>
        </li>

        <li v-else v-for="(message, index) in messagesToShow" :key="message.id">
          <span
            >{{ message.FromUser.username }}
            <small>le {{ formatDateTime(message.createdAt) }}</small></span
          >
          <p>
            {{ message.content }}
            <small
              v-if="
                message.seen &&
                index === messagesToShow.length - 1 &&
                message.ToUserId != authData.id &&
                message.FromUserId == authData.id
              "
              >Vu par {{ message.ToUser.username }}</small
            >
          </p>
        </li>
      </ul>

      <form
        v-if="messageTo !== ':new'"
        action="#"
        method="post"
        @submit.prevent="sendMessage"
      >
        <Input type="hidden" name="to" :value="messageTo" />
        <Input
          type="text"
          name="message"
          id="message"
          ref="messageContainer"
          placeholder="Entrez votre message ..."
        />
        <Button>Envoyer</Button>
      </form>

      <form v-else action="#" method="get">
        <Autocomplete
          @input="getUsersList"
          :results="usersList"
          @onSelect="selectedNewUserMessage"
          :display-item="getName"
          placeholder="Entrez l'identifiant de l'utilisateur ..."
        ></Autocomplete>
      </form>
    </div>
  </section>
</template>

<script>
import PageMixin from "../mixins/Page.mixin";
import Input from "../components/Form/Input";
import Button from "../components/Form/Button";

import Autocomplete from "vue3-autocomplete";
import "vue3-autocomplete/dist/vue3-autocomplete.css";

export default {
  name: "MessagePage",
  components: {
    Input,
    Button,
    Autocomplete,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false);
    this.setModules([]);

    this.init();

    this.watcher = this.$watch(
      () => this.$route.name,
      () => {
        if (this.$route.name === "Messages") this.init();
      }
    );
  },
  unmounted() {
    if (this.watcher) this.watcher();
  },

  methods: {
    init() {
      this.fetchConversations().then(() => {
        this.showContacts();

        if (this.contacts.length > 0) {
          this.showMessages(this.contacts[0].id);
        }

        this.io.socket.on("message:new", (data) => {
          if (this.$route.name === "Messages") this.receiveMessage(data);
        });

        this.io.socket.on("message:seen", (contactId) => {
          if (this.$route.name === "Messages")
            this.setMessageSeenFromOther(contactId);
        });
      });
    },

    async fetchConversations() {
      try {
        let response = await this.axios.get("/message");
        this.messages = response.data.data.messages;
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.usersList = [];
        this.$notify({
          type: "error",
          title: `Erreur lors de la recherche d'un utilisateur.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 15000,
        });
      }
    },
    async fetchMessages(from) {
      try {
        let response = await this.axios.get("/message/" + from);
        this.messagesToShow = response.data.data.messages;
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.messagesToShow = [];
        this.$notify({
          type: "error",
          title: `Erreur lors de la récupération des messages.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 15000,
        });
      }
    },

    showContacts() {
      let tmpArray = [];
      this.contacts = this.messages.map(function (msg) {
        if (
          tmpArray.includes(msg.FromUser.id) === false &&
          msg.FromUser.id !== this.authData.id
        ) {
          tmpArray.push(msg.FromUser.id);
          return {
            id: msg.FromUser.id,
            name: msg.FromUser.username,
            new: !msg.seen,
            lastMessage: msg.createdAt,
          };
        }
        if (
          tmpArray.includes(msg.ToUser.id) === false &&
          msg.ToUser.id !== this.authData.id
        ) {
          tmpArray.push(msg.ToUser.id);
          return {
            id: msg.ToUser.id,
            name: msg.ToUser.username,
            new: false,
            lastMessage: msg.createdAt,
          };
        }
      }, this);

      this.contacts = this.contacts.filter((v) => typeof v !== "undefined");
      this.sortConversations();
    },
    async showMessages(from) {
      this.messageTo = from;
      await this.fetchMessages(from);

      this.setMessageRead(from);
      this.scrollChat();

      this.io.socket.emit("message:seen", { from: this.authData.id, to: from });
    },

    scrollChat() {
      setTimeout(function () {
        let msgContainer = document.querySelector(".messages__right ul");
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }, 100);
    },
    setMessageRead(contactId) {
      this.contacts.map((c) => {
        if (c.id === contactId) {
          c.new = false;
        }
      });
    },
    setMessageSeenFromOther(contactId, isSeen = true) {
      console.log(this.messageTo, contactId);
      if (this.messageTo === contactId) {
        this.messagesToShow = this.messagesToShow.map((elem) => {
          elem.seen = isSeen;
          return elem;
        });
      } else {
        this.messages = this.messages.map((elem) => {
          if (elem.FromUserId === contactId || elem.ToUserId === contactId) {
            elem.seen = isSeen;
            return elem;
          }
        });
      }
    },

    setLastMessageTime(message, time) {
      this.contacts.map((c) => {
        if (c.id === message.FromUserId || c.id === message.ToUserId) {
          c.lastMessage = time;
        }
      });
    },

    newMessage(to) {
      to = to || null;
      if (to === null) this.messageTo = ":new";
      else {
        this.showMessages(to);
      }
    },
    async sendMessage() {
      try {
        let input = document.getElementById("message");
        let msgToSend = input.value;

        let response = await this.axios.post("/message/" + this.messageTo, {
          content: msgToSend,
        });
        let message = response.data.data.message;

        input.value = "";
        this.receiveMessage(message);
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.usersList = [];
        this.$notify({
          type: "error",
          title: `Erreur lors de la recherche d'un utilisateur.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 15000,
        });
      }
    },
    receiveMessage(message) {
      if (
        this.messageTo === message.ToUserId ||
        this.messageTo === message.FromUserId
      ) {
        this.messagesToShow.push(message);
        this.scrollChat();
        this.setLastMessageTime(message, message.createdAt);
        this.sortConversations();

        let id = message.ToUserId;
        if (id === this.authData.id) id = message.FromUserId;
        this.io.socket.emit("message:seen", { from: this.authData.id, to: id });
      } else {
        this.messages.push(message);
        this.setLastMessageTime(message, message.createdAt);
        this.sortConversations();
      }
    },
    sortConversations() {
      this.contacts = this.contacts.sort(
        (a, b) =>
          (a.lastMessage < b.lastMessage) - (a.lastMessage > b.lastMessage)
      );
    },

    getName(item) {
      return item.username;
    },
    async getUsersList(val) {
      try {
        let response = await this.axios.get("/user?search=" + val);
        this.usersList = response.data.data.users;
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.usersList = [];
        this.$notify({
          type: "error",
          title: `Erreur lors de la recherche d'un utilisateur.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 15000,
        });
      }
    },
    selectedNewUserMessage(item) {
      let newObj = {
        id: item.id,
        name: item.username,
        new: true,
        lastMessage: this.moment(),
      };
      let inContact = this.contacts.filter((c) => c.id === item.id);
      if (inContact.length === 0) this.contacts.push(newObj);

      this.newMessage(item.id);
    },
  },

  data() {
    return {
      contacts: [],
      messages: [],

      messagesToShow: [],
      messageTo: "",
      usersList: [],

      watcher: null,

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
:deep(.vue3-autocomplete-container) {
  position: relative;
}
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
    height: 400px;

    @media screen AND (min-width: 768px) {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: 0;
    }

    ul {
      margin: 10px 20px;
      overflow-y: auto;
      height: 400px;

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
    height: 400px;

    @media screen AND (min-width: 768px) {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: 0;
    }

    ul {
      margin: 10px 20px;
      overflow-y: auto;
      height: 400px;

      li {
        width: 100%;
        margin-top: 20px;

        span {
          color: lighten($font-color, 40);
          font-style: italic;
        }

        p {
          small {
            color: lighten($font-color, 40);
            font-size: 0.7em;
            display: block;
            margin-top: 10px;
            font-style: italic;
          }
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
