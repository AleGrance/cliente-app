import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url: string = environment.url;
  private options = {
    headers: {
      'Content-Type': 'application/json',
      apikey: environment.apiKey,
    },
  };

  constructor(private http: HttpClient) {}

  get(path: string) {
    return this.http.get(this.url + '/' + path, this.options);
  }

  post(path: string, body: any) {
    return this.http.post(this.url + '/' + path, body, this.options);
  }

  patch(path: string, body: any) {
    return this.http.patch(this.url + '/' + path, body, this.options);
  }
}
