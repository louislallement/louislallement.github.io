import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollAnimateDirective } from '@app/directives/scroll-animate.directive';

@Component({
  selector: 'app-about',
  imports: [RouterModule, ScrollAnimateDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
