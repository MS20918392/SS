import { state } from '@angular/animations';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../services/fileupload.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  gapiSetupCompleted: boolean = false;
  googleAuthenticationInstance: gapi.auth2.GoogleAuth;
  error: string;
  user: gapi.auth2.GoogleUser;
  signedInEmail: string;
  fileUploadSuccess:boolean=false;
  fileUploadStarted:boolean=false;
  constructor(private uploadService: FileUploadService) { }

  async ngOnInit() {
    this.fileUploadStarted=false;
    this.fileUploadSuccess = false;
    if (await this.checkIfUserAuthenticated()) {
      this.user = this.googleAuthenticationInstance.currentUser.get();
    }
  }

  async initGoogleAuth():Promise<void> {
    const loadedGapi = new Promise((resolve) => {
      gapi.load('auth2', resolve);
    });

    return loadedGapi.then(async () => {
      await gapi.auth2
        .init({
          client_id: '921335835339-9duhv4rhjp0tna5i4v09utsiak9h0pl7.apps.googleusercontent.com',
          scope: 'profile email https://www.googleapis.com/auth/drive'
        })
        .then(authInstance => {
          this.gapiSetupCompleted = true;
          this.googleAuthenticationInstance = authInstance;
        });
    });
  }

  async authenticate(): Promise<gapi.auth2.GoogleUser> {

    if (!this.gapiSetupCompleted) {
      await this.initGoogleAuth();
    }
    return new Promise(async () => {
      await this.googleAuthenticationInstance.signIn().then(
        user => {
          this.user = user,
          this.signedInEmail = this.googleAuthenticationInstance.currentUser.get().getBasicProfile().getEmail()
        },
        error => this.error = error);
    });

  }

  async checkIfUserAuthenticated(): Promise<boolean> {
    if (!this.gapiSetupCompleted) {
     await this.initGoogleAuth();
    }
    return this.googleAuthenticationInstance.isSignedIn.get();
  }

  onUploadClicked(event) {
    this.fileUploadStarted=true;
    if (event.length > 0) {
      this.uploadService.uploadFile(event[0], this.googleAuthenticationInstance.currentUser.get().getAuthResponse(true).access_token)
      .then( event =>
        {
          this.fileUploadStarted=false;
          this.fileUploadSuccess = true;
        });      
    }
  }
}
