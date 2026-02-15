import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// !! NE JAMAIS METTRE UNE CLÉ D'API DIRECTEMENT DANS LE CODE !!
// Utilisez les variables d'environnement ou un backend sécurisé.
const API_KEY = 'AIzaSyAWCXImM4SW4nK8UoJK4dnjgagraoezwX8'; // TODO: Remplacez par votre nouvelle clé et déplacez-la hors du code
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
  constructor(private http: HttpClient) {}

  getFilesInFolder(folderId: string): Observable<GoogleDriveFile[]> {
    const query = `'${folderId}' in parents and mimeType contains 'image/'`;
    // Ajouter plus de champs pour avoir toutes les informations nécessaires
    const fields = 'files(id,name,webContentLink,thumbnailLink,webViewLink,size,mimeType)';
    const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&fields=${fields}`;
    
    console.log('Google Drive API URL:', url);
    
    return this.http.get<GoogleDriveFileList>(url).pipe(
      map((response) => {
        console.log('Google Drive API Response:', response);
        return response.files || [];
      })
    );
  }
}