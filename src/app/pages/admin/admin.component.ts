import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { GoogleAuthService } from '../../services/google-auth.service';
import { GoogleSheetsService } from '../../services/google-sheets.service';
import { PhotoService } from '../../services/photo.service';
import { Photo } from '../../models/photo.model';
import { environment } from '../../../environments/environment';

interface SheetRow {
  rowIndex: number;
  values: string[];
}

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  auth = inject(GoogleAuthService);
  private sheets = inject(GoogleSheetsService);
  private photoService = inject(PhotoService);

  activeTab = signal<'reels' | 'articles' | 'photos'>('reels');
  reelHeaders = signal<string[]>([]);
  reelRows = signal<SheetRow[]>([]);
  articleHeaders = signal<string[]>([]);
  articleRows = signal<SheetRow[]>([]);

  editingRow = signal<{ tab: 'reels' | 'articles'; rowIndex: number; values: string[] } | null>(null);
  newRow = signal<{ tab: 'reels' | 'articles'; values: string[] } | null>(null);

  saving = signal(false);
  message = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  // --- Photos focal point ---
  allPhotos = toSignal(this.photoService.getPhotos('all'), { initialValue: [] as Photo[] });
  photoMetaRows = signal<SheetRow[]>([]);
  photoMetaHeaders = signal<string[]>(['filename', 'alt', 'focus']);

  selectedPhoto = signal<Photo | null>(null);
  focalPoint = signal<{ x: number; y: number }>({ x: 50, y: 50 });
  photoAlt = signal('');

  previewPosition = computed(() => `${this.focalPoint().x}% ${this.focalPoint().y}%`);

  private readonly REELS_GID = 0;
  private articleGid = 1;
  private photosGid = 2;

  async signIn(): Promise<void> {
    try {
      await this.auth.signIn();
      this.loadData();
    } catch {
      this.showMessage('Erreur de connexion Google', 'error');
    }
  }

  loadData(): void {
    const token = this.auth.accessToken();
    if (!token) return;

    this.sheets.readSheetRaw('Reels', token).subscribe((rows) => {
      if (rows.length > 0) {
        this.reelHeaders.set(rows[0]);
        this.reelRows.set(
          rows.slice(1).map((values, i) => ({ rowIndex: i + 2, values })),
        );
      }
    });

    this.sheets.readSheetRaw('Articles', token).subscribe({
      next: (rows) => {
        if (rows.length > 0) {
          this.articleHeaders.set(rows[0]);
          this.articleRows.set(
            rows.slice(1).map((values, i) => ({ rowIndex: i + 2, values })),
          );
        }
      },
      error: () => {
        this.articleHeaders.set(['id', 'url', 'title', 'description', 'source', 'thumbnail', 'date']);
        this.articleRows.set([]);
      },
    });

    this.sheets.readSheetRaw('Photos', token).subscribe({
      next: (rows) => {
        if (rows.length > 0) {
          this.photoMetaHeaders.set(rows[0]);
          this.photoMetaRows.set(
            rows.slice(1).map((values, i) => ({ rowIndex: i + 2, values })),
          );
        }
      },
      error: () => {
        this.photoMetaRows.set([]);
      },
    });

    this.fetchSheetGids(token);
  }

  private fetchSheetGids(token: string): void {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${environment.googleSheetId}?fields=sheets.properties`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data: { sheets?: { properties: { title: string; sheetId: number } }[] }) => {
        if (data.sheets) {
          for (const sheet of data.sheets) {
            if (sheet.properties.title === 'Articles') this.articleGid = sheet.properties.sheetId;
            if (sheet.properties.title === 'Photos') this.photosGid = sheet.properties.sheetId;
          }
        }
      })
      .catch(() => {
        this.articleGid = 1;
        this.photosGid = 2;
      });
  }

  switchTab(tab: 'reels' | 'articles' | 'photos'): void {
    this.activeTab.set(tab);
    this.editingRow.set(null);
    this.newRow.set(null);
    if (tab === 'photos') {
      this.selectedPhoto.set(null);
    }
  }

  // --- Reels & Articles CRUD ---

  startAdd(): void {
    const tab = this.activeTab();
    if (tab === 'photos') return;
    const headers = tab === 'reels' ? this.reelHeaders() : this.articleHeaders();
    this.newRow.set({ tab, values: headers.map(() => '') });
    this.editingRow.set(null);
  }

  startEdit(row: SheetRow): void {
    const tab = this.activeTab();
    if (tab === 'photos') return;
    this.editingRow.set({ tab, rowIndex: row.rowIndex, values: [...row.values] });
    this.newRow.set(null);
  }

  cancelEdit(): void {
    this.editingRow.set(null);
    this.newRow.set(null);
  }

  saveNew(): void {
    const row = this.newRow();
    const token = this.auth.accessToken();
    if (!row || !token) return;

    const sheetName = row.tab === 'reels' ? 'Reels' : 'Articles';
    this.saving.set(true);

    this.sheets.appendRow(sheetName, row.values, token).subscribe({
      next: () => {
        this.showMessage('Ligne ajoutée', 'success');
        this.newRow.set(null);
        this.saving.set(false);
        this.sheets.clearCache(sheetName);
        this.loadData();
      },
      error: () => {
        this.showMessage("Erreur lors de l'ajout", 'error');
        this.saving.set(false);
      },
    });
  }

  saveEdit(): void {
    const row = this.editingRow();
    const token = this.auth.accessToken();
    if (!row || !token) return;

    const sheetName = row.tab === 'reels' ? 'Reels' : 'Articles';
    this.saving.set(true);

    this.sheets.updateRow(sheetName, row.rowIndex, row.values, token).subscribe({
      next: () => {
        this.showMessage('Ligne modifiée', 'success');
        this.editingRow.set(null);
        this.saving.set(false);
        this.sheets.clearCache(sheetName);
        this.loadData();
      },
      error: () => {
        this.showMessage('Erreur lors de la modification', 'error');
        this.saving.set(false);
      },
    });
  }

  deleteRow(row: SheetRow): void {
    const token = this.auth.accessToken();
    if (!token) return;

    const tab = this.activeTab();
    const gid = tab === 'reels' ? this.REELS_GID : this.articleGid;
    const sheetName = tab === 'reels' ? 'Reels' : 'Articles';

    this.saving.set(true);

    this.sheets.deleteRow(gid, row.rowIndex, token).subscribe({
      next: () => {
        this.showMessage('Ligne supprimée', 'success');
        this.saving.set(false);
        this.sheets.clearCache(sheetName);
        this.loadData();
      },
      error: () => {
        this.showMessage('Erreur lors de la suppression', 'error');
        this.saving.set(false);
      },
    });
  }

  // --- Photo focal point ---

  selectPhoto(photo: Photo): void {
    this.selectedPhoto.set(photo);

    // Check if this photo already has metadata in the sheet
    const existingRow = this.findPhotoMetaRow(photo.alt);
    if (existingRow) {
      const headers = this.photoMetaHeaders();
      const focusIdx = headers.indexOf('focus');
      const altIdx = headers.indexOf('alt');
      const focusVal = focusIdx >= 0 ? existingRow.values[focusIdx] || '' : '';
      this.photoAlt.set(altIdx >= 0 ? existingRow.values[altIdx] || photo.alt : photo.alt);
      this.parseFocusPoint(focusVal);
    } else {
      this.focalPoint.set({ x: 50, y: 50 });
      this.photoAlt.set(photo.alt);
    }
  }

  onImageClick(event: MouseEvent): void {
    const img = event.currentTarget as HTMLElement;
    const rect = img.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
    this.focalPoint.set({ x, y });
  }

  saveFocalPoint(): void {
    const photo = this.selectedPhoto();
    const token = this.auth.accessToken();
    if (!photo || !token) return;

    const focusValue = `${this.focalPoint().x}% ${this.focalPoint().y}%`;
    const filename = photo.alt; // filename from Drive
    const alt = this.photoAlt();

    const existingRow = this.findPhotoMetaRow(filename);
    this.saving.set(true);

    if (existingRow) {
      // Update existing row
      const headers = this.photoMetaHeaders();
      const values = [...existingRow.values];
      const filenameIdx = headers.indexOf('filename');
      const altIdx = headers.indexOf('alt');
      const focusIdx = headers.indexOf('focus');
      if (filenameIdx >= 0) values[filenameIdx] = filename;
      if (altIdx >= 0) values[altIdx] = alt;
      if (focusIdx >= 0) values[focusIdx] = focusValue;

      this.sheets.updateRow('Photos', existingRow.rowIndex, values, token).subscribe({
        next: () => {
          this.showMessage('Point focal enregistré', 'success');
          this.saving.set(false);
          this.sheets.clearCache('Photos');
          this.loadData();
        },
        error: () => {
          this.showMessage("Erreur lors de l'enregistrement", 'error');
          this.saving.set(false);
        },
      });
    } else {
      // Append new row
      this.sheets.appendRow('Photos', [filename, alt, focusValue], token).subscribe({
        next: () => {
          this.showMessage('Point focal enregistré', 'success');
          this.saving.set(false);
          this.sheets.clearCache('Photos');
          this.loadData();
        },
        error: () => {
          this.showMessage("Erreur lors de l'enregistrement", 'error');
          this.saving.set(false);
        },
      });
    }
  }

  private findPhotoMetaRow(filename: string): SheetRow | null {
    const headers = this.photoMetaHeaders();
    const filenameIdx = headers.indexOf('filename');
    if (filenameIdx < 0) return null;

    const normalizedName = filename.toLowerCase();
    return (
      this.photoMetaRows().find(
        (row) => (row.values[filenameIdx] || '').toLowerCase() === normalizedName,
      ) || null
    );
  }

  private parseFocusPoint(value: string): void {
    if (!value || value === 'center') {
      this.focalPoint.set({ x: 50, y: 50 });
      return;
    }
    if (value === 'top') {
      this.focalPoint.set({ x: 50, y: 0 });
      return;
    }
    if (value === 'bottom') {
      this.focalPoint.set({ x: 50, y: 100 });
      return;
    }

    const match = value.match(/(\d+)%\s*(\d+)%/);
    if (match) {
      this.focalPoint.set({ x: parseInt(match[1]), y: parseInt(match[2]) });
    } else {
      this.focalPoint.set({ x: 50, y: 50 });
    }
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message.set({ text, type });
    setTimeout(() => this.message.set(null), 3000);
  }
}
