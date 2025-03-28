import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewerComponent, SessionsPageComponent } from '@core/componenets';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SessionsPageComponent, MapViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  constructor(private translate: TranslateService) {
  this.translate.addLangs(['de', 'en']);
  this.translate.setDefaultLang('en');
  this.translate.use('en');
}
  title = 'TinderFinder';
}
