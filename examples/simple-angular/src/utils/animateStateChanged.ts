import { ElementRef } from '@angular/core'

export const animateChange = (elementRef: ElementRef) => {
	elementRef.nativeElement.animate(
		[{ opacity: 0 }, { opacity: 0.2 }, { opacity: 0 }],
		{ duration: 300, pseudoElement: '::before' },
	)
}
