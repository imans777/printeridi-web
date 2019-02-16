import {Injectable, OnInit} from '@angular/core';
import {HttpService} from './http.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ThemesEnum} from '../enum/themes.enum';
import {PrinterTemperatures} from '../classes/temperatures.interface';

@Injectable()
export class DataService {
  // IMPORTANT NOTE: REMEMBER!
  // NEVER EVER implement from onInit in a SERVICE! IT BREAKS!

  ipList = [];
  usedTheme$ = new BehaviorSubject<ThemesEnum>(ThemesEnum.default);
  temps$ = new BehaviorSubject<PrinterTemperatures>({bed: {cur: 0, goal: 0}, ext: {cur: 0, goal: 0}});
  hardwareInfo$ = new BehaviorSubject<any>({});
  isExtendedBoardConnected$ = new BehaviorSubject<boolean>(null);
  isFanOn$ = new BehaviorSubject<boolean>(null);

  // Ask-Before-Start
  abs = true;

  constructor(private hs: HttpService) {
    this.setIntervals();
    this.getExtendedBoardConnection();
    this.getFanStatus();
  }

  private setIntervals() {
    this.getTemperatures();
    setInterval(() => this.getTemperatures(), 2000);

    this.getHardwareInfo();
    setInterval(() => this.getHardwareInfo(), 4000);
  }

  private getTemperatures() {
    this.hs.get('temperatures', {spin: false}).subscribe((data: PrinterTemperatures) => {
      this.temps$.next(data);
    });
  }

  private getHardwareInfo() {
    this.hs.get('hardware-info', {spin: false}).subscribe(data => {
      this.hardwareInfo$.next(data);
    });
  }

  private getExtendedBoardConnection() {
    // TODO: no view
    this.hs.get('extended_board_connection', {spin: false}).subscribe(data => {
      this.isExtendedBoardConnected$.next(data['is_connected']);
    });
  }

  public getFanStatus() {
    this.hs.get('fan_speed', {spin: false}).subscribe(data => {
      this.isFanOn$.next(!!data['fan']);
    });
  }


  public setFanStatus(status: boolean) {
    return new Promise((resolve, reject) => {
      const statusStr = !status ? 'OFF' : 'ON';
      this.hs.post('fan_speed', {status: statusStr}, {throwError: true})
        .subscribe(data => {
          this.isFanOn$.next(status);
          resolve();
        }, err => reject(err));
    });
  }

  public setAbs(abs) {
    return new Promise((resolve, reject) => {
      this.hs.post('abs', {abs}).subscribe(res => {
        this.abs = abs;
      });
    });
  }

  public getAbs() {
    return new Promise((resolve, reject) => {
      this.hs.get('abs', {throwError: true}).subscribe(res => {
        this.abs = res['abs'];
        resolve();
      }, err => reject(err));
    });
  }

  public updateIpList() {
    return new Promise((resolve, reject) => {
      this.hs.post('ip', {}, {throwError: true}).subscribe(data => {
        this.ipList = data['ips'];
        resolve();
      }, err => reject(err));
    });
  }
}
