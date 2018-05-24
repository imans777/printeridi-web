import {Injectable, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {

  public static Host;
  private serverAddress = '/api/';

  constructor(private http: HttpClient) {
    HttpService.Host = this.isInDevMode() ? 'http://localhost:3000' : '';
  }

  isInDevMode() {
    return isDevMode();
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

  delete(url): Observable<any> {
    return this.http.delete(this.serverAddress + url, {observe: 'response'}).map(data => data.body);
  }
}
