import { Injectable } from '@angular/core';
// import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { User } from './user';

declare const Buffer;

@Injectable()
export class UserService {
  private user: User;
  private isLogin = false;
  private base_url = 'https://api.github.com';
  private user_info_url = this.base_url + '/user';


  constructor(private http: HttpClient) {
  }

  getUser(): User {
    return this.user;
  }

  setUser(user): void {
    this.user = user;
  }

  isLoginIn(): Boolean {
    // return this.user !== undefined;
    return this.user !== undefined && this.isLogin;
  }

  getHeaders(): HttpHeaders {
    const header = new HttpHeaders();
    const authorization = 'Basic ' + new Buffer(this.user.name + ':' + this.user.token).toString('base64');
    header.set('Authorization', authorization);
    // header.set('Cache-Control', 'must-revalidate');
    // header.set('Last-Modified', document.lastModified);
    // header.set('Access-Control-Request-Headers', 'authorization');
    return header;
  }

  getOptionsHeader(): HttpHeaders {
    const header = new HttpHeaders();
    const authorization = 'Basic ' + new Buffer(this.user.name + ':' + this.user.token).toString('base64');
    header.set('Authorization', authorization);
    return header;
  }

  getGistsUrl(): string {
    return this.base_url + '/gists';
  }

  getUserGistsUrl(): string {
    return this.base_url + '/users/' + this.user.name + '/gists';
  }

  getImageUrl(): Promise<string> {
    return this.http.get(this.user_info_url, { headers: this.getHeaders() })
      .toPromise()
      .then(response => response)
      .then(json => { this.isLogin = (json["avatar_url"] != null) ; return json["avatar_url"]; })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
