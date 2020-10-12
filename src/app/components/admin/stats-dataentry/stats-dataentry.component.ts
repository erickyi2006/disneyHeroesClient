import { Component, AfterViewInit, OnInit, ViewChild, Inject, Injectable, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventService, NotifyEvent } from 'src/app/common/EventService';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { AppGui } from 'src/app/common/AppGui';

export interface UserData {
  id: string;
  date: string;
  player: string;
  hero1: string;
  disk1: string;
  hero2: string;
  disk2: string;
  hero3: string;
  disk3: string;
  hero4: string;
  disk4: string;
  hero5: string;
  disk5: string;
  status?: string;
}

@Component({
  selector: 'app-stats-dataentry',
  templateUrl: './stats-dataentry.component.html',
  styleUrls: ['./stats-dataentry.component.less']
})
export class StatsDataentryComponent implements OnInit, AfterViewInit {
  TOTAL_HEROES_IN_TEAM: number = 5;
  ASSETS_PATH: string = environment.ASSETS_PATH;
  title: string = "Statistics";
  all_heroes: any[] = [];
  arrayOfHeroes: any[] = []; // this is the 6xarray 
  arrayOfFriendships: any[] = [];
  selectedRow: any = null;
  data: any[] = []; // original

  playerInputData = {
    date: "",
    player: "",
    hero1: "",
    disk1: "",
    hero2: "",
    disk2: "",
    hero3: "",
    disk3: "",
    hero4: "",
    disk4: "",
    hero5: "",
    disk5: "",
    status: "",
    filteredHero: ""
  };

  displayedColumns: string[] = ['player', 'hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'action'];
  dataSource: MatTableDataSource<UserData>;

  exportUrl: SafeUrl = null;
  exportFilename: string = "";
  @ViewChild('exportLink', { static: true }) exportLink: ElementRef;

  @ViewChild('myDefaultElement', { read: ElementRef, static: false }) defaultElement: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _dialog: MatDialog,
    private dataService: DataService,
    private eventService: EventService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) {
    this.dataSource = new MatTableDataSource(); // empty table first
  }

  ngOnInit() {
    for (var idx = 0; idx < this.TOTAL_HEROES_IN_TEAM + 1; idx++) {
      this.arrayOfFriendships[idx] = []; // an array
      this.arrayOfHeroes[idx] = [];
    }
    this.route.
      queryParamMap
      .subscribe(queries => {
        console.log("***query", queries);
        this.playerInputData.filteredHero = queries["params"]['hero']; 
        if (this.playerInputData.filteredHero) {
          console.log("***applying filter", this.playerInputData.filteredHero);
          this.applyFilter(this.playerInputData.filteredHero);
        }  
      });

    this.initComponent();
    this.dataService.waitUntilLoaded(() => {
      this.all_heroes = this.dataService.getHeroList();
      this.onFilterPlayer(""); // show all
      // first time...
      if (this.playerInputData.filteredHero) {
        console.log("***applying filter", this.playerInputData.filteredHero);
        this.applyFilter(this.playerInputData.filteredHero);
      }
    });
  }

  ngAfterViewInit() {
  }

  initComponent() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.selectedRow = null;
  }

  onFilterPlayer(value: string) {
    let players = this.dataService.searchPlayer(value);
    // console.log("found", players);
    var data = [];
    players.forEach((playerItem) => {
      var newDataItem = {
        id: "id_" + playerItem.date + "." + playerItem.player,
        player: playerItem.player,
        hero1: playerItem.heroes[0].hero || "",
        disk1: playerItem.heroes[0].disk || "",
        hero2: playerItem.heroes[1].hero || "",
        disk2: playerItem.heroes[1].disk || "",
        hero3: playerItem.heroes[2].hero || "",
        disk3: playerItem.heroes[2].disk || "",
        hero4: playerItem.heroes[3].hero || "",
        disk4: playerItem.heroes[3].disk || "",
        hero5: playerItem.heroes[4].hero || "",
        disk5: playerItem.heroes[4].disk || "",
        status: playerItem.status
      };
      data.push(newDataItem);
    });
    this.dataSource.data = data;
    this.dataSource.filteredData = data;
    this.data = data;
    console.log ("onFilterPlayer result", data.length);

    // clear the rest
    this.playerInputData.hero1 = "";
    this.playerInputData.disk1 = "";
    this.playerInputData.hero2 = "";
    this.playerInputData.disk2 = "";
    this.playerInputData.hero3 = "";
    this.playerInputData.disk3 = "";
    this.playerInputData.hero4 = "";
    this.playerInputData.disk4 = "";
    this.playerInputData.hero5 = "";
    this.playerInputData.disk5 = "";

    this.selectedRow = null; // clear it
  }

  onFilterHero(index: number, value: string) {
    this.filterAutoCompleteHero(index, value);
  }

  onSelectAutocompleteHero(index: number, event) {
    console.log("autocomplete", index, event);
    // this.filterHeroColumn(index, event.option.value);
    this.setupFriendshipColumn(index, event.option.value);
    this.filterData();
  }

  setupFriendshipColumn(index: number, hero: string) {
    var data = [];
    var found = this.dataService.searchFriendship(hero);
    if (found) {
      data = found.disks;
    }
    console.log("friendships[" + index + "]", data);
    this.arrayOfFriendships[index] = data;
  }

  filterAutoCompleteHero(index: number, value: string) {
    var data = [];
    var pattern = new RegExp("^" + value, "i"); // from beginning
    data.push({
      hero: "ALL",
      role: "",
      pos: ""
    });
    this.all_heroes.forEach((heroItem) => {
      if (heroItem.hero.match(pattern)) {
        data.push(heroItem);
      }
    });
    this.arrayOfHeroes[index] = data;
  }

  filterData() {
    var data = [];
    this.data.forEach((playerItem) => {
      var ok = true;
      if (ok && this.playerInputData.player) {
        var pattern = new RegExp(this.playerInputData.player, "i"); // contains 
        if (!playerItem.player.match(pattern)) {
          ok = false;
        }
      }

      if (ok) {
        var heroLine = ""+playerItem["hero1"]+".*"+playerItem["hero2"]+".*"+playerItem["hero3"]+".*"+playerItem["hero4"]+"*"+playerItem["hero5"];
        var count = 0;
        var total = 0;
        for (var index = 1; index < this.TOTAL_HEROES_IN_TEAM + 1; index++) {
          var columnName = "hero" + index;
          if (this.playerInputData[columnName] && this.playerInputData[columnName] !== "ALL") {
            total++;
            if (heroLine.indexOf(this.playerInputData[columnName]) !== -1) {
              count++;
            }
          }
        }
  
        if (total === count) {
          data.push(playerItem);
        }
      }

    });
    this.dataSource.data = data;
    this.dataSource.filteredData = data;
  }

  // @deprecated - replaced by filterData
  filterHeroColumn(index: number, value: string) {
    var data = [];
    var pattern = new RegExp(value, "i"); // contains
    this.data.forEach((playerItem) => {
      var fieldName = "hero" + index;
      if (playerItem[fieldName].match(pattern)) {
        data.push(playerItem);
      }
    });
    this.dataSource.data = data;
    this.dataSource.filteredData = data;
  }

  onSelectDisk(index: number, event: any) {
    // *** PLACE HOLDER ***
    return;

    // var value = event.value;
    // var data = [];
    // var pattern = new RegExp(value, "i"); // contains
    // this.data.forEach((playerItem) => {
    //   var fieldName = "disk" + index;
    //   if (playerItem[fieldName].match(pattern)) {
    //     data.push(playerItem);
    //   }
    // });
    // this.dataSource.data = data;
    // this.dataSource.filteredData = data;
  }

  selectHero(hero: string) {
  }

  selectRow(row) {
    console.log("select row", row);
    this.selectedRow = row;
    // set the filter
    this.playerInputData.player = row.player;
    setTimeout(() => {
      var tokens = row.player.split("/");
      this.onFilterPlayer(tokens[0]);
    }, 100);
  }

  isDataChanged() : boolean {
    return this.dataService.isStatsChanged();    
  }

  isEntryDeletable(row): boolean {
    var ok = false;
    if (row.status === "NEW") {
      ok = true;
    }
    return ok;
  }

  isValidEntry(): boolean {
    var ok = false;

    if (this.playerInputData.player) {
      ok = true;
    }
    else {
      ok = false;
    }

    var lookupHero = {};
    for (var index = 1; ok && index < this.TOTAL_HEROES_IN_TEAM + 1; index++) {
      var columnName = "hero" + index;
      if (this.playerInputData[columnName] && this.playerInputData[columnName] !== "ALL") {
        ok = false;
        if (!lookupHero[this.playerInputData[columnName]]) {
          lookupHero[this.playerInputData[columnName]] = true;
          ok = true;
        }
      }
      else {
        ok = false;
      }
    }

    return ok;
  }

  onEditRow(row?) {
  }

  onAddRow() {
    var newDataItem = JSON.parse(JSON.stringify(this.playerInputData));
    this.dataService.addPlayer(newDataItem);
    setTimeout(() => {
      // refresh the list
      this.onFilterPlayer(this.playerInputData.player);
    }, 100);
  }

  onRemoveRow(row?) {
    console.log("deleting this row", row);
    this.dataService.deletePlayer(row);
    setTimeout(() => {
      // refresh the list
      this.onFilterPlayer(this.playerInputData.player);
    }, 100);
  }

  onExportCSV() {
    var content = this.dataService.exportAsCsv();
    this.exportFilename = "heroes.csv";

    var blob = new Blob([content], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    this.exportUrl = this.sanitizer.bypassSecurityTrustUrl(url);

    setTimeout(() => {
      this.exportLink.nativeElement.click();
    }, 100);
  }

  onSave () {
    var vm = this;
    this.dataService.saveAsCsv (function (err, result){
      console.log ("save stats", err);
      if (err) {
        AppGui.showError (vm._dialog, "ERROR", "Failed to save statistics", err.message);
      }
      else {
        AppGui.showInfo(vm._dialog, "STATISTICS", "Success in saving statistics", "");
      }
    })
  }
}

