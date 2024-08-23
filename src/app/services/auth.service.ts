import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.prod';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = environment.url;
  private options = {
    headers: {
      'Content-Type': 'application/json',
      apikey: environment.apiKey,
    },
  };

  private _isAuthenticated: BehaviorSubject<boolean>;

  private _modulosHabilitados: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
    this._isAuthenticated = new BehaviorSubject<boolean>(false);
    this._modulosHabilitados = new BehaviorSubject<any>([]);
  }

  // Peticion para logueo
  logIn(path: string, body: any) {
    return this.http.post(this.url + '/' + path, body, this.options);
  }

  logOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    // localStorage.removeItem('roleId');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
    this._isAuthenticated.next(false);
  }

  // Auth observable
  get isAuth() {
    return this._isAuthenticated.asObservable();
  }

  setAuth(value: boolean) {
    this._isAuthenticated.next(value)
  }

  // Modulos observable
  get modulos() {
    return this._modulosHabilitados.asObservable();
  }

  setModulos(value: any) {
    this._modulosHabilitados.next(value);
  }

}
