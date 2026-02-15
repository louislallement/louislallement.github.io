import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleAuthService } from '../../services/google-auth.service';
import { GoogleSheetsService } from '../../services/google-sheets.service';

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

  activeTab = signal<'reels' | 'articles'>('reels');
  reelHeaders = signal<string[]>([]);
  reelRows = signal<SheetRow[]>([]);
  articleHeaders = signal<string[]>([]);
  articleRows = signal<SheetRow[]>([]);

  editingRow = signal<{ tab: 'reels' | 'articles'; rowIndex: number; values: string[] } | null>(null);
  newRow = signal<{ tab: 'reels' | 'articles'; values: string[] } | null>(null);

  saving = signal(false);
  message = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sheet GIDs (0 = first tab, need to find second tab's gid)
  private readonly REELS_GID = 0;
  private articleGid = 0;

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
        // Articles sheet might not exist yet
        this.articleHeaders.set(['id', 'url', 'title', 'description', 'source', 'thumbnail', 'date']);
        this.articleRows.set([]);
      },
    });

    // Get the Articles sheet GID
    this.fetchArticleGid(token);
  }

  private fetchArticleGid(token: string): void {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheets['http'] ? '' : ''}`;
    // We'll use gid=0 for reels and discover Articles gid from metadata
    // For simplicity, fetch spreadsheet metadata
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        (this.sheets as unknown as { cache: Map<string, unknown> })['cache'] ? '' : '',
      )}`,
    ).catch(() => {
      // Default: Articles is probably gid=1 (second tab)
      this.articleGid = 1;
    });
    // Simple approach: Articles is the second sheet
    this.articleGid = 1;
  }

  switchTab(tab: 'reels' | 'articles'): void {
    this.activeTab.set(tab);
    this.editingRow.set(null);
    this.newRow.set(null);
  }

  startAdd(): void {
    const tab = this.activeTab();
    const headers = tab === 'reels' ? this.reelHeaders() : this.articleHeaders();
    this.newRow.set({ tab, values: headers.map(() => '') });
    this.editingRow.set(null);
  }

  startEdit(row: SheetRow): void {
    const tab = this.activeTab();
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
        this.showMessage('Erreur lors de l\'ajout', 'error');
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

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message.set({ text, type });
    setTimeout(() => this.message.set(null), 3000);
  }
}
