import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { InstagramReel } from '../../models/journalist.model';
import { JournalistService } from '../../services/journalist.service';
import { ScrollAnimateDirective } from '@app/directives/scroll-animate.directive';

@Component({
  selector: 'app-journalist',
  imports: [DatePipe, ScrollAnimateDirective],
  templateUrl: './journalist.component.html',
  styleUrls: ['./journalist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalistComponent {
  private journalistService = inject(JournalistService);
  private sanitizer = inject(DomSanitizer);

  instagramReels = toSignal(this.journalistService.getInstagramReels(), { initialValue: [] });
  newsArticles = toSignal(this.journalistService.getNewsArticles(), { initialValue: [] });

  playingReels = signal<Set<string>>(new Set());

  playReel(reel: InstagramReel): void {
    this.playingReels.update((set) => {
      const next = new Set(set);
      next.add(reel.id);
      return next;
    });
  }

  isPlaying(reel: InstagramReel): boolean {
    return this.playingReels().has(reel.id);
  }

  getSafeEmbedUrl(reel: InstagramReel): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(reel.embedUrl || '');
  }

  openInstagramReel(reel: InstagramReel): void {
    window.open(reel.url, '_blank');
  }

  openNewsArticle(url: string): void {
    window.open(url, '_blank');
  }
}
