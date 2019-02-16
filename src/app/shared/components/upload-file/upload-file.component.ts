import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ProgressService} from 'app/shared/services/progress.service';
import {HttpService} from 'app/shared/services/http.service';
import {TdFileInputComponent} from '@covalent/core/file';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  // TODO2: for now only works in single mode.
  // if multi-mode was needed, this must change!
  @Input() single = true;
  @Input() url = 'upload-file';
  @Output() onsubmit = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput: TdFileInputComponent;

  files: File | FileList;
  disabled = false;

  constructor(private ps: ProgressService, private hs: HttpService) {
  }

  ngOnInit() {
  }

  submitFiles() {
    this.hs.postFile(this.url, this.files, {throwError: true}).subscribe(
      res => {
        this.onsubmit.emit(true);
        this.fileInput.clear();
      },
      err => {
        this.onsubmit.emit(false);
      }
    );
  }

}
