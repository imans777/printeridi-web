import {Injectable, OnInit} from '@angular/core';
import {HttpService} from './http.service';
import {HttpClient} from '@angular/common/http';
import {ServerMatch} from '../servermatch';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TranslatorService implements OnInit {
  /**
   * For adding support for a new language, you just need to create a '<language-name>.json' file
   * in the 'assets/languages' folder, having the keys from a sample '.json' file with the translated values.
   * The rest is taken care of automatically by the program!
   *
   * You might need to add specific font for your language. In that case, head over to 'styles.scss'
   * and add a new class with name 'font-<language-name>' with corresponding font and styles.
   */
  languages = ['en']; // this is the default language
  lang$ = new BehaviorSubject<string>(this.languages[0]);
  dict = {};

  constructor(private hs: HttpService, private http: HttpClient) {
    this.getLanguageList();
  }

  ngOnInit() {
  }

  // this function is used when we need instant translated word,
  // trl component is used when we need constant translated word
  lookup(word) {
    if (this.dict.hasOwnProperty(word)) {
      return this.dict[word];
    } else {
      return word;
    }
  }

  getLanguageList() {
    this.hs.get('language-list').subscribe(langs => {
      this.languages = langs['languages']
      this.getCurrentLanguage();
    });
  }

  getCurrentLanguage() {
    this.hs.post('interaction', {pkey: 'lang'}).subscribe(data => {
      if (!this.languages.includes(data['pvalue'])) {
        console.error("language is not supported!");
        return;
      }

      this.changeLanguageTo(data['pvalue']);
    });
  }

  changeLanguageTo(lng) {
    if (lng === this.lang$.getValue()) {
      console.log(`language '${lng}' is already active!`);
      return;
    }

    this.hs.put('interaction', {pkey: 'lang', pvalue: lng}).subscribe(res => {
      this.http.get(`${ServerMatch.STATIC}assets/languages/${lng}.json`).subscribe(data => {
        this.dict = data;
        this.lang$.next(lng);
      }, err => {
        if (lng === 'en') { // if set to default lang (i.e. en) from another lang
          this.dict = {};
          this.lang$.next(lng);
          return;
        }
        console.error("could not load corresponding json language file: ", err);
      });
    });
  }

}
