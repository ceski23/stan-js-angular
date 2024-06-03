import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { interval, switchMap, tap } from 'rxjs'
import { animateChange } from '../../utils/animateStateChanged'
import { injectStoreState } from '../store'

@Component({
	selector: 'app-current-time',
	standalone: true,
	imports: [
		CommonModule,
	],
	template: `<h1>Timer</h1>
    <div class="content">
      <div class="pill-group">
        <button class="pill" (click)="updateTimePeriod(1000)">slow down</button>
        <button class="pill" (click)="updateTimePeriod(-1000)">speed up</button>
				 <h3>refresh rate: {{timePeriod()}} ms</h3>
      </div>
      <div class="time-state">
        <h2 class="text-color">time:</h2>
        <h2 >{{ state.currentTime() | date:"HH:mm:ss"}}</h2>
      </div>
    </div>`,
	styleUrl: './current-time.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentTimeComponent {
	state = injectStoreState()
	elementRef = inject(ElementRef)
	timePeriod = signal(1000)
	timer = toObservable(this.timePeriod).pipe(
		switchMap(value => interval(value)),
		tap(() => {
			this.state.currentTime.set(new Date())
		}),
		takeUntilDestroyed(),
	).subscribe()

	updateTimePeriod(delta: number) {
		this.timePeriod.update(value => Math.max(1000, value + delta))
	}

	constructor() {
		effect(() => {
			this.state.currentTime()
			animateChange(this.elementRef)
		})
	}
}
