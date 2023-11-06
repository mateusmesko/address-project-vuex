<template>
	<div class="modal" v-if="show">
		<div class="modal-content">
			<v-row class="mx-1">
				<v-col md="11">
					<h2>{{ title }}</h2>
				</v-col>
		
				<v-col md="1">
					<v-tooltip color="red" top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="red" icon v-bind="attrs" v-on="on" @click="closeModal" >
								<v-icon>
									{{ $t('addressModal.icons.close') }}
								</v-icon>
							</v-btn>
						</template>

						<span>{{ $t('addressModal.text.close') }}</span>
					</v-tooltip>
				</v-col>
			</v-row>
			
			<AddressInput :initialContent="content" :receivedCep="cep" @closeModal="closeModal"/>
		</div>
	</div>
</template>

<script>
import AddressInput from './AddressInput.vue';

export default {
	components: {
		AddressInput,
	},

	props: {
		show: Boolean,
		title: String,
		content: String,
		cep:String
	},

	methods: {
		closeModal() {
			this.$emit('close');
		}
	}
};
</script>

<style scoped>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		width: 40%;
		background-color: rgba(255, 255, 255);
		backdrop-filter: blur(1px);
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
