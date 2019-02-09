import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {TranslatorService} from './translator.service';
import {MsgType} from '../enum/msgtype.enum';

@Injectable()
export class MessageService {

  constructor(private snackbar: MatSnackBar, private trlService: TranslatorService) {}

  open(type: MsgType = MsgType.error, msg?: string) {
    let panelTypeClass: string;
    switch (type) {
      case MsgType.info:
        panelTypeClass = 'msg-info';
        if (!msg) msg = 'Successfully Done';
        break;
      default: // is error
        panelTypeClass = 'msg-error';
        if (!msg) msg = 'Data Could Not Be Loaded';
        break;
    }

    this.snackbar.open(this.trlService.lookup(msg), null,
      {
        duration: 2400,
        extraClasses: `font-${this.trlService.lang$.getValue()}`,
        panelClass: [panelTypeClass, `font-${this.trlService.lang$.getValue()}`],
      });
  }

}
