import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import * as NodeAsync from 'async';
import _ from 'lodash';
import { AppUtil } from '../common/AppUtil';

var EOL = "\r\n";

@Injectable()
export class DataService {
  static STATS: any;
  static FRIENDSHIPS: any = {}; // key = <Hero>.<disk>
  static LOOKUP_FRIENDSHIP: any = {};
  static ROLES: any = {};
  ASSET_PATH: string = environment.ASSETS_PATH;
  SAVE_ALL: boolean = false;

  event: Subject<string> = new Subject();
  loaded: boolean = false;

  static EXTRA_PLAYERS: any[] = [];
  // static EXTRA_PLAYERSx:any[] = [
  //   {
  //     "date": "2020-09",
  //     "player": "caporal.porcinet",
  //     "heroes": [
  //       {
  //         "hero": "Angel",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       },
  //       {
  //         "hero": "Cheshire.Cat",
  //         "disk": "mh",
  //         "friend": "Mad.Hatter"
  //       },
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "co",
  //         "friend": "Colette"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "sonic",
  //     "heroes": [
  //       {
  //         "hero": "Angel",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       },
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "co",
  //         "friend": "Colette"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "neil.diamond",
  //     "heroes": [
  //       {
  //         "hero": "Angel",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       },
  //       {
  //         "hero": "Kristoff.Sven",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Megara",
  //         "disk": "sh",
  //         "friend": "Shank"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "relax.its.a.game",
  //     "heroes": [
  //       {
  //         "hero": "Donald",
  //         "disk": "sc",
  //         "friend": "Scrooge"
  //       },
  //       {
  //         "hero": "Flynn",
  //         "disk": "qh",
  //         "friend": "Quorra"
  //       },
  //       {
  //         "hero": "Goliath",
  //         "disk": "th",
  //         "friend": "Beast"
  //       },
  //       {
  //         "hero": "Mad.Hatter",
  //         "disk": "al",
  //         "friend": "Alice"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "cri.para",
  //     "heroes": [
  //       {
  //         "hero": "Angel",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       },
  //       {
  //         "hero": "Gaston",
  //         "disk": "ca",
  //         "friend": "Calhoun"
  //       },
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Kristoff.Sven",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "bambi",
  //     "heroes": [
  //       {
  //         "hero": "Goliath",
  //         "disk": "th",
  //         "friend": "Beast"
  //       },
  //       {
  //         "hero": "Megara",
  //         "disk": "sh",
  //         "friend": "Shank"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "bo",
  //         "friend": "Bo.Peep"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       },
  //       {
  //         "hero": "Tron",
  //         "disk": "fl",
  //         "friend": "Flynn"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "the.last.phoenix",
  //     "heroes": [
  //       {
  //         "hero": "Angel",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       },
  //       {
  //         "hero": "King.Louie",
  //         "disk": "an",
  //         "friend": "Animal"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "ti",
  //         "friend": "Timon.Pumbaa"
  //       },
  //       {
  //         "hero": "Minnie",
  //         "disk": "mp",
  //         "friend": "Miss.Piggy"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "ccuzzy",
  //     "heroes": [
  //       {
  //         "hero": "Donald",
  //         "disk": "sc",
  //         "friend": "Scrooge"
  //       },
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "ti",
  //         "friend": "Timon.Pumbaa"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "co",
  //         "friend": "Colette"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "ovaltime.chou",
  //     "heroes": [
  //       {
  //         "hero": "Elsa",
  //         "disk": "ol",
  //         "friend": "Olaf"
  //       },
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Kristoff.Sven",
  //         "disk": "ki",
  //         "friend": "Kida"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "bo",
  //         "friend": "Bo.Peep"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "natasha.romanoff",
  //     "heroes": [
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Li.Shang",
  //         "disk": "kr",
  //         "friend": "Kristoff.Sven"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "co",
  //         "friend": "Colette"
  //       },
  //       {
  //         "hero": "Tron",
  //         "disk": "fl",
  //         "friend": "Flynn"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "jazzy.fruit",
  //     "heroes": [
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Kristoff.Sven",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "bo",
  //         "friend": "Bo.Peep"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "sc",
  //         "friend": "Scar"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "duo",
  //     "heroes": [
  //       {
  //         "hero": "Barbossa",
  //         "disk": "ti",
  //         "friend": "Tia.Dalma"
  //       },
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Hank.Dory",
  //         "disk": "ra",
  //         "friend": "Rafiki"
  //       },
  //       {
  //         "hero": "Pleakley",
  //         "disk": "ju",
  //         "friend": "Jumba"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "oikawa",
  //     "heroes": [
  //       {
  //         "hero": "Colette",
  //         "disk": "sa",
  //         "friend": "Sally"
  //       },
  //       {
  //         "hero": "Hook",
  //         "disk": "ba",
  //         "friend": "Barbossa"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "bo",
  //         "friend": "Bo.Peep"
  //       },
  //       {
  //         "hero": "Rapunzel",
  //         "disk": "bo",
  //         "friend": "Bo.Peep"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "peach.gumballs",
  //     "heroes": [
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Hook",
  //         "disk": "ba",
  //         "friend": "Barbossa"
  //       },
  //       {
  //         "hero": "Maximus",
  //         "disk": "fl",
  //         "friend": "Flynn.Rider"
  //       },
  //       {
  //         "hero": "Mulan",
  //         "disk": "bo",
  //         "friend": "Bo.Peep"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2020-09",
  //     "player": "beaute.ray",
  //     "heroes": [
  //       {
  //         "hero": "Angel",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       },
  //       {
  //         "hero": "Hades",
  //         "disk": "me",
  //         "friend": "Megara"
  //       },
  //       {
  //         "hero": "Minnie",
  //         "disk": "mp",
  //         "friend": "Miss.Piggy"
  //       },
  //       {
  //         "hero": "Pleakley",
  //         "disk": "ju",
  //         "friend": "Jumba"
  //       },
  //       {
  //         "hero": "Timon.Pumbaa",
  //         "disk": "st",
  //         "friend": "Stitch"
  //       }
  //     ]
  //   }
  // ];

  constructor(private http: HttpClient) {
  }

  public waitUntilLoaded(cb) {
    if (this.loaded) {
      console.log("chartService already loaded");
      return cb();
    }
    else {
      this.event.subscribe(value => {
        console.log("chartService event received", value);
        return cb();
      });
    }
  }


  getHeroList() {
    var found = [];
    for (var key in DataService.ROLES) {
      let roleItem = DataService.ROLES[key];
      var newHeroItem = {
        hero: key,
        role: roleItem.role,
        pos: roleItem.pos
      };
      found.push(newHeroItem);
    }
    return found;
  }

  searchPlayer(playerName: string) {
    var found = [];
    DataService.STATS.forEach((rowItem) => {
      var pattern = new RegExp(playerName, "i")
      // name contains <playername>/<guidname>
      var names = rowItem.player.split("/"); // only search the name. ignore the guiild
      if (names[0].match(pattern)) {
        found.push(rowItem);
      }
    });
    console.log("found", found.length);
    return found;
  }

  isStatsChanged() {
    var ok = false;

    for (var statIdx = 0; statIdx < DataService.STATS.length; statIdx++) {
      var playerItem = DataService.STATS[statIdx];
      if (playerItem.status === "NEW") {
        ok = true;
        break;
      }
    }
    return ok;
  }

  addPlayer(playerFormData: any) {
    var newPlayerItem = {
      date: AppUtil.getTodayFormattedString("YYYY-MM"),
      player: playerFormData.player,
      heroes: [],
      status: "NEW"
    };
    newPlayerItem.heroes.push(
      {
        hero: playerFormData.hero1,
        disk: playerFormData.disk1,
        friend: this.lookupFriendship(playerFormData.hero1, playerFormData.disk1)
      });
    newPlayerItem.heroes.push(
      {
        hero: playerFormData.hero2,
        disk: playerFormData.disk2,
        friend: this.lookupFriendship(playerFormData.hero2, playerFormData.disk2)
      });
    newPlayerItem.heroes.push(
      {
        hero: playerFormData.hero3,
        disk: playerFormData.disk3,
        friend: this.lookupFriendship(playerFormData.hero3, playerFormData.disk3)
      });
    newPlayerItem.heroes.push(
      {
        hero: playerFormData.hero4,
        disk: playerFormData.disk4,
        friend: this.lookupFriendship(playerFormData.hero4, playerFormData.disk4)
      });
    newPlayerItem.heroes.push(
      {
        hero: playerFormData.hero5,
        disk: playerFormData.disk5,
        friend: this.lookupFriendship(playerFormData.hero5, playerFormData.disk5)
      });

    DataService.STATS.push(newPlayerItem);
    AppUtil.setLocalStorage("find-disney-heroes.stats", DataService.STATS);
  }

  deletePlayer(playerFormData: any) {
    var found = -1;

    if (playerFormData.id) {
      var tokens = playerFormData.id.split(/_|\./);
      console.log(tokens);
      if (tokens.length >= 3) {
        for (var statIdx = 0; statIdx < DataService.STATS.length; statIdx++) {
          var playerItem = DataService.STATS[statIdx];
          if (playerItem.date === tokens[1] &&
            playerItem.player === playerFormData.player &&
            playerItem.heroes[0].hero == playerFormData.hero1 &&
            playerItem.heroes[0].disk == playerFormData.disk1 &&
            playerItem.heroes[1].hero == playerFormData.hero2 &&
            playerItem.heroes[1].disk == playerFormData.disk2 &&
            playerItem.heroes[2].hero == playerFormData.hero3 &&
            playerItem.heroes[2].disk == playerFormData.disk3 &&
            playerItem.heroes[3].hero == playerFormData.hero4 &&
            playerItem.heroes[3].disk == playerFormData.disk4 &&
            playerItem.heroes[4].hero == playerFormData.hero5 &&
            playerItem.heroes[4].disk == playerFormData.disk5) {
            found = statIdx;
            console.log("candidate to be deleted[" + statIdx + "]", playerItem);
            break;
          }
        }
      }
    }
    if (found !== -1) {
      DataService.STATS.splice(found);
    }
  }


  saveAsCsv(cb) {
    // form the header first
    var okToSave = false;
    var heroes = [];
    for (var key in DataService.ROLES) {
      heroes.push(key);
    }
    heroes = heroes.sort();
    var template = "DATE,PLAYER";
    var lookupHero = {};
    for (var heroIdx = 0; heroIdx < heroes.length; heroIdx++) {
      var hero = heroes[heroIdx];
      template += "," + hero;
      lookupHero[hero] = false;
    }

    var content = "" + template + EOL;
    content += template + EOL; // make an extra empty line
    for (var statIdx = 0; statIdx < DataService.STATS.length; statIdx++) {
      var playerItem = DataService.STATS[statIdx];
      if (playerItem.status === "NEW" || this.SAVE_ALL === true) {
        var heroUsage = JSON.parse(JSON.stringify(lookupHero))
        var line = "" + template;
        line = line.replace("DATE", playerItem.date);
        line = line.replace("PLAYER", playerItem.player);
        for (var heroIdx = 0; heroIdx < playerItem.heroes.length; heroIdx++) {
          var heroItem = playerItem.heroes[heroIdx];
          line = line.replace(heroItem.hero, heroItem.disk);
          heroUsage[heroItem.hero] = true;
        }

        for (var key in heroUsage) {
          var ok = heroUsage[key];
          if (!ok) {
            line = line.replace(key, "");
          }
        }

        content += line + EOL;
        okToSave = true;
      }
    }

    if (okToSave) {
      // let buff = new Buffer(content);
      // let base64data = buff.toString('base64');
      let base64data = btoa(content);

      var formData = {
        data: base64data
      };

      this.apiSaveStats(formData).subscribe(
        response => {
          return cb(null);
        },
        (err: HttpErrorResponse) => {
          return cb(err)
        }
      );
    }
    else {
      var error = new Error ("Nothing to save");
      return cb (error);
    }
  }

  exportAsCsv(): string {
    // form the header first
    var heroes = [];
    for (var key in DataService.ROLES) {
      heroes.push(key);
    }
    heroes = heroes.sort();
    var template = "DATE,PLAYER";
    var lookupHero = {};
    for (var heroIdx = 0; heroIdx < heroes.length; heroIdx++) {
      var hero = heroes[heroIdx];
      template += "," + hero;
      lookupHero[hero] = false;
    }

    // console.log ("lookupHeroIndex", JSON.stringify(lookupHeroIndex, null, 2));
    var content = "" + template + EOL;
    content += template + EOL; // make an extra empty line
    for (var statIdx = 0; statIdx < DataService.STATS.length; statIdx++) {
      var heroUsage = JSON.parse(JSON.stringify(lookupHero))
      var playerItem = DataService.STATS[statIdx];
      var line = "" + template;
      line = line.replace("DATE", playerItem.date);
      line = line.replace("PLAYER", playerItem.player);
      for (var heroIdx = 0; heroIdx < playerItem.heroes.length; heroIdx++) {
        var heroItem = playerItem.heroes[heroIdx];
        line = line.replace(heroItem.hero, heroItem.disk);
        heroUsage[heroItem.hero] = true;
      }

      for (var key in heroUsage) {
        var ok = heroUsage[key];
        if (!ok) {
          line = line.replace(key, "");
        }
      }

      content += line + EOL;
    }

    // patched some extra players
    for (statIdx = 0; statIdx < DataService.EXTRA_PLAYERS.length; statIdx++) {
      var heroUsage = JSON.parse(JSON.stringify(lookupHero))
      var playerItem = DataService.EXTRA_PLAYERS[statIdx];
      var line = "" + template;
      line = line.replace("DATE", playerItem.date);
      line = line.replace("PLAYER", playerItem.player);
      for (var heroIdx = 0; heroIdx < playerItem.heroes.length; heroIdx++) {
        var heroItem = playerItem.heroes[heroIdx];
        line = line.replace(heroItem.hero, heroItem.disk);
        heroUsage[heroItem.hero] = true;
      }

      for (var key in heroUsage) {
        var ok = heroUsage[key];
        if (!ok) {
          line = line.replace(key, "");
        }
      }

      content += line + EOL;
    }

    return content;
  }

  lookupFriendship(hero: string, disk: string): string {
    var friend: string = "";
    var key = hero + "." + disk;
    if (DataService.FRIENDSHIPS[key]) {
      friend = DataService.FRIENDSHIPS[key];
    }
    return friend;
  }

  searchFriendship(hero: string): any {
    var found = {};
    if (DataService.LOOKUP_FRIENDSHIP[hero]) {
      var friendshipItem = DataService.LOOKUP_FRIENDSHIP[hero];
      found = friendshipItem;
    }
    console.log("found friendship", found);
    return found;
  }

  // must be called first
  public load(callback) {
    var vm = this;
    NodeAsync.waterfall(
      [
        function (cb) {
          vm.apiLoadLookupRoles().subscribe(response => {
            // console.log("downloading roles ... ", response);
            DataService.ROLES = response;
            return cb(null); // ok
          });
        },
        function (cb) {
          vm.apiLoadFriendships().subscribe(response => {
            // console.log("downloading friendship ... ", response);
            DataService.FRIENDSHIPS = response;
            DataService.LOOKUP_FRIENDSHIP = vm.getLookupFriendship();
            return cb(null); // ok
          });
        },
        function (cb) {
          vm.apiLoadStats().subscribe(response => {
            // console.log("downloading stats ... ", response);
            var stats = vm.processStatus(response);
            DataService.STATS = stats;
            // console.log ("stats", stats);
            return cb(null);
          });
        }
      ],
      function (err) {
        console.log("DataService.onInit done. error=", err);
        var eventString = "loaded";
        vm.event.next(eventString);
        vm.loaded = true;

        if (err) {
          console.error("In waterfall error cb: ==>", err, "<==");
          return callback(err);
        }
        console.log("DataService.onInit done ok");

        return callback(null);
      });
  }


  apiLoadStats(): Observable<any> {
    console.log("apiLoadStats ...");

    var url = this.ASSET_PATH + "/json/heroes.csv"
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        tap(response => console.log('stats loaded ok')),
        catchError(err => {
          console.log("LoadStats ERROR", err);
          return []
        })
      );
  }

  apiLoadFriendships(): Observable<any> {
    console.log("loadFriendships ...");
    var url = this.ASSET_PATH + "/json/lookupFriendships.json"
    return this.http.get<any[]>(url)
      .pipe(
        tap(response => console.log('friendships looded ok')),
        catchError(err => {
          console.log("loadFriendships ERROR", err);
          return []
        })
      );
  }

  apiLoadLookupRoles(): Observable<any> {
    console.log("loadLookupRoles ...");
    var url = this.ASSET_PATH + "/json/lookupRoles.json"
    return this.http.get<any[]>(url)
      .pipe(
        tap(response => console.log('roles loaded ok')),
        catchError(err => {
          console.log("loadLookupRoles ERROR", err);
          return []
        })
      );
  }

  apiLoadCollections(): Observable<any> {
    console.log("loadCollections ...");
    var url = this.ASSET_PATH + "/json/collections.json"
    return this.http.get<any[]>(url)
      .pipe(
        tap(response => console.log('collections loaded ok')),
        catchError(err => {
          console.log("loadCollections ERROR", err);
          return []
        })
      );
  }

  private apiSaveStats(formData): Observable<any> {
    return this.http.post('/v1/logs/disney', formData)
      .pipe(
        tap(response => console.log('stats saved ok'))
      );
  }

  private processStatus(data: any) {
    var heroItems = [];
    var heroes = [];

    // this is a text file
    var contents = "" + data;
    var lines = contents.split("\n");

    // get the hero names
    var line = lines[0];
    line = line.replace("\r", "");
    var tokens = line.split(",");
    for (var tokenIdx = 0; // maintain the index - we need [0]
      tokenIdx < tokens.length; tokenIdx++) {
      var token = tokens[tokenIdx];
      heroes.push(token);
    }

    var lineIdx = 2; // skip the headers
    for (; lineIdx < lines.length; lineIdx++) {
      line = lines[lineIdx];
      line = line.replace("\r", "");
      if (line.length > 0) {
        var tokens = line.split(",");
        if (tokens) {
          // Date,Player,Alice,Aladdin,Anger,Animal,Barbossa,Baymax,Beast,Bo.Peep,Buzz,Calhoun,Colette,Dark.Wing,Dash,Donald,Ducky.Bunny,Duke.Caboom,Elasticgirl,Elsa,Eve,Facilier,Felix,Finnick,Flynn,Flynn.Rider,Frozone,Gaston,Genie,Gizmo,Gonzo,Goofy,Hades,Hercules,Hiro,Hook,Huey.D.L,Jack.Jack,Jack.Sparrow,Jafar,Jasmine,Joy,Judy.Hopps,Launchpad,Linguini,Madam.Mim,Mad.Hatter,Magica,Maleficent,Megara,Megavolt,Merida,Merlin,Mickey,Miguel,Mike,Miss.Piggy,Moana,Mr.Incredible,Nick.Wilde,Olaf,Oogie,Peter.Pan,Powerline,Quorra,Rafiki,Randall,Rapunzel,Rex,Robin.Hood,Scar,Scrooge,Shank,Simba.Nala,Stitch,Sulley,Tia.Dalma,Timon.Pumbaa,Ursula,Violet,WallE,Woody,Yax,Yzma,Zurg
          var date = tokens[0];
          var player = tokens[1];
          var playerIndex = player.indexOf("/");
          if (playerIndex !== -1) {
            player = player.substr(0, playerIndex); // stripped of the "/"
          }
          var newPlayerItem = {
            date: date,
            player: player,
            heroes: [],
            status: "ACTIVE"
          };

          for (var tokenIdx = 2; // skip the player
            tokenIdx < tokens.length; tokenIdx++) {
            var token = tokens[tokenIdx];
            if (!_.isEmpty(token)) {
              var hero = heroes[tokenIdx];
              var friendship = hero + "." + token;
              var friend = "";
              if (DataService.FRIENDSHIPS[friendship]) {
                friend = DataService.FRIENDSHIPS[friendship];
              }
              else {
                if (token !== "None") {
                  console.warn("WARN: friendship not found", friendship);
                }
              }
              var newHeroItem = {
                hero: hero,
                disk: token,
                friend: friend
              };
              newPlayerItem.heroes.push(newHeroItem);
            }
          }
        }
        if (newPlayerItem.heroes.length === 5) {
          heroItems.push(newPlayerItem);
        }
      }
    }

    return heroItems;
  }

  getLookupFriendship() {
    var lookupFriendship = {};
    for (var key in DataService.FRIENDSHIPS) {
      var friend = DataService.FRIENDSHIPS[key];
      var index = key.lastIndexOf(".");
      var hero = key.substr(0, index);
      var disk = key.substr((index + 1));

      if (!lookupFriendship[hero]) {
        lookupFriendship[hero] = {
          hero: hero,
          disks: []
        };
      }
      var heroItem = lookupFriendship[hero];
      var newDiskItem = {
        disk: disk,
        friend: friend
      }
      heroItem.disks.push(newDiskItem);
    }
    return lookupFriendship;
  }
}