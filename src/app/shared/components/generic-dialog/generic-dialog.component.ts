import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogType} from 'app/shared/enum/dialog.enum';

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent implements OnInit {
  usage = DialogType;
  immediatelyDisappearUsages = [this.usage.shouldGoToPrintPage];

  constructor(public dialogRef: MatDialogRef<GenericDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.immediatelyDisappearUsages.includes(this.data.usage))
      setTimeout(() => {
        this.dialogRef.close(false);
      }, 5000);
  }

}
