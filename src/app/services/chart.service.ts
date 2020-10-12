import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { GraphService } from './graph.service';
import * as NodeAsync from 'async';
import _ from 'lodash';
import {Subject} from 'rxjs';

@Injectable()
export class ChartService {
    LIMIT: number = 50;
    MAX_COLUMN: number = 100;
    static HEROES= {};
    static LOOKUP_ROLE= {};
    static ROLES= {};
    static FRIENDSHIPS = [];
    static COLLECTIONS= {};

    event: Subject<string> = new Subject();
    loaded: boolean = false;

    constructor(
        private dataService: DataService,
        private graphService: GraphService
    ) {
        console.log("ChartService()")
    }

    // must be called first
    public init(cb) {
        var vm = this;
        console.log("ChartService.init ... loading");
        NodeAsync.waterfall(
            [
                function (cb) {
                    vm.dataService.loadHeroes(2).subscribe(response => {
                        console.log("getHeroes 2.downloading ... ", response);
                        ChartService.HEROES[2] = response;
                        return cb(null); // ok
                    });
                },
                function (cb) {
                    vm.dataService.loadHeroes(3).subscribe(response => {
                        console.log("getHeroes 3.downloading ... ", response);
                        ChartService.HEROES[3] = response;
                        return cb(null); // ok
                    });
                },
                function (cb) {
                    vm.dataService.loadHeroes(4).subscribe(response => {
                        console.log("getHeroes 4.downloading ... ", response);
                        ChartService.HEROES[4] = response;
                        return cb(null); // ok
                    });
                },
                function (cb) {
                    vm.dataService.loadHeroes(5).subscribe(response => {
                        console.log("getHeroes 5.downloading ... ", response);
                        ChartService.HEROES[5] = response;
                        return cb(null); // ok
                    });
                },
                function (cb) {
                    vm.dataService.loadFriendships().subscribe(response => {
                        console.log("getFriendships.downloading ... ", response);
                        ChartService.FRIENDSHIPS = response;
                        return cb(null); // ok
                    });
                },
                function (cb) {
                    vm.dataService.loadLookupRoles().subscribe(response => {
                        console.log("getLookupRoles.downloading ... ", response);
                        ChartService.LOOKUP_ROLE = response;
                        return cb(null); // ok
                    });
                },
                function (cb) {
                    vm.dataService.loadRoles().subscribe(response => {
                        console.log("getRoles.downloading ... ", response);
                        ChartService.ROLES = response;
                        return cb(null); // ok
                    });
                },
                function (cb) {
                    vm.dataService.loadCollections().subscribe(response => {
                        console.log("getCollections.downloading ... ", response);
                        ChartService.COLLECTIONS = response;
                        return cb(null); // ok
                    });
                }
                
            ],
            function (err) {
                console.log("ChartService.onInit done. error=", err);
                if (err) {
                    console.error("In waterfall error cb: ==>", err, "<==");
                    return cb(err);
                }
                console.log("ChartService.onInit done ok");
                var eventString = "loaded";
                vm.event.next(eventString);
                vm.loaded = true;
                return cb(null);
            });
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

    public isLoaded(): boolean {
        return this.loaded;
    }

    public getCollectionNames() {
        var collections = [];
        for (var key in ChartService.COLLECTIONS) {
            collections.push(key);
        }
        return collections;
    }

    public getCollection(collectionName: string) {
        var heroes = [];

        if (ChartService.COLLECTIONS[collectionName]) {
            var heroNames = ChartService.COLLECTIONS[collectionName];
            heroNames.forEach ((name)=> {
                if (ChartService.LOOKUP_ROLE[name]) {
                    var heroItem = ChartService.LOOKUP_ROLE[name];
                    var newHeroItem = {
                        hero: name,
                        role:  heroItem.role,
                        position: heroItem.pos
                    };
                    heroes.push(newHeroItem);
                }
            });
        }
        return heroes;
    }

    
    public getHeroesSeries(heroName: string, numTeams: number, maxRows: number) {
        var METHOD_NAME = "getHeroesSeries";
        var series = [];

        if (ChartService.HEROES[numTeams]) {
            var lookupTeams = {};
            var lookupHeroes = {};
            var foundHeroes = [];
            var heroes = ChartService.HEROES[numTeams];

            var lookupTeams = {};
            var lookupHeroes = {};
            var foundHeroes = [];
            var heroes = ChartService.HEROES[numTeams];

            // find the unique heroes first
            for (var heroIdx = 0; heroIdx < heroes.length; heroIdx++) {
                var heroItem = heroes[heroIdx];
                if (heroItem.heroes.indexOf(heroName) !== -1) {
                    foundHeroes.push (heroItem);
                }
            }

            var popularHeroes = foundHeroes.sort(function (item1, item2) {
                var value1 = item1.total;
                var value2 = item2.total;
                return value2 - value1;
            });

            // find the unique heroes first
            for (var heroIdx = 0; heroIdx < popularHeroes.length && heroIdx < maxRows; heroIdx++) {
                var heroItem = popularHeroes[heroIdx];
                var team = ""+  heroItem.heroes;
                team = team.replace(/\.\*/g, ",");
                heroItem.heroes = team;
                var columnKey = heroItem.heroes;
                if (!lookupTeams[columnKey]) {
                    var newColumnItem = {
                        name: "" + columnKey,
                        value: heroItem.total
                    };
                    lookupTeams[columnKey] = newColumnItem;
                    series.push(newColumnItem);
                }
            }
            console.log(METHOD_NAME + ".DEBUG", JSON.stringify(lookupTeams));
        }
        return series;
    }

    public getHeroesMultiSeries(heroName: string, numTeams: number) {
        var METHOD_NAME = "getHeroesMultiSeries";

        if (ChartService.HEROES[numTeams]) {
            var lookupTeams = {};
            var lookupHeroes = {};
            var foundHeroes = [];
            var heroes = ChartService.HEROES[numTeams];
            // find the unique heroes first
            for (var heroIdx = 0; heroIdx < heroes.length; heroIdx++) {
                var heroItem = heroes[heroIdx];
                if (heroItem.heroes.indexOf(heroName) !== -1) {
                    foundHeroes.push (heroItem);
                    var team = ""+  heroItem.heroes;
                    team = team.replace(/\.\*/g, ",");
                    // "heroes": "Animal.*Hook.*Randall",
                    // "heroes": "Animal.*Joy.*Randall",
                    var tokens = team.split(",");
                    tokens.forEach(hero => {
                        if (!lookupHeroes[hero]) {
                            lookupHeroes[hero] = true;
                        }
                    });
                }
            }

            for (var hero in lookupHeroes) {
                var columnKey  = ""+ hero;
                for (var heroIdx = 0; heroIdx < foundHeroes.length; heroIdx++) {
                    var heroItem = foundHeroes[heroIdx];
                    if (heroItem.heroes.indexOf(hero) !== -1) {
                        var team = ""+  heroItem.heroes;
                        team = team.replace(/\.\*/g, ",");
                        var seriesKey = ""+ team;

                        if (!lookupTeams[columnKey]) {
                            var newColumnItem = {
                                name: "" + columnKey,
                                series: {}
                            };
                            lookupTeams[columnKey] = newColumnItem;
                        }
                
                        var columnItem = lookupTeams[columnKey];                       
                        if (!columnItem.series[seriesKey]) {
                            var newSeriesItem = {
                                name: "" + seriesKey,
                                value: 0
                            };
                            columnItem.series[seriesKey] = newSeriesItem;
                            newSeriesItem.value = heroItem.total;
                        }
                    }
                }
            }
            console.log(METHOD_NAME + ".DEBUG", JSON.stringify(lookupTeams));
        }
        return this.graphService.createMultiGraphSeriesData(lookupTeams);
    }

    public getRoleCombinationByHero(heroName: string) {
        var total = 0;
        var foundHeroes: any[]= [];
        for (var key in ChartService.ROLES) {
            var heroes = ChartService.ROLES[key];
            for (var heroIdx = 0; heroIdx < heroes.length; heroIdx++) {
                var newHeroItem = {
                    roles : key,
                    totalHero: 0,
                    Tank : [],
                    Damage : [],
                    Support : [],
                    Control : []
                };
                var heroLine = heroes[heroIdx];
                if (heroLine.indexOf(heroName) !== -1) {
                    var ok = true;
                    var tokens = heroLine.split(",");
    
                    for (var tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++) {
                        var token = tokens[tokenIdx];
                        if (!_.isEmpty(token)) {
                            // we are good to go
                            if (!ChartService.LOOKUP_ROLE[token]) {
                                console.error ("role not found", token);
                                ok = false;
                                break;
                            }
                            var roleName = ChartService.LOOKUP_ROLE[token].role;
                            newHeroItem[roleName].push(token);
                            newHeroItem.totalHero++;
                        }
                    }
                    if (ok) {
                        foundHeroes.push(newHeroItem);
                    }
                }
            }
        }
        return foundHeroes;
    }

    public getFriendships(heroName: string) {
        var METHOD_NAME = "getFriendships";

        var friendships = [];
        if (ChartService.FRIENDSHIPS) {
            // friendship with hero
            friendships = this.getFriendshipsByHero(heroName);
            friendships = friendships.concat(this.getFriendshipsByFriend(heroName));
        }
        return friendships;
    }

    private getFriendshipsByHero(heroName: string) {
        var total = 0;
        var friendships: any[]= [];
        for (var heroIdx = 0; heroIdx < ChartService.FRIENDSHIPS.length; heroIdx++) {
            var heroItem = ChartService.FRIENDSHIPS[heroIdx];
            if (heroItem.hero === heroName) {
                total += heroItem.total;
                friendships.push(heroItem);
            }
        }
        for (var heroIdx = 0; heroIdx < friendships.length; heroIdx++) {
            var heroItem = friendships[heroIdx];
            heroItem["percent"] = Math.round(heroItem.total * 100 / total);
            heroItem["type"] = "Hero";
        }
        return friendships;
    }
    
    private getFriendshipsByFriend(heroName: string) {
        var friendships: any[]= [];
        var lookupFriend = {};
        for (var heroIdx = 0; heroIdx < ChartService.FRIENDSHIPS.length; heroIdx++) {
            var heroItem = ChartService.FRIENDSHIPS[heroIdx];
            if (heroItem.friend === heroName) {
                var foundHeroItem = JSON.parse(JSON.stringify(heroItem));
                friendships.push(foundHeroItem);

                if (!lookupFriend[heroItem.hero]) {
                    lookupFriend[heroItem.hero] = this.getFriendshipsByHero(heroItem.hero);
                }
            }
        }

        for (var heroIdx = 0; heroIdx < friendships.length; heroIdx++) {
            var heroItem = friendships[heroIdx];
            for (var key in lookupFriend) {
                var friendHeroes = lookupFriend[heroItem.hero];
                for (var friendIdx = 0; friendIdx < friendHeroes.length; friendIdx++) {
                    var friendItem = friendHeroes[friendIdx];
                    if (friendItem.friend === heroName) {
                        heroItem["percent"] = friendItem.percent;
                        heroItem["type"] = "Friend";
                        break;
                    }
                }
            }
        }
        return friendships;
    }
}