<template>
        <div class="modal--main">
            <div>
                <img v-if="!edit" class="modal--main__img" :src="moreInfo.img" :alt="moreInfo.title" @click="showFullPhoto = !showFullPhoto">
                <label v-if="edit" class="modal--main__upload" style="position: unset;">
                    <img class="modal--main__img" :src="moreInfo.img">
                    Click here to add image (<5MB)
                    <input id="file" v-on:change="uploadFile" type="file" accept="image/*"/>
                </label>
                <div class="modal--main__container" v-if="!edit">
                    <h2 class="modal--main__title">{{moreInfo.title}}</h2>
                    <div class="modal--main__descr">{{moreInfo.desc}}</div>
                    <div class="modal--main__more">
                        <div class="more__icons">
                            <div class="more__el__icon icon"></div>
                            <div class="more__el__icon icon" style="background: #666;"></div>
                            <div class="more__el__icon icon"></div>
                            <div class="more__el__icon icon more__el__icon--green" v-if="moreInfo.isvalid == true"></div>
                            <div class="more__el__icon icon more__el__icon--red" v-else></div>
                        </div>
                        <div class="more__info" style="height: 100%;">
                            <div class="more__el more__el--one">{{moreInfo.price}} $</div>
                            <div class="more__el more__el--two">{{moreInfo.local}}</div>
                            <div class="more__el more__el--three">{{moreInfo.date}}</div>
                            <div class="more__el more__el--four" v-if="moreInfo.isvalid == true">Valid</div>
                            <div class="more__el more__el--four info__el--red" v-else>Invalid</div>
                        </div>
                    </div>
                </div>

                <div class="modal--main__container" v-if="edit">
                    <input class="modal--main__title" placeholder="Click here to type title" v-model="moreInfo.title">
                    <textarea class="modal--main__descr" placeholder="Click here to type description" v-model="moreInfo.desc"></textarea>
                    <div class="modal--main__more">
                        <div class="more__icons">
                            <div class="more__el__icon icon"></div>
                            <div class="more__el__icon icon" style="background: #666;"></div>
                            <div class="more__el__icon icon"></div>
                            <div class="more__el__icon icon more__el__icon--green" v-if="moreInfo.isvalid == true"></div>
                            <div class="more__el__icon icon more__el__icon--red" v-else></div>
                        </div>
                        <div class="more__info" style="height: 100%;">
                            <input v-model="moreInfo.price" placeholder="Price" maxlength="18" class="more__el more__el--one" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                            <input v-model="moreInfo.local" placeholder="City" maxlength="18" class="more__el more__el--two">
                            <div class="more__el more__el--three">{{moreInfo.date}}</div>
                            <select v-model="moreInfo.isvalid" class="more__el more__el--four" style="box-sizing: unset; border: none;">
                                <option :value="true" selected>Valid</option>
                                <option :value="false">Invalid</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal--main__btns">
                    <div class="modal--main__btn info__close" v-on:click="closeInfo">Close</div>
                    <div v-if="!edit">
                        <div class="modal--main__btn info__contact" v-if="moreInfo.authoruid != useruid" v-on:click="showContact">Contact</div>
                        <div v-else>
                            <div class="modal--main__btn info__contact" style=" background: #3498db; width: 15%; right: 25%;" @click="edit = !edit;">Edit</div>
                            <div class="modal--main__btn info__contact" style=" background: #e74c3c; width: 15%;" v-on:click="deleteOffer">Delete</div>
                        </div>
                    </div>
                    <div class="modal--main__btn info__contact" v-if="edit" v-on:click="updateOffer">Update</div>
                </div>
            </div>
            <div class="modal--main__contact" v-if="contact">
                <div class="contact__title">Contact</div>
                    <div class="contact__container">
                        <div class="contact__chat" v-if="useruid" v-bind:class="{ 'block--blur': !messaging}">
                            <div class="contact__chat__top">
                                <div class="contact__chat__top__container">
                                    <img class="contact__chat__img" style="height: 100%; vertical-align: middle;" :src="userInfo.profileimg" :alt="userInfo.name">
                                    {{userInfo.name}}
                                </div>
                            </div>
                            <div class="contact__chat__box">
                                <div class="contact__chat__grid" v-if="messaging">
                                    <div class="contact__chat__message" v-for="message in messages" v-bind:key="message.id">
                                        <img class="contact__chat__img" v-if="message.uid != useruid" :src="userInfo.profileimg" :alt="userInfo.name">
                                        <div class="contact__chat__text" v-if="message.uid != useruid">{{message.text}}</div>
                                        <div class="contact__chat__text chat__text--right" v-else>{{message.text}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="contact__chat__bottom">
                                <div class="contact__chat__bottom__container">
                                    <input type="text" placeholder="Type a message" class="contact__chat__bottom__input" v-model="message">
                                    <div class="contact__chat__bottom__send" v-on:click="sendMessage"></div>
                                </div>
                            </div>
                        </div>
                        <div class="contact__chat--info" v-if="useruid && !messaging"><div v-on:click="startChat">Click here to start conversation</div></div>
                        <div class="contact__chat--info" v-if="!useruid"><div style="cursor: initial;background: rgba(0,0,0,.2);">Login to start conversation</div></div>
                        <div class="contact__about">
                            <div class="contact__about__img" style="background: #e1e1e1;">
                                <i class="fa fa-circle-o-notch fa-spin" style="font-size: 5em; color: #666;"></i>
                            </div>
                            <img class="contact__about__img" :src="userInfo.profileimg" :alt="userInfo.name">
                            <div class="contact__about__container">
                                <div class="contact__about__elements">
                                    <div class="contact__about__icons">
                                        <div class="contact__about__icon icon"></div>
                                        <div class="contact__about__icon icon"></div>
                                        <div class="contact__about__icon icon"></div>
                                    </div>
                                    <div class="contact__about__info">
                                        <div class="about__info__el">{{userInfo.name}}</div>
                                        <div class="about__info__el">{{userInfo.city}}</div>
                                        <div class="about__info__el">{{userInfo.phone}}</div>
                                        <div class="profile__info__el info__el--green" style="width: 90%;" v-if="userInfo.isonline">Online</div>
                                        <div class="profile__info__el info__el--red" style="width: 90%;" v-else>Offline</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="modal--main__btn info__close" style="width: 90%;" @click="contact = !contact">Back</div>
            </div>
        </div>
</template>

<script>
import Firebase from "firebase/app";
import "firebase/storage";
export default {
  name: "OfferInfo",
  data: function() {
    return {
      contact: false,
      showFullPhoto: false,
      edit: false,
      messaging: false,
      useruid: "",
      message: "",
      moreInfo: {
        title: "",
        desc: "",
        price: "",
        local: "",
        date: "",
        img: "",
        isvalid: null,
        authoruid: "",
        key: ""
      },
      userInfo: {
        profileimg: "",
        name: "",
        city: "",
        phone: "",
        isonline: null
      }
    };
  },
  watch: {
    showFullPhoto: function() {
      var photo = document.getElementsByClassName("modal--main__img")[0];
      var info = document.getElementsByClassName("modal--main__container")[0];
      var btns = document.getElementsByClassName("modal--main__btns")[0];
      if (this.showFullPhoto) {
        photo.classList.add("main__img--showfull");
        info.classList.add("block--blur");
        btns.classList.add("block--blur");
      } else {
        photo.classList.remove("main__img--showfull");
        info.classList.remove("block--blur");
        btns.classList.remove("block--blur");
      }
    },
    "moreInfo.isvalid": function() {
      if (this.edit) {
        var select = document.getElementsByClassName("more__el--four")[0];
        if (this.moreInfo.isvalid == true) {
          select.classList.remove("info__el--red");
        } else {
          select.classList.add("info__el--red");
        }
      }
    }
  },
  methods: {
    closeInfo: function() {
      this.edit = false;
      this.$parent.popup = false;
      document.getElementById("offerInfo").classList.add("none");
    },
    loadInfo: function() {
      if (this.$parent.user) {
        this.messaging = false;
        this.useruid = this.$parent.user.uid;
        var user1 = this.moreInfo.authoruid;
        var user2 = this.useruid;
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
            if (messagesData) {
              this.messaging = true;
              this.$bindAsArray("messages", messagesRef);
            }
          });
      }
    },
    startChat: function() {
      var userRef = Firebase.database()
        .ref("users/" + this.useruid)
        .child("conversators");
      var author = this.moreInfo.authoruid;
      userRef.child(author).set(true);
      var authorRef = Firebase.database()
        .ref("users/" + this.moreInfo.authoruid)
        .child("conversators");
      var user = this.useruid;
      authorRef.child(user).set(true);
      this.messaging = true;
      this.$bindAsArray("messages", messagesRef);
    },
    showContact: function() {
      var uid = this.moreInfo.authoruid;
      Firebase.database()
        .ref("users/" + uid)
        .on(
          "value",
          snapshot => {
            var uinfo = this.userInfo;
            var fields = ["profileimg", "name", "city", "phone", "isonline"];
            fields.forEach(field => {
              uinfo[field] = snapshot.val()[field];
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
      this.contact = true;
    },
    updateOffer: function() {
      var data = this.moreInfo;
      Firebase.database()
        .ref("offers/")
        .child(data.key)
        .set({
          title: data.title,
          desc: data.desc,
          price: data.price,
          local: data.local,
          date: data.date,
          img: data.img,
          isvalid: data.isvalid,
          authoruid: data.authoruid
        });
      this.edit = false;
      this.$parent.popup = false;
      document.getElementById("offerInfo").classList.add("none");
      this.$toasted.show("Offer updated successfully!", {
        theme: "primary",
        position: "bottom-right",
        duration: 5000
      });
    },
    deleteOffer: function() {
      Firebase.database()
        .ref("offers/")
        .child(this.moreInfo.key)
        .remove();
      this.$parent.popup = false;
      document.getElementById("offerInfo").classList.add("none");
      this.$toasted.show("Removed offer successfully!", {
        theme: "primary",
        position: "bottom-right",
        duration: 5000
      });
    },
    uploadFile: function() {
      var ref = Firebase.storage().ref("offerimg/");
      var file = document.querySelector("#file").files[0];
      var name = +new Date() + "-" + file.name;
      var metadata = {
        contentType: file.type
      };
      var task = ref.child(name).put(file, metadata);
      this.$toasted.show("Uploading...", {
        theme: "primary",
        position: "bottom-right",
        duration: 5000
      });
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => (this.moreInfo.img = url));
    },
    sendMessage: function() {
      var date = new Date();
      messagesRef.push({
        text: this.message,
        time: date,
        uid: this.useruid
      });
    }
  }
};
</script>