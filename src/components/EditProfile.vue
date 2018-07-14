<template>
    <div class="modal--main profile__about" style="position: absolute; background: rgba(0,0,0,0);">
        <label class="profile__about__upload">
            <img style="cursor: pointer;" alt="John Doe" :src="userInfo.profileimg">
            <input id="file" v-on:change="uploadFile" type="file"/>
        </label>
		<div class="profile__about__container">
			<div class="profile__about__elements">
				<div class="profile__about__icons">
					<div class="profile__about__icon icon"></div>
					<div class="profile__about__icon icon"></div>
					<div class="profile__about__icon icon"></div>
				</div>
				<div class="profile__about__info profile__about__info--big">
					<input class="profile__info__el" placeholder="Name" v-model="userInfo.name">
                    <input class="profile__info__el" placeholder="City" v-model="userInfo.city">
                    <input class="profile__info__el" placeholder="Phone number" v-model="userInfo.phone">
					<div class="profile__info__el" style="width: 90%;background: #2980b9;color: #fafafa;cursor: pointer;" v-on:click="saveInfo">
						Save
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Firebase from "firebase/app";
export default {
  name: "EditProfile",
  data: function() {
    return {
      userInfo: {
        profileimg: "",
        name: "",
        city: "",
        phone: "",
        isonline: ""
      }
    };
  },
  methods: {
    loadInfo: function() {
      var uid = Firebase.auth().currentUser.uid;
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
    },
    saveInfo: function() {
      var uid = Firebase.auth().currentUser.uid;
      Firebase.database()
        .ref("users/")
        .child(uid)
        .set({
          name: this.userInfo.name,
          city: this.userInfo.city,
          phone: this.userInfo.phone,
          profileimg: this.userInfo.profileimg,
          isonline: this.userInfo.isonline
        });
      this.$toasted.show("Profile info updated successfully!", {
        theme: "primary",
        position: "bottom-right",
        duration: 5000
      });
      this.$parent.popup = false;
      this.$parent.editProfile = false;
    },
    uploadFile() {
      var ref = Firebase.storage().ref("profileimg/");
      var file = document.querySelector("#file").files[0];
      var name = +new Date() + "-" + file.name;
      var metadata = {
        contentType: file.type
      };
      var task = ref.child(name).put(file, metadata);
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => (this.userInfo.profileimg = url));
    }
  },
  beforeMount() {
    this.loadInfo();
  }
};
</script>