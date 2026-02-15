import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

const SHEET_ID = environment.googleSheetId;
const CSV_BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
const SHEETS_API = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetsService {
  private http = inject(HttpClient);
  private cache = new Map<string, unknown[]>();

  /**
   * Read a sheet tab as an array of objects (public, no auth needed).
   */
  readSheet<T>(sheetName: string): Observable<T[]> {
    const cached = this.cache.get(sheetName) as T[] | undefined;
    if (cached) return of(cached);

    const url = `${CSV_BASE}&sheet=${encodeURIComponent(sheetName)}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((csv) => this.parseCsv<T>(csv)),
      tap((data) => this.cache.set(sheetName, data)),
      catchError(() => of([])),
    );
  }

  /**
   * Clear cache for a specific sheet (after a write operation).
   */
  clearCache(sheetName?: string): void {
    if (sheetName) {
      this.cache.delete(sheetName);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Append a row to a sheet (requires OAuth access token).
   */
  appendRow(sheetName: string, values: string[], accessToken: string): Observable<unknown> {
    const url = `${SHEETS_API}/values/${encodeURIComponent(sheetName)}!A:Z:append?valueInputOption=USER_ENTERED`;
    return this.http.post(
      url,
      { values: [values] },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }

  /**
   * Update a specific row (requires OAuth access token).
   * rowIndex is 1-based (row 1 = headers, row 2 = first data row).
   */
  updateRow(sheetName: string, rowIndex: number, values: string[], accessToken: string): Observable<unknown> {
    const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
    const url = `${SHEETS_API}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
    return this.http.put(
      url,
      { values: [values] },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }

  /**
   * Delete a row by clearing it then using a batchUpdate to remove it.
   * Requires the sheet's gid (numeric ID of the tab).
   */
  deleteRow(sheetGid: number, rowIndex: number, accessToken: string): Observable<unknown> {
    const url = `${SHEETS_API}:batchUpdate`;
    return this.http.post(
      url,
      {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetGid,
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-based
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }

  /**
   * Get all rows as raw values (with auth, for admin).
   */
  readSheetRaw(sheetName: string, accessToken: string): Observable<string[][]> {
    const url = `${SHEETS_API}/values/${encodeURIComponent(sheetName)}`;
    return this.http
      .get<{ values: string[][] }>(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .pipe(
        map((res) => res.values || []),
        catchError(() => of([])),
      );
  }

  private parseCsv<T>(csv: string): T[] {
    const lines = csv.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = this.parseCsvLine(lines[0]).map((h) => this.normalizeHeader(h));
    const rows: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const obj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        obj[header] = values[idx]?.trim() || '';
      });
      rows.push(obj as T);
    }

    return rows;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  private normalizeHeader(header: string): string {
    const h = header.trim().toLowerCase();
    // Handle common typos
    if (h === 'thumnail') return 'thumbnail';
    return h;
  }
}
