import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // On injecte le service pour s'assurer qu'il est initialisé au démarrage.
  // L'injection via `inject()` est plus moderne que via le constructeur.
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private meta = inject(Meta);

  scrollProgress = signal(0);
  showBackToTop = signal(false);
  isNavigating = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
        takeUntilDestroyed(),
      )
      .subscribe((data) => {
        const description = data['description'];
        if (description) {
          this.meta.updateTag({ name: 'description', content: description });
        }
      });

    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isNavigating.set(false);
      }
    });

    afterNextRender(() => {
      window.addEventListener(
        'scroll',
        () => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          this.scrollProgress.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
          this.showBackToTop.set(scrollTop > 300);
        },
        { passive: true },
      );
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
