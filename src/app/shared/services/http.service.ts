import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {

  public static Host;
  private serverAddress = '/api/';

  constructor(private http: HttpClient) {
    HttpService.Host = isDevMode() ? 'http://localhost' : '';
  }

  get(url): Observable<any> {
    return this.http.get(this.serverAddress + url, {observe: 'response'}).map(data => data.body);
  }

  put(url, values): Observable<any> {
    return this.http.put(this.serverAddress + url, values, {observe: 'response'}).map(data => data.body);
  }

  post(url, values): Observable<any> {
    return this.http.post(this.serverAddress + url, values, {observe: 'response'}).map(data => data.body);
  }

  postFile(url, file): Observable<any> {
    const headers = new HttpHeaders();
    const formData = new FormData();
    formData.append('uploadFile', file, file.name);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post(this.serverAddress + url, formData, {headers, observe: 'response'}).map(data => data.body);
  }

  delete(url): Observable<any> {
    return this.http.delete(this.serverAddress + url, {observe: 'response'}).map(data => data.body);
  }
}
