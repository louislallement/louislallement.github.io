import { Directive, ElementRef, inject, afterNextRender } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
})
export class ScrollAnimateDirective {
  private el = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('scroll-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );
      observer.observe(this.el.nativeElement);
    });
  }
}
