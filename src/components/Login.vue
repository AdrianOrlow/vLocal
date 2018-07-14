<template>
    <div>
        <div class="login">
            <div class="login__nav">
                <div class="login__nav__el" v-bind:class="{ 'login__nav__el--active': login}" @click="login = true">Login</div>
                <div class="login__nav__el" v-bind:class="{ 'login__nav__el--active': !login}" style="float: right;" @click="login = false">Signup</div>
            </div>
            <div class="login__container">
                <form class="login--card" v-if="login" @submit.prevent="login">
                    <div class="login__btn--fb" v-on:click="signInWithFacebook"></div>
                    <p class="p--login">OR</p>
                    <input type="email" v-model="email" placeholder="E-mail" class="login__input" required>
                    <input type="password" v-model="password" placeholder="Password" class="login__input" required>
                    <div class="login__btn--login" v-on:click="signIn">Login</div>
                </form>
                <div class="login--card" v-if="!login">
                    <div class="login__btn--fb"></div>
                    <p class="p--login">OR</p>
                    <input type="email" v-model="email" placeholder="E-mail" class="login__input" required>
                    <input type="password" v-model="password" placeholder="Password" class="login__input" required>
					<router-link :to="{ name: 'Terms'}" target="_blank">
						<div class="login__btn--login login__btn--rules" v-if="!agreed" @click="agreed = !agreed; ">I agree to the terms & conditions</div>
					</router-link>
                    <div class="login__btn--login" v-if="agreed && email && password" @click="more = !more">Register</div>
                    <div class="login__btn--login" v-else style="pointer-events: none; background: rgba(0,0,0,0);">Enter email & password</div>
                </div>
            </div>
        </div>
        <div class="login" v-if="more">
            <div class="login__container" style="height: 83%;">
                <div class="login--card login--more">
                    <p class="p--login" style="margin: 0;font-size: 1.4em;margin-bottom: 1.4em;">One more thing</p>
                    <input v-model="name" type="text" placeholder="Name" required class="login__input" style="height: 17.5%;">
                    <input v-model="city" type="text" placeholder="City" required class="login__input" style="height: 17.5%;">
                    <input v-model="phone" type="text" placeholder="Phone number" class="login__input" style="height: 17.5%;" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                    <div class="login__btn--login" @click="more = !more"></div>
                    <div class="login__btn--login" v-on:click="signUp">Register</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Firebase from "firebase/app";
import "firebase/auth";
import Toasted from "vue-toasted";
export default {
  name: "Login",
  data: function() {
    return {
      login: false,
      agreed: false,
      more: false,
      email: "",
      password: "",
      name: "",
      city: "",
      phone: "",
      profileimg:
        "https://firebasestorage.googleapis.com/v0/b/vlocal-ato.appspot.com/o/profileimg%2Fdefault.png?alt=media&token=a6b91976-6678-43c0-b6f7-c38d52d7fb5d",
      user: null,
      userId: null
    };
  },
  beforeCreate: function() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$parent.user = user;
      }
    });
  },
  methods: {
    signIn: function() {
      Firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$parent.popup = false;
            this.$parent.loginPopup = false;
            this.$toasted.show("Logged in", {
              theme: "primary",
              position: "bottom-right",
              duration: 5000
            });
          },
          err => {
            this.$toasted.show("Error: " + err.message, {
              theme: "primary",
              position: "bottom-right",
              duration: 5000
            });
          }
        );
    },
    signUp: function() {
      Firebase.auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$parent.popup = false;
            this.$parent.loginPopup = false;
            var uid = Firebase.auth().currentUser.uid;
            Firebase.database()
              .ref("users/" + uid)
              .set({
                name: this.name,
                city: this.city,
                phone: this.phone,
                profileimg: this.profileimg,
                isonline: true
              });
            this.$toasted.show("Signed up", {
              theme: "primary",
              position: "bottom-right",
              duration: 5000
            });
          },
          err => {
            this.$toasted.show("Error: " + err.message, {
              theme: "primary",
              position: "bottom-right",
              duration: 5000
            });
          }
        );
    },
    signInWithFacebook: function() {
      var provider = new Firebase.auth.FacebookAuthProvider();
      Firebase.auth()
        .signInWithPopup(provider)
        .then(
          user => {
            this.$parent.loginPopup = false;
            var uid = Firebase.auth().currentUser.uid;
            Firebase.database()
              .ref("users/" + uid)
              .on("value", snapshot => {
                if (snapshot.val().name == "") {
                  this.$parent.editProfile = true;
                } else {
                  this.$parent.popup = false;
                }
              });
            this.$toasted.show("Signed up", {
              theme: "primary",
              position: "bottom-right",
              duration: 5000
            });
          },
          err => {
            this.$toasted.show("Error: " + err.message, {
              theme: "primary",
              position: "bottom-right",
              duration: 5000
            });
          }
        );
    }
  },
  watch: {
    login: function(login) {
      var loginBtn = document.getElementsByClassName("login__nav__el")[0];
      var registerBtn = document.getElementsByClassName("login__nav__el")[1];
      if (login) {
        loginBtn.classList.add("login__nav__el--active");
        registerBtn.classList.remove("login__nav__el--active");
      } else {
        loginBtn.classList.remove("login__nav__el--active");
        registerBtn.classList.add("login__nav__el--active");
      }
    },
    user: function(user) {
      if (user) {
        this.$parent.user = user;
      }
    }
  }
};
</script>