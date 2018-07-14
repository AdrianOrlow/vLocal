<template>
    <div>
          <div class="section section--latest">
              <div class="latest--container">
                <div class="section--search">
                    <div class="search--container">
                        <input class="search__input" placeholder="Search for anything" v-model.lazy="search" maxlength="55">
                        <div class="search__btn" @click="$parent.popup = !$parent.popup; $parent.showOptions = !$parent.showOptions"></div>
                    </div>
                </div>

                <div v-if="!search">
                    <h1 class="latest--title">Latest offers</h1>
                    <div class="latest--grid">
                        <div class="card" v-for="offer in latestOffers" v-bind:key="offer.id"  v-on:click="moreInfo(offer)">
                            <div class="card__loading">
                                <i class="fa fa-circle-o-notch fa-spin"></i>
                            </div>
                            <img class="card__img" :src="offer.img" :alt="offer.title">
                            <div class="card__container">{{offer.title}}</div>
                            <div class="card__info info__city">{{offer.local}}</div>
                            <div class="card__info info__price">{{offer.price}} $</div>
                        </div>
                    </div>
                </div>

                <div v-if="search">
                    <h1 class="filtered--title" v-if="this.$parent.windowWidth > 1200">Search results for "{{search}}":</h1>
                    <h1 class="latest--title" v-else>Search results:</h1>
                    <div class="search__noresults" v-if="!filteredOffers.length && search">NO RESULTS</div>
                    <div class="filtered--grid">
                        <div class="card" v-for="offer in filteredOffers" v-bind:key="offer.id"  v-on:click="moreInfo(offer)" v-if="offer.isvalid == true">
                            <div class="card__loading">
                                <i class="fa fa-circle-o-notch fa-spin"></i>
                            </div>
                            <img class="card__img" :src="offer.img" :alt="offer.title">
                            <div class="card__container">{{offer.title}}</div>
                            <div class="card__info info__city">{{offer.local}}</div>
                            <div class="card__info info__price">{{offer.price}} $</div>
                        </div>
                    </div>
                </div>
              </div>
        </div>
        <!-- <div @click="limit += 6" v-on:click="change" style=" position: relative; width: 7em; padding: 1em; background: #444; border-radius: .5em; color: #fafafa; text-transform: uppercase; font-weight: 600; cursor: pointer; top: 50%; left: 50%; transform: translate(-50%, 0%); ">Show more</div> -->
    </div>
</template>


<script>
import Firebase from "firebase/app";
window.latestOffersRef = db.ref("offers").limitToFirst(3);
export default {
  name: "Main",
  data: function() {
    return {
      user: null,
      search: null,
      limit: 20
    };
  },
  firebase: {
    latestOffers: latestOffersRef
  },
  watch: {
    user: function(user) {
      if (user) {
        this.$parent.user = user;
      }
    },
    filteredOffers: function() {
      if (this.filteredOffers.length > 0) {
        this.$parent.cards = this.filteredOffers.length;
      }
    },
    search: function() {
      if (!this.search) {
        this.$parent.cards = 3;
      }
    }
  },
  methods: {
    moreInfo: function(offer) {
      var more = this.$parent.$refs.offerinfoChild.moreInfo;
      var fields = [
        "title",
        "desc",
        "price",
        "local",
        "date",
        "img",
        "isvalid",
        "authoruid"
      ];
      fields.forEach(field => {
        more[field] = offer[field];
      });
      more.key = offer[".key"];
      document.getElementById("offerInfo").classList.remove("none");
      document.documentElement.scrollTop = 0;
      this.$parent.$refs.offerinfoChild.loadInfo();
      this.$parent.popup = true;
    },
    change: function() {
      var optionsRef = this.$parent.options;
      var dbRef = db.ref("offers");
      var newRef;
      if (optionsRef.city) {
        newRef = dbRef
          .orderByChild(optionsRef.sortBy)
          .equalTo(optionsRef.city)
          .limitToFirst(this.limit);
      } else if (optionsRef.priceMin || optionsRef.priceMax) {
        newRef = dbRef
          .orderByChild(optionsRef.sortBy)
          .startAt(optionsRef.priceMin)
          .endAt(optionsRef.priceMax)
          .limitToFirst(this.limit);
      } else if (optionsRef.sortBy) {
        newRef = dbRef.orderByChild(optionsRef.sortBy).limitToFirst(this.limit);
      } else {
        newRef = dbRef.limitToFirst(this.limit);
      }
      this.$bindAsArray("offers", newRef);
    }
  },
  computed: {
    filteredOffers() {
      var optionsRef = this.$parent.options;
      if (
        this.search &&
        !optionsRef.city &&
        !optionsRef.priceMin &&
        !optionsRef.priceMax &&
        !optionsRef.sortBy
      ) {
        return this.offers.filter(offer => {
          return (
            offer.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
          );
        });
      } else {
        return this.offers;
      }
    }
  },
  beforeMount() {
    var offersRef = db.ref("offers").limitToFirst(this.limit);
    this.$bindAsArray("offers", offersRef);
    this.$parent.cards = 3;
  }
};
</script>
