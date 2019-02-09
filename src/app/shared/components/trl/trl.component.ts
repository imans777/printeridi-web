import {Component, OnInit, Input} from '@angular/core';
import {TranslatorService} from 'app/shared/services/translator.service';

@Component({
  selector: 'ptrl', // The unique universal selector of translation component (abbr. printer translator)
  templateUrl: './trl.component.html',
  styleUrls: ['./trl.component.scss']
})
export class TrlComponent implements OnInit {
  @Input()
  set text(value) {
    this._text = value;
    this.updateWord();
  }

  _text = '';
  translatedWord = this._text;
  lang = '';

  constructor(private trlService: TranslatorService) {}

  ngOnInit() {
    this.trlService.lang$.subscribe(lng => {
      this.lang = lng;
      this.updateWord();
    });
  }

  updateWord() {
    // uppercase / lowercase ?
    if (this.trlService.dict.hasOwnProperty(this._text)) {
      this.translatedWord = this.trlService.dict[this._text];
    } else {
      this.translatedWord = this._text;
    }
  }

}
