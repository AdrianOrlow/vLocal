<template>
            <div class="section section--profile">
                <div class="profile__about">
                    <img :src="userInfo.profileimg" :alt="userInfo.name">
                    <div class="profile__about__container">
                        <div class="profile__about__elements">
                            <div class="profile__about__icons">
                                <div class="profile__about__icon icon"></div>
                                <div class="profile__about__icon icon"></div>
                                <div class="profile__about__icon icon"></div>
                            </div>
                            <div class="profile__about__info profile__about__info--big">
                                <div class="profile__info__el">{{userInfo.name}}</div>
                                <div class="profile__info__el">{{userInfo.city}}</div>
                                <div class="profile__info__el">{{userInfo.phone}}</div>
                                <div class="profile__info__el info__el--green" style="width: 90%;" v-if="userInfo.isonline">Online</div>
                                <div class="profile__info__el info__el--red" style="width: 90%;" v-else>Offline</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile__messages">
                    <div class="profile__messages__list" v-bind:class="{ 'profile__messages__list--active': showList}">
                        <div class="messages__list__title" v-if="$parent.windowWidth > 1100 || showList">Messages</div>
						<div class="messages__list__title" v-else @click="showList = !showList"></div>
                        <div class="messages__list__grid" v-if="chatsShow && conversatorsUidsRef.length > 0">
                            <div
                            class="messages__list__element"
                            v-for="conversator in conversators"
                            v-bind:key="conversator.id"
                            v-if="conversatorsUidsRef.includes(conversator['.key'])"
                            v-on:click="startChat(conversator)">
                                <img :src="conversator.profileimg" :alt="conversator.name" class="contact__chat__img" style="height: 100%; vertical-align: middle;">
                                <p class="contact__chat__top__name" v-if="$parent.windowWidth > 1100 || showList">{{conversator.name}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="profile__messages__box" v-if="messaging" v-bind:class="{ 'block--none': showList}">
                        <div class="contact__chat__top" style="position: relative;">
                                <div class="contact__chat__top__container" >
                                    <img class="contact__chat__img" :src="conversatorInfo.profileimg" :alt="conversatorInfo.name" v-bind:class="{ 'contact__chat__img--green': conversatorInfo.isonline == true}">
                                    <p class="contact__chat__top__name">{{conversatorInfo.name}}</p>
                                </div>
                            </div>
                            <div class="contact__chat__box" style="position: relative;top: 0;">
                                <div class="contact__chat__grid">
                                    <div class="contact__chat__message" v-for="message in messages" v-bind:key="message.id">
                                        <img class="contact__chat__img" v-if="message.uid != useruid" :src="userInfo.profileimg" :alt="userInfo.name">
                                        <div class="contact__chat__text" v-if="message.uid != useruid">{{message.text}}</div>
                                        <div class="contact__chat__text chat__text--right" v-else>{{message.text}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="contact__chat__bottom" style="position: relative;">
                                <div class="contact__chat__bottom__container">
                                    <input v-model="message" type="text" placeholder="Type a message" class="contact__chat__bottom__input">
                                    <div v-on:click="sendMessage" class="contact__chat__bottom__send"></div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script>
import Firebase from "firebase/app";
export default {
  name: "Profile",
  data: function() {
    return {
      message: "",
      useruid: "",
      messaging: false,
      chatsShow: false,
      showList: false,
      conversatorsUidsRef: {},
      userInfo: {
        name: "",
        city: "",
        phone: "",
        profileimg: "",
        isonline: null
      },
      conversatorInfo: {
        name: "",
        profileimg: "",
        isonline: null
      }
    };
  },
  beforeCreate: function() {
    if (this.$parent.user == null) {
      this.$router.replace("/");
    }
  },
  methods: {
    loadInfo: function() {
      var uid = Firebase.auth().currentUser.uid;
      this.useruid = uid;
      Firebase.database()
        .ref("users/" + uid)
        .on(
          "value",
          snapshot => {
            var fields = ["name", "city", "phone", "profileimg", "isonline"];
            var info = this.userInfo;
            fields.forEach(field => {
              info[field] = snapshot.val()[field];
            });
          },
          error => {
            this.$toasted.show("Error: " + error.message, {
              theme: "primary",
              position: "bottom-right",
              duration: 5000
            });
          }
        );
      Firebase.database()
        .ref("users/" + uid + "/conversators")
        .once("value", snapshot => {
          if (snapshot.val() != null) {
            this.conversatorsUidsRef = Object.keys(snapshot.val());
          }
        });
      var conversatorsRef = Firebase.database()
        .ref()
        .child("users");
      this.$bindAsArray("conversators", conversatorsRef);
      this.chatsShow = true;
      this.$parent.cards = 3;
    },
    startChat: function(conversator) {
      var user1 = this.$parent.user.uid;
      var user2 = conversator[".key"];
      var key = user1 < user2 ? user1 + "_" + user2 : user2 + "_" + user1;
      window.messagesRef = Firebase.database()
        .ref("chats/" + key)
        .child("messages");
      Firebase.database()
        .ref("chats")
        .orderByKey()
        .equalTo(key)
        .once("value", snapshot => {
          var messagesData = snapshot.val();
          this.$bindAsArray("messages", messagesRef);
        });
      Firebase.database()
        .ref("users/" + conversator[".key"])
        .on("value", snapshot => {
          var fields = ["name", "profileimg", "isonline"];
          var info = this.conversatorInfo;
          fields.forEach(field => {
            info[field] = snapshot.val()[field];
          });
        });
      this.messaging = true;
      this.showList = false;
    },
    sendMessage: function() {
      var date = new Date();
      messagesRef.push({
        text: this.message,
        time: date,
        uid: this.$parent.user.uid
      });
    }
  },
  beforeMount() {
    this.loadInfo();
  }
};
</script>