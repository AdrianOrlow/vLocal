<template>
        <div class="modal--main">
                <label class="modal--main__upload">
                    <img class="modal--main__img" :src="addOffer.img">
                    Click here to add image (<5MB)
                    <input id="file" v-on:change="uploadFile" type="file" accept="image/*"/>
                </label>
                <div class="modal--main__container">
                    <input class="modal--main__title" placeholder="Click here to type title" v-model="addOffer.title">
                    <textarea class="modal--main__descr" placeholder="Click here to type description" v-model="addOffer.desc"></textarea>
                    <div class="modal--main__more">
                        <div class="more__icons">
                            <div class="more__el__icon icon"></div>
                            <div class="more__el__icon icon" style="background: #666;"></div>
                            <div class="more__el__icon icon"></div>
                            <div class="more__el__icon icon" style="background: #2ecc71;"></div>
                        </div>
                        <div class="more__info">
                            <input class="more__el more__el--one" placeholder="Price" maxlength="18" v-model="addOffer.price" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                            <input class="more__el more__el--two" placeholder="City" maxlength="18" v-model="addOffer.local">
                            <div class="more__el more__el--three">{{addOffer.date}}</div>
                            <div class="more__el more__el--four">Valid</div>
                        </div>
                    </div>
                </div>
            <div class="modal--main__btn info__close" v-bind:class="{ 'info__close--round': !addOffer.img || !addOffer.title || !addOffer.desc || !addOffer.price || !addOffer.local}" v-on:click="closeAddOffer">Close</div>
            <div class="modal--main__btn info__contact" v-if="addOffer.img && addOffer.title && addOffer.desc && addOffer.price && addOffer.local" v-on:click="newOffer">Send</div>
        </div>
</template>

<script>
import Firebase from "firebase/app";
import "firebase/storage";

export default {
  name: "AddOffer",
  data: function() {
    return {
      addOffer: {
        title: "",
        desc: "",
        price: "",
        local: "",
        date: "",
        isvalid: true,
        img: "",
        authoruid: ""
      }
    };
  },
  methods: {
    initAddOffer() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      today = dd + "." + mm + "." + yyyy;
      this.addOffer.date = today;

      var uid = Firebase.auth().currentUser.uid;
      this.addOffer.authoruid = uid;
    },
    closeAddOffer() {
      this.$parent.addOffer = false;
      this.$parent.popup = false;
    },
    uploadFile() {
      var ref = Firebase.storage().ref("offerimg/");
      var file = document.querySelector("#file").files[0];
      var name = +new Date() + "-" + file.name;
      var metadata = { contentType: file.type };
      var task = ref.child(name).put(file, metadata);
      this.$toasted.show("Uploading...", {
        theme: "primary",
        position: "bottom-right",
        duration: 5000
      });
      task.then(snapshot => snapshot.ref.getDownloadURL()).then(
        url => (this.addOffer.img = url),
        error => {
          this.$toasted.show("Error: " + error.code, {
            theme: "primary",
            position: "bottom-right",
            duration: 5000
          });
        }
      );
    },
    newOffer() {
      let offersRef = db.ref("offers");
      offersRef.push(this.addOffer);
      this.$toasted.show("Offer added successfully!", {
        theme: "primary",
        position: "bottom-right",
        duration: 5000
      });
      this.closeAddOffer();
    }
  },
  beforeMount() {
    this.initAddOffer();
  }
};
</script>
