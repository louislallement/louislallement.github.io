import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = 'https://www.googleapis.com/drive/v3/files';

export interface GoogleDriveFile {
  id: string;
  name: string;
  webContentLink: string;
  thumbnailLink: string;
  webViewLink?: string;
  size?: string;
  mimeType?: string;
}

export interface GoogleDriveFileList {
  files: GoogleDriveFile[];
}

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private http = inject(HttpClient);

  getFilesInFolder(folderId: string): Observable<GoogleDriveFile[]> {
    const query = `'${folderId}' in parents and mimeType contains 'image/'`;
    const fields = 'files(id,name,webContentLink,thumbnailLink,webViewLink,size,mimeType)';
    const url = `${API_URL}?key=${environment.googleDriveApiKey}&q=${encodeURIComponent(query)}&fields=${fields}`;

    return this.http.get<GoogleDriveFileList>(url).pipe(
      map((response) => response.files || []),
      catchError(() => of([]))
    );
  }
}
