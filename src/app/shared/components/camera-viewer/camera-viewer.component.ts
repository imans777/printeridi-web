import {Component, OnInit, OnDestroy} from '@angular/core';
import {DataService} from 'app/shared/services/data.service';
import {HttpService} from 'app/shared/services/http.service';
import {PageBase} from 'app/shared/classes/page-base.class';

@Component({
  selector: 'app-camera-viewer',
  templateUrl: './camera-viewer.component.html',
  styleUrls: ['./camera-viewer.component.scss']
})
export class CameraViewerComponent extends PageBase implements OnInit {

  cameraLink = '';
  host = '';
  cameraList = [];
  isFeeding = false;
  selectedItem = {name: '', link: '', icon: ''};

  constructor(private dataService: DataService, private hs: HttpService) {
    super("Camera");
  }

  ngOnInit() {
    this.getCameraList();

    if (!this.dataService.ipList.length) {
      this.dataService.updateIpList().then(() => {
        this.updateHostAndLink(this.dataService.ipList[0]);
      }).catch(() => {});
    } else {
      this.updateHostAndLink(this.dataService.ipList[0]);
    }
  }

  updateHostAndLink(ip) {
    this.host = `http://${ip}`;
    this.cameraLink = this.buildCameraLink();
  }

  getCameraList() {
    this.hs.get('camera-list').subscribe(data => {
      this.cameraList = data['cameras'];
    });
  }

  changeCameraTo(link) {
    this.clearSelectedItem();
    this.isFeeding = false;
    this.hs.post('camera-set', {cam: link}).subscribe(res => {
      this.isFeeding = true;
      this.selectedItem = this.cameraList.find(el => el.link === link);
    });
  }

  clearSelectedItem() {
    this.selectedItem = {
      name: '', link: '', icon: ''
    };
  }

  buildCameraLink() {
    return `${this.host}/api/camera-feed`;
  }
}
