import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    private url: string = environment.url;
    private options = {
      headers: {
        'Content-Type': 'application/json',
        apikey: environment.apiKey,
      },
    };
  
    constructor(private http: HttpClient) {}
  
    // User
    getUsers(path: string) {
      return this.http.get(this.url + '/' + path, this.options);
    }
  
    postUser(path: string, body: any) {
      return this.http.post(this.url + '/' + path, body, this.options);
    }
  
    updateUser(path: string, body: any) {
      return this.http.patch(this.url + '/' + path, body, this.options);
    }
  
    // Role
    getRoles(path: string) {
      return this.http.get(this.url + '/' + path, this.options);
    }
  
    updateRol(path: string, body: any) {
      return this.http.patch(this.url + '/' + path, body, this.options);
    }
  
    // Modulos
    getModules(path: string) {
      return this.http.get(this.url + '/' + path, this.options);
    }
    updateModule(path: string, body: any) {
      return this.http.patch(this.url + '/' + path, body, this.options);
    }
  }
  
