import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

declare const google: {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: { access_token: string; error?: string }) => void;
      }): { requestAccessToken(): void };
    };
  };
};

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  user = signal<{ name: string; email: string; picture: string } | null>(null);
  accessToken = signal<string | null>(null);

  private tokenClient: { requestAccessToken(): void } | null = null;
  private scriptLoaded = false;

  async loadGoogleScript(): Promise<void> {
    if (this.scriptLoaded) return;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<void> {
    await this.loadGoogleScript();

    return new Promise((resolve, reject) => {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: environment.googleOAuthClientId,
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: (response) => {
          if (response.error) {
            reject(response.error);
            return;
          }
          this.accessToken.set(response.access_token);
          this.fetchUserInfo(response.access_token).then(() => resolve());
        },
      });

      this.tokenClient.requestAccessToken();
    });
  }

  signOut(): void {
    this.user.set(null);
    this.accessToken.set(null);
  }

  private async fetchUserInfo(token: string): Promise<void> {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const info = await res.json();
    this.user.set({
      name: info.name,
      email: info.email,
      picture: info.picture,
    });
  }
}
