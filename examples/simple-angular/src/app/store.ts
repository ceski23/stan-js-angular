import { createStore } from 'stan-js/vanilla'

export const store = createStore({
	counter: 0,
	textField: 'Hello World!',
	currentTime: new Date(),
	get upperCaseTextField() {
		return this.textField.toUpperCase()
	},
})
