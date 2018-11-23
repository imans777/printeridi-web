import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/observable';

@Injectable()
export class SocketService {
  private url = 'http://localhost';
  private socketConfig = {
    transports: ['websocket']
  };
  private socket: SocketIOClient.Socket;

  // private orderLineSocket;

  // private orderLineObsevable = new Observable(observer => {
  //   this.orderLineSocket.on('ans', (data) => {
  //     observer.next(data);
  //   });
  // });

  constructor() {
    // this.socket = io(this.url);//, this.socketConfig);

    // this.socket.emit('message', {message: 'hi'});
    // this.socket.on('message', msg => {
    //   console.log('received from socket: ', msg);
    //   // setTimeout(() => this.socket.emit('message', {message: 'hello'}), 1000);
    // });
  }

  // public init() {
  //   this.orderLineSocket = io(this.url + '/orderline', this.socketConfig);
  // }

  // getOrderLineMessage() {
  //   return this.orderLineObsevable;
  // }

  // disconnect() {
  //   this.orderLineSocket.disconnect();
  // }
}
