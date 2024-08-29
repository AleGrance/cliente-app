import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private url: string = environment.url;
  private options = {
    headers: {
      'Content-Type': 'application/json',
      apikey: environment.apiKey,
    },
  };

  constructor(private http: HttpClient) {}

  getPermisos(path: string) {
    return this.http.get(this.url + '/' + path, this.options);
  }

  postPermiso(path: string, body: any) {
    return this.http.post(this.url + '/' + path, body, this.options);
  }

  deletePermiso(path: string) {
    return this.http.delete(this.url + '/' + path, this.options);
  }
}
