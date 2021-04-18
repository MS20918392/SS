import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  googleApiUrl: string = "https://www.googleapis.com/upload/drive/v3/files?uploadType=media";
  constructor(private http: HttpClient) { }

  uploadFile(file: any, token: any) : Promise<any>{
    const metadata = { name: file.name, mimeType: file.type };
    let form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('media', new Blob([file], { type: file.type}));
    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({'Authorization': 'Bearer ' + token}),
      body: form
    }).then();
  }
}
