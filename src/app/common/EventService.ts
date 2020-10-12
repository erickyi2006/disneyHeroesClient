import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


export interface NotifyEvent {
    eventId: string;
    value: {};
    values: any[];
}

@Injectable()
export class EventService {
    static eventSubject: BehaviorSubject<NotifyEvent>= <BehaviorSubject<NotifyEvent>>new BehaviorSubject(undefined);

    constructor() {
        console.log ("EventService()")
    }

    addObserver() {
        console.log ("addObserver()");
        return EventService.eventSubject.asObservable(); 
    }


    addEvent(eventItem: NotifyEvent) {
        console.log ("addEvent()", eventItem);
        EventService.eventSubject.next(eventItem);
    }

}