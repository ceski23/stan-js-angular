import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { injectStore } from '@ceski23/stan-js-angular'
import { animateChange } from '../../utils/animateStateChanged'
import { store } from '../store'

@Component({
	selector: 'app-text-field',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	],
	template: `<h1>TextField</h1>
    <div class="content">
      <div class="pill-group">
        <button class="pill" (click)="reset()">reset</button>
					<input type="text" [ngModel]="state.textField()" (ngModelChange)="updateValue($event)" >
      </div>
      <div class="field-state">
        <h2 class="text-color">uppercased:</h2>
        <h2 class="field-value">{{ state.upperCaseTextField() }}</h2>
      </div>
    </div>`,
	styleUrl: './text-field.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldComponent {
	elementRef = inject(ElementRef)
	state = injectStore(store)

	reset() {
		store.reset('textField')
	}

	updateValue(value: string) {
		this.state.textField.set(value)
	}

	constructor() {
		effect(() => {
			this.state.textField()
			animateChange(this.elementRef)
		})
	}
}
