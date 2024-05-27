import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject } from '@angular/core'
import { injectStore } from '@ceski23/stan-js-angular'
import { animateChange } from '../../utils/animateStateChanged'
import { store } from '../store'

@Component({
	selector: 'app-counter',
	standalone: true,
	imports: [CommonModule],
	template: `<h1>Counter</h1>
    <div class="content">
      <div class="pill-group">
        <button class="pill" (click)="increment()">increment</button>
        <button class="pill" (click)="decrement()">decrement</button>
        <button class="pill" (click)="reset()">reset</button>
      </div>
      <div class="counter-state">
        <h2 class="text-color">counter:</h2>
        <h2>{{ state.counter() }}</h2>
      </div>
    </div>`,
	styleUrl: './counter.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
	elementRef = inject(ElementRef)
	state = injectStore(store)

	increment() {
		this.state.counter.update(counter => counter + 1)
	}
	decrement() {
		this.state.counter.update(counter => counter - 1)
	}

	reset() {
		store.reset('counter')
	}

	constructor() {
		effect(() => {
			this.state.counter()
			animateChange(this.elementRef)
		})
	}
}
