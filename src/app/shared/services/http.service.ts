import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import {Observable} from 'rxjs/Observable';
import {SpinnerService} from './spinner.service';
import {RequestArgument} from '../classes/request-argument.interface';

@Injectable()
export class HttpService {

  public static Host;
  private serverAddress = '/api/';
  defaultRequestArgument: RequestArgument = {
    spin: true
  };

  constructor(private http: HttpClient, private spins: SpinnerService) {
    HttpService.Host = isDevMode() ? 'http://192.168.1.6' : '';
  }

  get(url, args: RequestArgument = this.defaultRequestArgument): Observable<any> {
    this.enableSpin(args.spin);
    return this.http
      .get(this.serverAddress + url, {observe: 'response'})
      .map(data => data.body)
      .catch(e => this.catchRequest(e, 'GET', url, args.throwError))
      .finally(() => this.finallyRequest(args.spin));
  }

  put(url, values, args: RequestArgument = this.defaultRequestArgument): Observable<any> {
    this.enableSpin(args.spin);
    return this.http
      .put(this.serverAddress + url, values, {observe: 'response'})
      .map(data => data.body)
      .catch(e => this.catchRequest(e, 'PUT', url, args.throwError))
      .finally(() => this.finallyRequest(args.spin));
  }

  post(url, values, args: RequestArgument = this.defaultRequestArgument): Observable<any> {
    this.enableSpin(args.spin);
    return this.http
      .post(this.serverAddress + url, values, {observe: 'response'})
      .map(data => data.body)
      .catch(e => this.catchRequest(e, 'POST', url, args.throwError))
      .finally(() => this.finallyRequest(args.spin));
  }

  postFile(url, file, args: RequestArgument = this.defaultRequestArgument): Observable<any> {
    this.enableSpin(args.spin);
    const headers = new HttpHeaders();
    const formData = new FormData();
    formData.append('uploadFile', file);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http
      .post(HttpService.Host + this.serverAddress + url, formData, {
        headers
        , observe: 'response'
      })
      .map(data => data.body)
      .catch(e => this.catchRequest(e, 'POST FILE', url, args.throwError))
      .finally(() => this.finallyRequest(args.spin));
  }

  delete(url, args: RequestArgument = this.defaultRequestArgument): Observable<any> {
    this.enableSpin(args.spin);
    return this.http
      .delete(this.serverAddress + url, {observe: 'response'})
      .map(data => data.body)
      .catch(e => this.catchRequest(e, 'DELETE', url, args.throwError))
      .finally(() => this.finallyRequest(args.spin));
  }

  enableSpin(spin) {
    if (spin)
      this.spins.en();
  }

  catchRequest(e, method, url, throwError): Observable<any> {
    this.defaultErrorHandler(e, method, url);

    if (throwError)
      return Observable.throw(e);
    return Observable.empty();
  }

  finallyRequest(spin) {
    if (spin)
      this.spins.dis();
  }

  defaultErrorHandler(e, method, url) {
    console.debug(`ERROR (${method}) in '${url}':`, e);
  }
}
