import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import {Observable} from 'rxjs/Observable';
import {SpinnerService} from './spinner.service';

export interface RequestArgument {
  /* default: true
    reason: indicates whether the spinner should be enabled
  during request sending untill the response comes or not.
    usage: some use cases that we don't want are, things
  we need to update all the time, like temperature,
  cpu usage, on the print page, etc. */
  spin?: boolean;

  /* default: false
    reason: prevent console erroring for each request
  all the times that just pollutes the code readability
    usage: sometimes we don't want just the console
  log for our error handling (though it's the most case)
  and we need more. */
  throwError?: boolean;
};

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
    // TODO: what about snack bar?
    // combine it with throwError?
    // or use separate args field?
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
    console.error(`ERROR (${method}) in '${url}':`, e);
  }
}
