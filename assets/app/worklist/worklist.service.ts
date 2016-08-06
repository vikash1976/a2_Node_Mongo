import { Injectable } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {Activity} from './activity';

@Injectable()
export class ActivityService {
  private _Activities$: Subject<Activity[]>;
  private baseUrl: string;
  private dataStore: {
    Activities: Activity[]
  };

  constructor(private http: Http) {
    this.baseUrl  = 'http://localhost:3000';
    this.dataStore = { Activities: [] };
    this._Activities$ = <Subject<Activity[]>>new Subject();
  }

  get Activities$() {
    return this._Activities$.asObservable();
  }

  loadAll() {
    this.http.get(`${this.baseUrl}/activities`).map(response =>  response.json())
    .subscribe(data => {
      this.dataStore.Activities = data.obj;
      this._Activities$.next(this.dataStore.Activities);
    }, error => console.log('Could not load Activities.'));
  }

  
  create(activity: Activity) {
    console.log("Activity to save at UI: ", activity);
    const headers = new Headers({'Content-Type': 'application/json'});
    const body = JSON.stringify(activity);
    return this.http.post(`${this.baseUrl}/activities`,body , {headers: headers})
      .map(response => response.json()).subscribe(data => {
        this.dataStore.Activities.push(data.obj);
        this._Activities$.next(this.dataStore.Activities);
      }, error => console.log('Could not create Activity.'));
  }
}
  /*
  /*load(id: any) {
    this.http.get(`${this.baseUrl}/activities/${id}`).map(response => response.json()).subscribe(data => {
      let notFound = true;

      this.dataStore.Activities.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.Activities[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.Activities.push(data);
      }

      this._Activities$.next(this.dataStore.Activities);
    }, error => console.log('Could not load Activity.'));
  }
  update(Activity: Activity) {
    this.http.put(`${this.baseUrl}/activities/${Activity.id}`, JSON.stringify(Activity))
      .map(response => response.json()).subscribe(data => {
        this.dataStore.Activities.forEach((Activity, i) => {
          if (Activity._id === data._id) { this.dataStore.Activities[i] = data; }
        });

        this._Activities$.next(this.dataStore.Activities);
      }, error => console.log('Could not update Activity.'));
  }

  remove(ActivityId: number) {
    this.http.delete(`${this.baseUrl}/Activities/${ActivityId}`).subscribe(response => {
      this.dataStore.Activities.forEach((t, i) => {
        if (t.id === ActivityId) { this.dataStore.Activities.splice(i, 1); }
      });

      this._Activities$.next(this.dataStore.Activities);
    }, error => console.log('Could not delete Activity.'));
  }*/

