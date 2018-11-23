import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {SocketService} from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(iconRegistry: MatIconRegistry, socketService: SocketService) {
  }

  ngOnInit() {

  }
}
