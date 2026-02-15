import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Cette page n'existe pas ou a été déplacée.</p>
      <a routerLink="/gallery" class="back-link">Retour à la galerie</a>
    </div>
  `,
  styles: `
    .not-found {
      text-align: center;
      padding: 6rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    h1 {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 6rem;
      font-weight: 400;
      margin: 0 0 1rem;
      color: var(--color-text-light);

      :host-context(body.dark) & {
        color: var(--color-text-dark);
      }
    }

    p {
      font-size: 1.2rem;
      color: #555;
      margin-bottom: 2rem;

      :host-context(body.dark) & {
        color: #aaa;
      }
    }

    .back-link {
      display: inline-block;
      padding: 0.85rem 2rem;
      background: #000;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;

      :host-context(body.dark) & {
        background: #ddd;
        color: #000;
      }

      &:hover {
        background: #333;
        transform: translateY(-2px);

        :host-context(body.dark) & {
          background: #fff;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
