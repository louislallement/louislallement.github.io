import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollAnimateDirective } from '@app/directives/scroll-animate.directive';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [RouterModule, ScrollAnimateDirective, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  photoLoaded = signal(false);

  onPhotoLoad(): void {
    this.photoLoaded.set(true);
  }
}
