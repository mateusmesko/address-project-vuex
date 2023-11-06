<template>
	<v-app>
		<div id="app">
			<AddressInput />
		</div>
	</v-app>
</template>

<script>
import AddressInput from './components/AddressList.vue';

export default {
	components: {
		AddressInput,
	},
};
</script>
