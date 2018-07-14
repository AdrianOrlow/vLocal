<template>
  <div id="app">
    <main class="main" v-bind:class="{ 'block--blur': popup}">
        <header class="header">
            <div class="header--container">
            <router-link to="/">
                <div class="header__logo">
                    <h1 class="h1--logo">vLocal</h1>
                </div>
            </router-link>
            <div class="header__btn" v-if="!user" @click="popup = !popup; loginPopup = !loginPopup">
                login
            </div>
            <div class="header__dropdown" v-if="user">
                <img class="img--header__dropdown" :src="profileimg">
                <div class="header__dropdown__content">
                    <router-link to="/profile"><img :src="profileimg" class="img--header__dropdown" style="margin-right: 0.5em;">{{name}}</router-link>
                    <a href="#" @click="popup = !popup; addOffer = !addOffer">Add offer</a>
                    <a href="#" @click="popup = !popup; editProfile = !editProfile">Edit profile</a>
                    <a href="#" v-on:click="logout">Logout</a>
                </div>
            </div>
            </div>
        </header>
            <div class="main--container">
                <router-view ref="main"/>
            </div>
		<div class="footer"  v-bind:class="{ 'footer--relative': cards > 3 || windowWidth < 1250 && cards > 2}">
			<div class="footer--container">
				<div>Made with <span style="font-family: FontAwesome;"></span> by <a href="https://github.com/TheAdrik">Adrian Orłów</a></div>
				<a href="https://github.com/TheAdrik/vLocal" class="footer__github">
					<img class="footer__github--img" src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png">
				</a>
			</div>
		</div>
    </main>
    <Login v-if="loginPopup"></Login>
    <OfferInfo id="offerInfo" class="none" ref="offerinfoChild"></OfferInfo>
    <AddOffer id="addOffer" v-if="addOffer"></AddOffer>
    <EditProfile v-if="editProfile"></EditProfile>
    <Options v-if="showOptions"></Options>
  </div>
</template>
<script>
import Login from "@/components/Login";
import OfferInfo from "@/components/OfferInfo";
import AddOffer from "@/components/AddOffer";
import EditProfile from "@/components/EditProfile";
import Options from "@/components/Options";
import Firebase from "firebase/app";
import "firebase/database";
var config = {
  apiKey: "AIzaSyBpvz3tlCapYuE4tee_C4jGl182ktd98fM",
  authDomain: "vlocal-ato.firebaseapp.com",
  databaseURL: "https://vlocal-ato.firebaseio.com",
  projectId: "vlocal-ato",
  storageBucket: "vlocal-ato.appspot.com",
  messagingSenderId: "1006731708417"
};
window.app = Firebase.initializeApp(config);
window.db = app.database();
export default {
  name: "App",
  data() {
    return {
      user: null,
      cards: null,
      popup: false,
      loginPopup: false,
      addOffer: false,
      editProfile: false,
      showOptions: false,
      windowWidth: 0,
      profileimg: "",
      name: "",
      options: {
        sortBy: null,
        city: null,
        priceMin: null,
        priceMax: null
      }
    };
  },
  components: {
    Login,
    OfferInfo,
    AddOffer,
    EditProfile,
    Options
  },
  methods: {
    logout: function() {
      Firebase.database()
        .ref("users/")
        .child(Firebase.auth().currentUser.uid)
        .update({
          isonline: false
        });
      Firebase.auth()
        .signOut()
        .then(() => {
          this.user = null;
          this.$toasted.show("Logged out", {
            theme: "primary",
            position: "bottom-right",
            duration: 5000
          });
        });
    }
  },
  watch: {
    user: function(user) {
      if (this.user) {
        var uid = Firebase.auth().currentUser.uid;
        var isonline = Firebase.database()
          .ref("users/")
          .child(uid);
        Firebase.database()
          .ref("users/" + uid)
          .on(
            "value",
            snapshot => {
              this.name = snapshot.val().name;
              this.profileimg = snapshot.val().profileimg;
              isonline.update({
                isonline: true
              });
              isonline.onDisconnect().update({
                isonline: false
              });
            },
            error => {
              this.$toasted.show("Error: " + error.code, {
                theme: "primary",
                position: "bottom-right",
                duration: 5000
              });
            }
          );
      }
    },
    popup: function() {
      var body = document.getElementsByTagName("body")[0];
      if (this.popup && this.windowWidth < 800) {
        document.documentElement.scrollTop = 0;
        body.classList.add("block--scroll");
      } else if (this.popup) {
        document.documentElement.scrollTop = 0;
      } else {
        body.classList.remove("block--scroll");
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.windowWidth = window.innerWidth;
      });
    });
  }
};
</script>

<style>
/* Reset */

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
body {
  -webkit-text-size-adjust: none;
}
textarea,
input {
  border: none;
  overflow: auto;
  outline: none;
  resize: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
*:focus {
  outline: none;
}
a {
  text-decoration: none;
  color: #333;
}
a:visited {
  color: #333;
}
a:hover {
  color: #444;
}
input,
textarea {
  transition: 0.2s ease-in-out;
}
/* Basic */

body {
  font-family: "Montserrat", sans-serif;
  color: #333;
}
::-webkit-scrollbar {
  width: 8px;
  background-color: rgba(0, 0, 0, 0);
}
::-webkit-scrollbar:hover {
  background-color: rgba(0, 0, 0, 0.09);
}
::-webkit-scrollbar-thumb:vertical {
  background: rgba(0, 0, 0, 0.4);
}
::-webkit-scrollbar-thumb:vertical:active {
  background: rgba(0, 0, 0, 0.61);
}
:focus::-webkit-input-placeholder {
  opacity: 0;
}
.block--blur {
  filter: blur(4px);
  pointer-events: none;
}
.block--scroll {
  overflow: hidden;
}
.block--none {
  display: none;
}
.none {
  display: none;
}
/* Icon */

.icon {
  text-decoration: none;
  position: relative;
}
.icon:before {
  font-family: FontAwesome;
  font-style: normal;
  font-weight: normal;
  text-transform: none !important;
}
.icon > .label {
  display: none;
}
/* Header */

.header {
  top: 0;
  width: 100%;
  line-height: 80px;
  font-size: 1.7em;
  font-weight: 700;
  color: #333;
  z-index: 10;
  margin-bottom: 1em;
}
.header--container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  border-bottom: 5px solid #f1f1f1;
}
.header__btn {
  color: #444;
  font-size: 0.8em;
  border: 2px solid #444;
  text-transform: uppercase;
  line-height: 1.7em;
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  padding: 0.1em 1em;
  text-decoration: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.header__btn:hover {
  color: #fafafa;
  background: #444;
}
.header__btn:active {
  color: #fafafa;
  background: #555;
  border: 2px solid #555;
}
/* Footer */

.footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  margin-top: 2em;
  height: auto;
  font-size: 1em;
  font-weight: 700;
}
.footer--relative {
  position: relative;
}
.footer--container {
  display: flex;
  align-items: center;
  margin: 0 auto;
  max-width: calc(1200px - 1em);
  background: #f1f1f1;
  color: #444;
  padding: 1em;
}
.footer__github {
  margin-left: auto;
  margin-right: 0;
}
.footer__github--img {
  height: 1em;
  width: auto;
}
/* Main */

.main--container {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin-top: 3em;
}
/* Section */

.section {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 1em;
}
.section--search {
  margin-bottom: 4em;
}
/* Terms */
.terms h1 {
  font-size: 2em;
  font-weight: 600;
  margin-bottom: 1em;
}
.terms h2 {
  font-size: 1.5em;
  margin-bottom: 0.5em;
  margin-top: 1.25em;
  font-weight: 600;
}
.terms p {
  white-space: pre-line;
  margin-bottom: 0.5em;
}
.terms ul {
  margin-bottom: 1em;
  list-style: unset;
}
.terms li {
  margin-left: 2em;
  margin-bottom: 0.25em;
}
/* Search */

.search--container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  height: 100%;
  width: 100%;
  max-width: 1200px;
}
.search__input {
  background-color: #f5f5f5;
  border: none;
  border-radius: 2px;
  font-size: 1.5em;
  line-height: 1.25em;
  padding: 0.5em 1em;
  -webkit-transition: 0.2s ease-in-out;
  transition: 0.2s ease-in-out;
  width: 75%;
  height: 2em;
}
.search__input:focus {
  background-color: #ececec;
}
.search__input::-webkit-input-placeholder {
  opacity: 0.95;
}
.search__btn {
  color: #333;
  font-weight: 600;
  background: #f5f5f5;
  border: 2px solid rgba(0, 0, 0, 0);
  text-transform: uppercase;
  text-align: center;
  border-radius: 3px;
  text-decoration: none;
  cursor: pointer;
  float: right;
  font-size: 1.5em;
  line-height: 1.25em;
  padding: 0.75em 1em;
  -webkit-transition: 0.2s ease-in-out;
  transition: 0.2s ease-in-out;
  width: 10%;
  font-family: FontAwesome;
  font-size: 1.55em;
}
.search__btn:hover {
  background-color: #ececec;
}
.search__btn:active {
  background-color: #c9c9c9;
}
.search__noresults {
  font-size: 1.5em;
  font-weight: 600;
  text-align: center;
  margin-top: 3em;
}
/* Latest */

.latest--container {
  width: 100%;
}
.latest--title {
  text-transform: uppercase;
  font-size: 1.5em;
  font-weight: 600;
  text-align: center;
  border-bottom: 5px solid #f1f1f1;
  line-height: 1.5em;
  text-align: center;
  position: relative;
  float: left;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-bottom: 0.25em;
}
.latest--grid {
  display: grid;
  grid-gap: 2em;
  width: 100%;
  grid-template-columns: auto auto auto;
}
/* Filtered */

.filtered--container {
  width: 100%;
}
.filtered--title {
  text-transform: uppercase;
  font-size: 1.5em;
  font-weight: 600;
  border-bottom: 5px solid #f1f1f1;
  line-height: 1.5em;
  position: relative;
  width: max-content;
  margin-bottom: 0.25em;
  max-width: 100%;
  max-height: 1.5em;
  overflow: hidden;
  transform: translate(0%, -50%);
}
.filtered--grid {
  display: grid;
  grid-gap: 2em;
  width: 100%;
  grid-template-columns: auto auto auto;
}
/* Cards */

.card {
  background: #f5f5f5;
  position: relative;
  width: 100%;
  height: 20em;
  overflow: hidden;
  cursor: pointer;
  border-radius: 0.5em;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
}
.card:hover {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.card:active {
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
  transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
}
.card__img {
  height: 100%;
  width: 100%;
  position: absolute;
  transform: translateY(-25%);
}
.card__container {
  height: 25%;
  width: 90%;
  background: #f5f5f5;
  position: absolute;
  bottom: 15%;
  padding: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.2em;
  font-weight: 600;
}
.card__info {
  position: absolute;
  bottom: 0;
  padding: 5%;
  width: 40%;
  height: 5%;
  text-align: center;
  color: #fafafa;
  font-weight: 700;
}
.card * {
  pointer-events: none;
}
.card__loading {
  position: absolute;
  top: 0;
  padding: 15% 45%;
  width: 10%;
}
.card__loading i {
  font-size: 2.5em;
  opacity: 0.4;
  margin: 2%;
}
.info__city {
  background: #333;
}
.info__price {
  background: #444;
  right: 0;
}
/* Modal Info */

.modal--main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40em;
  height: 40em;
  background: #f5f5f5;
  z-index: 10;
  border-radius: 0.5em;
  overflow: hidden;
}
.modal--main__img {
  height: 100%;
  width: 100%;
  position: absolute;
  transform: translateY(-25%);
  cursor: pointer;
}
.main__img--showfull {
  z-index: 10;
}
img.modal--main__img {
  transform: translateY(0%);
  height: auto;
}
.modal--main__container {
  height: 50%;
  width: 90%;
  background: #f5f5f5;
  position: absolute;
  bottom: 0;
  padding: 5%;
}
.modal--main__title {
  text-align: left;
  font-size: 1.2em;
  margin-bottom: 5%;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
}
.modal--main__descr {
  text-align: left;
  font-size: 1em;
  width: 40%;
  height: 50%;
  overflow: auto;
  padding-right: 0.1em;
  position: absolute;
  top: 20%;
  white-space: pre-line;
}
.modal--main__btn {
  position: absolute;
  bottom: -0.1em;
  padding: 5%;
  width: 40%;
  height: 2.5%;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.info__close--round {
  border-top-right-radius: 2.5em;
}
.modal--main__btn.info__close {
  background: #e1e1e1;
  color: #333;
}
.modal--main__btn.info__close:hover {
  background: #cacaca;
}
.modal--main__btn.info__close:active {
  background: #b4b4b4;
}
.modal--main__btn.info__contact {
  background: #333;
  color: #fafafa;
  right: 0;
}
.modal--main__btn.info__contact:hover {
  background: #2d2d2d;
}
.modal--main__btn.info__contact:active {
  background: #282828;
}
.modal--main__more {
  width: 40%;
  height: 50%;
  position: absolute;
  top: 20%;
  right: 5%;
}
/* (Modal Info) More */

.more__info,
.more__icons {
  height: 100%;
}
.more__info {
  position: absolute;
  top: 0%;
  right: 0;
  width: 100%;
}
.more__el {
  width: 68.5%;
  height: 11.5%;
  position: relative;
  padding: 5%;
  font-weight: 600;
  color: #fafafa;
  overflow: hidden;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.more__el__icon {
  position: relative;
  left: 0;
  top: 0;
  width: 11.5%;
  padding: 5%;
  height: 11.5%;
  background: #444;
  color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: FontAwesome;
}
.more__el--one {
  background: #333;
}
.more__el--two {
  background: #555;
}
.more__el--three {
  background: #333;
}
.more__el--four {
  background: #27ae60;
}
.more__el__icon--green {
  background: #2ecc71;
}
.more__el__icon--red {
  background: #e74c3c;
  color: #f5f5f5;
}
.info__el--red {
  background: #c0392b;
  color: #f5f5f5;
}
/* (Modal Info) Contact */

.modal--main__contact {
  width: 100%;
  height: 100%;
}
.contact__title {
  width: 100%;
  height: 20%;
  color: #333;
  background: #f5f5f5;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 2em;
}
.contact__container {
  height: 72.5%;
  width: 100%;
  background: #333;
  color: #fafafa;
  position: absolute;
  bottom: 7.5%;
}
.contact__chat {
  position: absolute;
  width: 37.5%;
  height: 72.5%;
  background: #fafafa;
  border-radius: 0.5em;
  top: 10%;
  left: 10%;
  overflow: hidden;
}
.contact__chat__top {
  width: 100%;
  height: 15%;
  position: absolute;
  top: 0;
  z-index: 10;
  background: #e1e1e1;
}
.contact__chat__top__container {
  padding: 5%;
  width: 90%;
  height: 50%;
  color: #333;
  font-weight: 600;
  overflow: hidden;
  line-height: 2em;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: left;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.contact__chat__img {
  height: 2.5em;
  width: auto;
  border-radius: 100%;
  vertical-align: top;
}
.contact__chat__img--green {
  height: 2.2em;
  border: 0.3 solid #27ae60;
}
.contact__chat__top__name {
  color: #333;
  font-weight: 600;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5%;
}
.contact__chat__bottom {
  width: 100%;
  height: 15%;
  position: absolute;
  bottom: 0;
  background: #c8c8c8;
}
.contact__chat__bottom__input {
  width: 60%;
  height: 70%;
  padding: 0 5%;
  border-radius: 0.5em 0 0 0.5em;
  position: absolute;
  left: 5%;
  top: 15%;
}
.contact__chat__bottom__send {
  width: 20%;
  height: 70%;
  border-radius: 0 0.5em 0.5em 0;
  position: absolute;
  right: 5%;
  top: 15%;
  background: #444;
  color: #f5f5f5;
  font-family: FontAwesome;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.contact__chat__box {
  width: 90%;
  height: 70%;
  padding: 0 5%;
  top: 15%;
  position: absolute;
}
.contact__chat__grid {
  display: grid;
  grid-gap: 0.5em;
  width: 100%;
  grid-template-columns: auto;
  height: 100%;
  overflow: auto;
  grid-auto-rows: min-content;
}
.contact__chat__grid ::-webkit-scrollbar-thumbg {
  height: 90%;
}
.contact__chat__message {
  width: 100%;
  height: auto;
}
.contact__chat__grid .contact__chat__message:first-child {
  margin-top: 5%;
}
.contact__chat__grid .contact__chat__message:last-child {
  margin-bottom: 5%;
}
.contact__chat__text {
  max-width: 70%;
  height: auto;
  background: #ececec;
  padding: 2.5% 5%;
  border-radius: 1em;
  display: inline-block;
  vertical-align: middle;
  font-size: 0.9em;
  margin: 0 2.5%;
  color: #333;
  font-weight: 550;
  word-break: break-all;
}
.chat__text--right {
  float: right;
  color: #fafafa;
  background: #555;
}
.contact__chat--info {
  position: absolute;
  width: 37.5%;
  height: 72.5%;
  top: 10%;
  left: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.contact__chat--info > div {
  background: rgba(0, 0, 0, 0.4);
  width: 70%;
  padding: 5%;
  border-radius: 0.5em;
  cursor: pointer;
}
/* (Modal info) About */

.contact__about {
  position: absolute;
  width: 37.5%;
  height: 72.5%;
  border-radius: 0.5em;
  top: 10%;
  right: 10%;
  overflow: hidden;
}
.contact__about__img {
  height: 25%;
  width: 35%;
  border-radius: 100%;
  border: 5px solid #e1e1e1;
  z-index: 10;
  position: absolute;
  left: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.contact__about__img i {
  font-size: 3em;
}
.contact__about__container {
  background: #eaeaea;
  border-radius: 0.5em;
  padding: 20% 0 0 0;
  width: 100%;
  height: 70%;
  position: absolute;
  bottom: 0;
}
.contact__about__elements {
  height: 100%;
  position: absolute;
  width: 100%;
}
.contact__about__icons {
  height: 75%;
}
.contact__about__icon {
  position: relative;
  left: 0;
  top: 0;
  width: 15%;
  padding: 5%;
  height: 15%;
  background: #dedede;
  color: #555;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: FontAwesome;
}
.contact__about__icon:nth-child(2) {
  background: #c3c3c3;
}
.contact__about__info {
  height: 75%;
  position: absolute;
  width: 100%;
  top: 0;
}
.about__info__el {
  width: 65%;
  height: 15%;
  position: relative;
  padding: 5%;
  text-align: center;
  font-weight: 600;
  color: #444;
  background: #bbbbbb;
  overflow: hidden;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}
.about__info__el:nth-child(2) {
  background: #ababab;
}
.contact__about__info div:last-child {
  height: 21%;
}
/* Login/Register */

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25em;
  height: 30em;
  background: #ececec;
  z-index: 10;
  border-radius: 0.5em;
  overflow: hidden;
}
.login__nav {
  position: absolute;
  top: 0;
  width: 100%;
  height: 15%;
  z-index: 10;
}
.login__nav__el {
  width: 50%;
  height: 100%;
  background: #dedede;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  font-weight: 600;
  font-size: 1.2em;
  color: #444;
  cursor: pointer;
}
.login__nav__el--active {
  background: #ececec;
}
.login__container {
  position: absolute;
  bottom: 0;
  width: 80%;
  height: 70%;
  padding: 10%;
  background: #ececec;
}
.login--card {
  position: absolute;
  width: 80%;
  height: 80%;
}
.login__btn--fb {
  width: 100%;
  height: 15%;
  background: #3b5998;
  border-radius: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fafafa;
  transition: 0.2s ease-in-out;
  cursor: pointer;
}
.login__btn--fb:before {
  content: "Login with Facebook";
  margin-right: -5%;
}
.login__btn--fb:after {
  content: "";
  font-family: FontAwesome;
  font-size: 1.5em;
  position: absolute;
  left: 5%;
}
.login__btn--fb:hover {
  background: #37528b;
}
.login__btn--fb:active {
  background: #324b7d;
}
.p--login {
  margin: 1em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: 600;
  color: #555;
}
.login__input {
  width: 90%;
  height: 20%;
  padding: 0 5%;
  font-size: 1.3em;
  margin-bottom: 1.2em;
  background: #fafafa;
  border-radius: 0.5em;
  transition: 0.2s ease-in-out;
}
.login__input:focus {
  background-color: #fff;
}
.login__input::-webkit-input-placeholder {
  opacity: 0.95;
}
.login__btn--login {
  height: 17.5%;
  width: 100%;
  background: #e1e1e1;
  border-radius: 0.25em;
  display: inline-flex;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  font-weight: 600;
  font-size: 1.2em;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.login--more .login__btn--login {
  background: #e4e4e4;
  width: 25%;
  font-family: FontAwesome;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.login--more .login__btn--login:last-child {
  font-family: inherit;
  background: #e1e1e1;
  float: right;
  width: 75%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0.25em;
  border-bottom-right-radius: 0.25em;
}
.login__btn--login:hover,
.login--more .login__btn--login:last-child:hover {
  background: #d8d8d8;
}
.login__btn--login:active,
.login--more .login__btn--login:last-child:active {
  background: #cecece;
}
.login__btn--rules {
  position: absolute;
  bottom: 0;
}
/* Add Modal */

textarea.modal--main__descr {
  background: #efefef;
  width: 40.5%;
  height: 48%;
  padding: 1%;
  left: 5%;
}
input.modal--main__title {
  width: 98%;
  padding: 0 1%;
  background: #efefef;
}
input.modal--main__title,
textarea.modal--main__descr:focus {
  background: #f5f5f5;
}
.modal--main__upload {
  height: 40%;
  background: #efefef;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.2em;
  color: #555;
  cursor: pointer;
}
.modal--main__upload {
  overflow: hidden;
  position: relative;
}
.modal--main__upload [type="file"] {
  cursor: inherit;
  display: block;
  font-size: 999px;
  filter: alpha(opacity=0);
  min-height: 100%;
  min-width: 100%;
  opacity: 0;
  position: absolute;
  right: 0;
  text-align: right;
  top: 0;
}
/* Header Dropdown menu */

.header__dropdown {
  position: relative;
  cursor: pointer;
}
.img--header__dropdown {
  width: 1.8em;
  height: 1.8em;
  border-radius: 100%;
  vertical-align: middle;
}
.header__dropdown__content {
  display: none;
  position: absolute;
  background-color: #f3f3f3;
  width: 10em;
  z-index: 100;
  margin-left: -7.4em;
  font-size: 0.7em;
  border-radius: 0 0 0.5em 0.5em;
  box-shadow: 0px 5px 20px -1px #44444440;
  overflow: hidden;
}
.header__dropdown__content a {
  color: #222;
  text-decoration: none;
  display: block;
  text-align: center;
  height: 3em;
  line-height: 3em;
  transition: 0.2s ease-in-out;
  overflow: hidden;
}
.header__dropdown__content a:hover {
  background-color: #ececec;
}
.header__dropdown__content a:active {
  background-color: #bcbcbc;
}
.header__dropdown:hover .header__dropdown__content {
  display: block;
}
.header__dropdown__content a:first-child {
  background: #e8e8e8;
  height: 4em;
  line-height: 4em;
  padding: 0 0.5em;
}
/* Profile */

/* Profile About */

.profile__about {
  position: relative;
  width: 20em;
  height: 35em;
  border-radius: 0.5em;
  overflow: hidden;
}
.profile__about img {
  height: 25%;
  width: 45%;
  border-radius: 100%;
  border: 5px solid #e1e1e1;
  z-index: 10;
  position: absolute;
  left: calc(25% + 10px);
}
.profile__about__container {
  background: #eaeaea;
  border-radius: 0.5em;
  padding: 20% 0 0 0;
  width: 100%;
  height: 70%;
  position: absolute;
  bottom: 0;
}
.profile__about__elements {
  height: 100%;
  font-size: 1.1em;
}
.profile__about__icons {
  height: 100%;
}
.profile__about__icon {
  position: relative;
  left: 0;
  top: 0;
  width: 17%;
  padding: 5%;
  height: 17%;
  background: #dedede;
  color: #555;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-family: FontAwesome;
}
.profile__about__info {
  height: 100%;
  margin-top: -122.5%;
}
.profile__about__upload [type="file"] {
  cursor: inherit;
  display: block;
  font-size: 999px;
  filter: alpha(opacity=0);
  min-height: 100%;
  min-width: 100%;
  opacity: 0;
  position: absolute;
  right: 0;
  text-align: right;
  top: 0;
}
.profile__info__el {
  width: 63%;
  height: 15%;
  position: relative;
  padding: 5%;
  text-align: center;
  font-weight: 600;
  color: #444;
  background: #bbbbbb;
  overflow: hidden;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile__about__info--big > input {
  height: 17%;
}
.profile__about__info--big > div {
  height: 17%;
}
.profile__about__icon:nth-child(2) {
  background: #c3c3c3;
}
.profile__info__el:nth-child(2) {
  background: #ababab;
}
.info__el--green {
  background: #27ae60;
  color: #f5f5f5;
}
.info__el--red {
  background: #c0392b;
  color: #f5f5f5;
}
/* Profile Messages */

.profile__messages {
  background: #f5f5f5;
  border-radius: 0.5em;
  width: 40em;
  height: 35em;
  overflow: hidden;
}
.messages__list__grid {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.profile__messages__list {
  height: 100%;
  width: 40%;
  background: #eaeaea;
  box-shadow: inset -10px 0px 0px 0px #ececec;
}
.profile__messages__box {
  width: 60%;
  height: 100%;
  float: right;
  margin-top: -35em;
}
.messages__list__title {
  width: 100%;
  height: 15%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-weight: 600;
  background: #dedede;
}
.messages__list__element {
  padding: 5% 10%;
  width: 80%;
  height: 7.5%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: left;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.messages__list__element:hover {
  background: #d6d6d6;
}
.messages__list__element:active {
  background: #c1c1c1;
}
.messages__list__element--active {
  box-shadow: inset -10px 0px 0px 0px #cecece;
}
@media only screen and (max-width: 1250px) {
  .main--container {
    width: 90%;
  }
  .header--container {
    max-width: 90%;
  }
  .latest--grid,
  .filtered--grid {
    grid-template-columns: auto auto;
  }
  .search__noresults {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
@media only screen and (max-width: 1100px) {
  .profile__messages {
    width: 22.5em;
    height: 35em;
  }
  .profile__messages__list {
    width: 20%;
  }
  .profile__messages__list--active {
    width: 100%;
  }
  .profile__messages__list--active .messages__list__title {
    font-family: Montserrat;
    font-size: 1.5em;
  }
  .messages__list__title {
    font-size: 200%;
    font-family: FontAwesome;
    cursor: pointer;
  }
  .messages__list__element {
    justify-content: center;
    padding: 10%;
  }
  .profile__messages__box {
    width: 80%;
  }
  .contact__chat__top__container {
    height: 65%;
  }
}
@media only screen and (max-width: 800px) {
  .latest--grid,
  .filtered--grid {
    grid-template-columns: auto;
  }
  .card {
    height: 30em;
  }
  .card:hover {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  #offerInfo,
  #addOffer {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  .section--profile {
    display: block;
  }
  .section--profile .profile__about {
    margin-bottom: 2em;
  }
  .profile__messages {
    width: 100%;
  }
  .section--profile .profile__about,
  .profile__messages {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .section--profile .contact__chat__top__container {
    height: 35%;
  }
  .section--profile .contact__chat__top__container img {
    height: 100%;
    vertical-align: middle;
    width: auto;
  }
  .search__input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .search__btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
@media only screen and (max-width: 500px) {
  .card {
    height: 20em;
  }
  .modal--main__container {
    height: auto;
    top: 30%;
    overflow: auto;
  }
  .modal--main__descr {
    width: 100%;
    height: auto;
    position: relative;
    margin-top: 1em;
    top: unset;
    padding-right: 0;
    overflow: hidden;
  }
  .modal--main__more {
    width: 100%;
    height: 50%;
    position: relative;
    margin-top: 1em;
    top: unset;
    right: 0;
    margin-bottom: 20%;
  }
  .contact__container {
    overflow: auto;
  }
  .contact__about {
    margin-top: 10%;
  }
  .contact__chat {
    margin-top: 10%;
  }
  .contact__about,
  .contact__chat,
  .contact__chat--info {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: unset;
    width: 60%;
    height: 25em;
    margin-bottom: 10%;
  }
  .contact__chat--info {
    height: 15em;
  }
  .contact__title {
    height: 15%;
  }
  .contact__container {
    top: 15%;
    height: 80%;
  }
  .contact__chat__bottom__input:focus .contact__chat {
    width: 100%;
    height: 100%;
  }
  .contact__chat__bottom__input:focus .contact__container {
    overflow: hidden;
  }
  textarea.modal--main__descr {
    width: 95%;
    padding: 2.5%;
    left: unset;
  }
  .login {
    width: 100%;
  }
  .section--profile .contact__chat__top__container {
    height: 65%;
    display: flex;
    align-items: center;
  }
  .section--profile .messages__list__element img {
    height: 50%;
  }
}
</style>