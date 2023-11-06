<template>
	<div>
		<div>
			<v-row class="ma-1">
				<v-col md="6">
					<v-text-field type="number" counter="8" 
						:rules="[rules.requiredCep, rules.countCaracters]" 
						:label="$t('addressInput.text.CEP')" 
						v-model="cep"
						:prepend-icon="$t('addressInput.icons.CEP')"
					></v-text-field>
				</v-col>

				<v-col md="3">
					<v-btn :disabled="!isCepInputValid" color="primary" @click="getAddress" elevation="2">
						<v-icon light>{{$t('addressInput.icons.search')}}</v-icon>
						{{$t('addressInput.text.btnSearch')}}
					</v-btn>
				</v-col>

				<v-col md="3">
					<v-btn :disabled="!isAddressValid" color="success" @click="saveAddress" elevation="2">
						<v-icon light>{{$t('addressInput.icons.save')}}</v-icon>
						{{$t('addressInput.text.btnSave')}}
					</v-btn>
				</v-col>
			</v-row>			
		</div>
		
		<template v-if="addressData">
			<v-list class="address-list px-2 py-1 ">
				<v-text-field class="mx-4" label="Titulo" :rules="[rules.requiredTitle]" v-model="addressData.title"></v-text-field>
				
				<div class="overflowList">
					<v-list-item v-for="(item, index) in dataAddress()" :key="index" two-line>	
						<v-list-item-content>
							<v-list-item-title>{{item.infoTittle}}:{{item.value}}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>

					<v-text-field class="mx-4" label="Complemento" 
						v-model="addressData.complemento"
					></v-text-field>
				</div>
				
			</v-list>
		</template>

		<div v-if="!addressData">
			<div>
				<v-alert
					border="bottom"
					colored-border
					type="warning"
					elevation="2"
				>
					{{$t('addressInput.validation.warningAddress')}}
				</v-alert>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	props: {
		initialContent: String, // Prop para receber o valor do conteúdo inicial
		receivedCep:String
	},
	data() {
		return {
			cep: '',
			addressData: null,
			address:null,
			addressOld:'',

			informationData:[],

			rules: {
				requiredCep: value => !!value || this.$t('addressInput.validation.emptyCep'),
				countCaracters: v => v.length === 8 || this.$t('addressInput.validation.invalidCep'),
				requiredTitle:value => !!value || this.$t('addressInput.validation.emptyTitle'),
			},
		};
	},
	computed: {
		isCepInputValid() {
			const numericCep = this.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
			return numericCep.length === 8; // Verifica se o campo tem exatamente 8 números
		},

		isAddressValid(){
			return this.addressData && this.addressData.title
		}
	},
	methods: {
		async getAddress() {

			console.log(this.address)
			
			this.addressData = await this.$store.dispatch('getAddressByCEP', this.cep)
			this.dataAddress()

		},

		saveAddress() {
			
			if (this.addressData) {
				
			
				const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || {};

				console.log(this.addressData)
				

				console.log(this.$store.state.addresses)
				
				const timestamp = Date.now();

				let id = this.isEditable() ? this.addressOld.id : timestamp

				if( this.addressOld.id){
					console.log('teste')
					
					this.$store.dispatch('editAddressAction', {
						address: this.addressData,
					})
				} else {
					this.$store.dispatch('addAddressAction', {
						addresses: this.addressData,
					})
				}
				savedAddresses[id] = this.registerAddress(id)

				localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));

				this.$emit('closeModal');
			}
		},

		isEditable(){
			return this.initialContent && this.addressOld.id ? true : false
		},

		registerAddress(id){
			let addressData = this.addressData
			
			addressData.id = id
			addressData.created = this.isEditable() ? this.addressOld.created : new Date()
			addressData.updated = new Date()
			addressData.updated = new Date()

			return addressData
		},

		dataAddress(){
			let data = []
			
			if( this.addressData){
				data.push({ infoTittle: this.$t('addressInput.text.CEP'), value: this.addressData.cep })
				data.push({ infoTittle: this.$t('addressInput.text.UF'), value: this.addressData.uf })
				data.push({ infoTittle: this.$t('addressInput.text.city'), value: this.addressData.localidade })
				data.push({ infoTittle: this.$t('addressInput.text.street'), value: this.addressData.logradouro })
				data.push({ infoTittle: this.$t('addressInput.text.borhood'), value: this.addressData.bairro })
			}
			if(this.addressOld){
				data.push({ infoTittle: this.$t('addressInput.text.created'), value: this.formatedTime(this.addressData.created) })
				data.push({ infoTittle: this.$t('addressInput.text.updated'), value: this.formatedTime(this.addressData.updated)})
			}
			return data
		},
		formatedTime(dateString){
			const date = new Date(dateString)

			const day = date.getUTCDate()
			const month = date.getUTCMonth() + 1 // Months are zero-based, so we add 1
			const year = date.getUTCFullYear()
			const hours = date.getUTCHours()
			const minutes = date.getUTCMinutes()
			const seconds = date.getUTCSeconds()

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
		},
	},
	
	created() {
		if(this.receivedCep){
			this.cep = this.receivedCep
			this.getAddress()
		}

		if (this.initialContent) {
			this.addressData = JSON.parse(this.initialContent);
			this.addressOld = this.addressData;
		}
	},
};
</script>
<style lang="scss">
	.overflowList {
		color: white;
		padding: 15px;
		height: 50vh;
		overflow-x: hidden; 
		overflow-y: scroll;
	}
    
</style>
