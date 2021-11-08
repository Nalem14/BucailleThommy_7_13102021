<template>
  <header>
    <nav>
      <div>
        <router-link to="/">
          <h1><i class="logo"></i> Groupomania</h1>
        </router-link>
      </div>

      <ul>
        <li>
          <router-link to="/"><i class="home"></i> Tout </router-link>
        </li>
        <li>
          <router-link to="/"><i class="home"></i> Populaire </router-link>
        </li>
        <li>
          <router-link to="/"><i class="home"></i> Modération </router-link>
        </li>
        <li>
          <router-link to="/"
            ><i class="home"></i> Message <span id="message-count">0</span>
          </router-link>
        </li>
        <li>
          <router-link to="/"
            ><i class="home"></i> Notification <span id="notif-count">0</span>
          </router-link>
        </li>
        <li>
          <router-link to="/"><i class="home"></i> Créer un poste </router-link>
        </li>
        <li>
          <router-link to="/"><i class="home"></i> Se connecter </router-link>
        </li>
        <li>
          <router-link to="/"><i class="home"></i> S'inscrire </router-link>
        </li>
        <li>
          <router-link to="/"><i class="home"></i> Profil </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../assets/scss/_reset.scss";
@import "../../assets/scss/_variables.scss";
header {
  height: auto;
  width: 100%;
  border: .5px solid lighten($color-primary, 10);
  border-radius: 5px;
  background-color: darken($color-primary, 5);

  @media screen AND (min-width: 768px) {
    height: 80px;
  }

  nav {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media screen AND (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      margin: 0 20px;
    }

    a {
      text-decoration: none;

      h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
        font-size: 2em;
        font-weight: 700;
        font-family: "Dancing Script", -apple-system, BlinkMacSystemFont,
          "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
          "Helvetica Neue", sans-serif;

        background: -webkit-linear-gradient(
          lighten($color-primary, 5),
          lighten($color-secondary, 5)
        );
        background-clip: text;
        -webkit-text-fill-color: transparent;

        i {
          margin-right: 5px;
        }

        @media screen AND (min-width: 768px) {
          margin-top: 0;
        }
      }
    }
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;

    @media screen AND (min-width: 768px) {
      margin-top: 10px;
    }

    li {
      display: flex;
      flex-direction: row;
      flex-basis: 50%;
      border-bottom: 3px solid lighten($color-primary, 10);
      line-height: 50px;
      transition: border 0.2s linear;
      justify-content: center;

      @media screen AND (min-width: 768px) {
        flex-basis: auto;
        border-bottom: 1px solid lighten($color-primary, 10);
        line-height: 32px;
      }

      &:hover {
        transition: border 0.4s linear;
        border-bottom: 3px solid $color-secondary;

        @media screen AND (min-width: 768px) {
          border-bottom: 1px solid $color-secondary;
        }
      }

      a {
        color: $link-color;
        text-decoration: none;
        transition: opacity 0.2s ease-in-out;
        display: flex;
        margin-right: 20px;
  
        &:visited {
          color: $link-color;
        }
        &:hover {
          transition: opacity 0.3s ease-in-out;
          opacity: 0.8;
        }

        &.active {
          font-weight: 700;
        }

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          top: 14px;
          background-color: $color-secondary;
          color: $font-color;
          height: 24px;
          width: 24px;
          border-radius: 24px;
          margin-left: 5px;
          margin-right: -5px;
          font-size: 0.7em;

          @media screen AND (min-width: 768px) {
            top: 5px;
          }
        }
      }
    }
  }
}
</style>
