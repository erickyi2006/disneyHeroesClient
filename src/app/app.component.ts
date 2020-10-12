// DESIGN: using https://stackoverflow.com/questions/40922224/angular2-component-into-dynamically-created-element
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from "@angular/material/dialog";
import { environment } from '../environments/environment';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Find Your Disney Heroes - Administration Portal';
  version: string = environment.VERSION;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(
    private dataService: DataService,
    private _dialog: MatDialog,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.dataService.load(function (err) {
      console.log("dataService loaded");
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggle(control) {
    // PLACE HOLDER
    // control.toggle();
  }

}
