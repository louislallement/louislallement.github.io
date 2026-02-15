import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  private router = inject(Router);
  private el = inject(ElementRef);

  menuOpen = signal(false);
  scrolled = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));

    afterNextRender(() => {
      const updateHeaderHeight = () => {
        const header = this.el.nativeElement.querySelector('.site-header');
        if (header) {
          document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
        }
      };

      updateHeaderHeight();

      window.addEventListener(
        'scroll',
        () => {
          this.scrolled.set(window.scrollY > 50);
          updateHeaderHeight();
        },
        { passive: true },
      );
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }
}
