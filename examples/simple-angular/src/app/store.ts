import { createStore } from '@ceski23/stan-js-angular'
import { storage } from 'stan-js/storage'

export const { injectStore, injectStoreState, provideStore } = createStore({
	counter: storage(0),
	textField: 'Hello World!',
	currentTime: new Date(),
	get upperCaseTextField() {
		return this.textField.toUpperCase()
	},
})
