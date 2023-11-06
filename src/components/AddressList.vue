<template>
	<div>
		<v-card elevation="2" class="ma-2" v-if="!isModalVisible">
			<v-simple-table>
				<template v-slot:top>
					<h1 class="mx-4"> {{ $t('addressList.text.title') }}</h1>
					
					<v-row class="ma-1">
						<v-col md="9">
							<v-text-field
								v-model="cep"
								counter="8"
								label="Informe o CEP"
								type="number"
								:rules="[rules.required, rules.countCaracters]"
								:prepend-icon="$t('addressList.icons.CEP')"
							></v-text-field>
						</v-col>
				
						<v-col md="3">
							<v-btn :disabled="!isCepInputValid" block color="success"
								elevation="2" @click="showModal"
							>
								<v-icon light>{{$t('addressList.icons.new')}}</v-icon>
								{{ $t('addressList.actions.searchCEP') }}
							</v-btn>
						</v-col>
					</v-row>
				</template>

				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">
								<strong>{{ $t('addressList.text.titleAddress') }}</strong>
							</th>
							<th class="text-left">
								<strong>{{ $t('addressList.text.CEP') }}</strong>
							</th>
							<th class="text-left">
								<strong>{{ $t('addressList.text.UF') }}</strong>
							</th>
							<th class="text-left">
								<strong>{{ $t('addressList.text.city') }}</strong>
							</th>
							<th class="text-left">
								<strong>{{ $t('addressList.text.borhood') }}</strong>
							</th>
							<th class="text-left">
								<strong>{{ $t('addressList.text.street') }}</strong>
							</th>
							<th class="text-center">
								<strong>{{ $t('addressList.text.optionsActions') }}</strong>
							</th>
						</tr>
					</thead>
					
					<tbody>
						<tr v-for="(address, ID) in $store.state.addresses.slice().reverse()" :key="ID">
							<td>{{ address.addresses.title }}</td>
							<td>{{ address.addresses.cep }}</td>
							<td>{{ address.addresses.uf }}</td>
							<td>{{ address.addresses.localidade }}</td>
							<td>{{ address.addresses.bairro }}</td>
							<td>{{ address.addresses.logradouro }}</td>

							<td class="text-center">
								<v-btn class="mx-1" @click="deleteAddress(ID)" color="error" small>
									<v-icon light>{{$t('addressList.icons.delete')}}</v-icon>
									{{ $t('addressList.actions.deleteAddress') }}
								</v-btn>

								<v-btn class="mx-1" @click="editAddress(ID)" color="primary" small>
									<v-icon light>{{$t('addressList.icons.edit')}}</v-icon>
									{{ $t('addressList.actions.editAddress') }}
								</v-btn>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</v-card>

		<modal 	:show="isModalVisible" 
				:title="modalTitle" 
				:content="modalContent" 
				:cep="cep"
				@close="closeModal"
		/>
	</div>
</template>

<script>
import Modal from './AddressModal.vue';

export default {
	components: {
		Modal
	},
	data() {
		return {
			isModalVisible: false,
			addressList: [],
			modalTitle: '',
			modalContent: '',

			cep:'',

			rules: {
				required: value => !!value || this.$t('addressInput.validation.emptyCep'),
				countCaracters: v => v.length === 8 || this.$t('addressInput.validation.invalidCep'),
			},
		};
	},

	computed: {
		isCepInputValid() {
			const numericCep = this.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
			return numericCep.length === 8; // Verifica se o campo tem exatamente 8 números
		},
	},

	methods:{
		showModal() {
			this.isModalVisible = true;
			this.modalTitle = this.$t('addressList.text.newAddress')
			this.modalContent = ''
		},

		closeModal() {
			this.getAddresses()
			this.cep = ''
			this.isModalVisible = false
			this.modalContent = null
		},

		deleteAddress(ID) {
			this.$store.dispatch('deleteAddressAction', ID)
			this.getAddresses()
		},

		editAddress(id) {
			this.isModalVisible = true
			this.modalTitle = this.$t('addressList.text.editAddress')
			
			const address = this.addressList[id]
			if (address) {
				console.log(id)
				this.modalContent = JSON.stringify(address)
			} else {
				this.modalContent = ''
			}
		},

		getAddresses() {
			this.addressList = JSON.parse(localStorage.getItem('savedAddresses')) || {}
			const addressArray = Object.values(this.addressList);
			this.addressList = addressArray.slice().sort((a, b) => new Date(b.created) - new Date(a.created));
		},
	},

	created() {
		this.getAddresses();
	},
};
</script>