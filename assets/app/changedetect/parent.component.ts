import {Component} from 'angular2/core';
import { Observable } from 'rxjs/Observable';
//import {Rx} from 'rxjs/Rx';
import {ChildComponent} from './child.component';
import {Http} from "angular2/http";
@Component({
	selector: 'my-parent',
	template: `
        <button class="btn btn-primary" (click)="changePerson()">Change Person</button>
		<my-child [person]="person"></my-child>
       <h3>1st List</h3> 
        <ul>
      <li *ngFor="#activity of activities | async">{{activity.name}}</li>
    </ul>
    <h3>2nd List</h3>
        <ul>
      <li *ngFor="#activity of activities2 | async">{{activity.name}}</li>
    </ul>
	`,
    directives: [ChildComponent]
})
export class ParentComponent {
	person: any;
    //profession: string;
    activities: Observable<Array<any>>;
    activities2: Observable<Array<any>>;
	constructor(http: Http) {
		this.person = {
            name: 'Juri'
        };
        this.activities = http.get('activities.json')
                    .map(response => response.json().activityItems)
                    .share();
                    //.publishLast()
                    //.refCount();
        setTimeout(() => this.activities2 = this.activities, 500);
        //this.profession = 'Engineer';
        //http://blog.thoughtram.io/angular/2016/06/16/cold-vs-hot-observables.html
	}
    changePerson() {
        this.person.name = "Thomas";
    }
    /*let obs = 
    Observable
            .interval(1000)
            .publish();
    obs.connect();

    setTimeout(() => {
    obs.subscribe(v => console.log("Subscriber# 1: " + v));
    setTimeout(
        () => obs.subscribe(v => console.log("Subscriber# 2: " + v)), 1000);

    },2100);*/


/*let obs = Observable.create(observer => observer.next(Date.now()));
obs.subscribe(v => console.log("Subscriber# 1: " + v));
obs.subscribe(v => console.log("Subscriber# 2: " + v));
//obs.connect();*/
}