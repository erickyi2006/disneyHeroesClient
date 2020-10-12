import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  heroId: string = "Jafar";
  activeMenu = "Teams";

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.route
      .params
      .subscribe(params => {
        this.heroId = params['heroId'];
      });

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  isActive(menuName) {
    return this.activeMenu === menuName;
  }
  
  onSelect(menuName) {
    try{
      this.activeMenu = menuName;

      console.log ("selected ", menuName);
    }
    catch(e) {
      // eats the exception
    }
  }

  goBack() {
    this.router.navigate(['']);
  }

  toggle (control) {
    control.toggle();
  }

}

