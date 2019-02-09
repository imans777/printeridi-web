import {Component, OnInit} from '@angular/core';
import {PageBase} from 'app/shared/classes/page-base.class';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends PageBase implements OnInit {

  constructor() {
    super("Settings");
  }

  ngOnInit() {
  }

}
