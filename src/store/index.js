import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import axios from 'axios'
export default new Vuex.Store({
  state: {
    addresses: [
    ],
  },
  mutations: {
    addAddress(state, address) {
      state.addresses.push(address)
    },

    editAddress(state, address) {

      for(let index in state.addresses)
      {
        if(state.addresses[index].addresses.id == address.address.id){
          console.log(index)
          state.addresses[index].addresses = address.address
        }
      }
    },

    deleteAddress(state, address) {
      state.addresses.reverse().splice(address, 1)
    },
  },
  actions: {
    async getAddressByCEP(context, cep) {
      const url = `https://viacep.com.br/ws/${cep}/json/`
      return await axios.get(url).then(response => response.data)
    },
    addAddressAction(context, address) {
      context.commit('addAddress', address)
    },
    editAddressAction(context, address) {
      context.commit('editAddress', address)
    },
    deleteAddressAction(context, address) {
      context.commit('deleteAddress', address)
    },
  },
})