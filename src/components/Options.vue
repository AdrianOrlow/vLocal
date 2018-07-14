<template>
    <div style=" position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); width: 25em; height: 20em; background: #ececec; z-index: 10; border-radius: 0.5em; overflow: hidden; ">
        <div style="height: 75%; width: 80%; padding: 10%;">
            <p style=" font-size: 1.2em; font-weight: 600; text-align: center; margin-bottom: 1.5em; ">Search options</p>
            <div style=" float: left; width: 30%; padding: .5em; font-size: 1.25em; background: #e5e5e5; border-radius: .25em; ">Sort by:</div>
            <select v-model="$parent.options.sortBy" style="float: right; height: 1.5em; width: 55%; box-sizing: unset; border: none; padding: .5em; border-radius: .5em; ">
                <option value="local">City</option>
                <option value="price">Price</option>
                <option value="title">Title</option>
            </select>
            <input v-model="$parent.options.city" v-if="$parent.options.sortBy == 'local'" placeholder="City" style=" margin-top: 1em; width: 90%; padding: 5%; padding: 5%; border-radius: .5em; ">
            <div v-if="$parent.options.sortBy == 'price'">
                <input v-model="$parent.options.priceMin" placeholder="Price min" style=" margin-top: 5%; width: 37.5%; padding: 5%; padding: 5%; border-radius: .5em; ">
                <input v-model="$parent.options.priceMax" placeholder="Price max" style=" margin-top: 1em; width: 37.5%; padding: 5%; border-radius: .5em; float: right; ">
            </div>
            <div v-on:click="updateOptions" @click="$parent.popup = !$parent.popup; $parent.showOptions = !$parent.showOptions" class="" style=" padding: 5%; width: 90%; background: #e1e1e1; border-radius: 0.25em; display: inline-flex; align-items: center; text-align: center; font-weight: 600; font-size: 100%; justify-content: center; cursor: pointer; transition: 0.2s ease-in-out; margin-top: 1em; ">Save </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "Options",
  data: function() {
    return {};
  },
  methods: {
    updateOptions: function() {
      this.$parent.$refs.main.change();
    }
  }
};
</script>