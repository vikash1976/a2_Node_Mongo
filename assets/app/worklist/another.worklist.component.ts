import {Component, OnInit, Input, ChangeDetectionStrategy} from 'angular2/core';
import {ChangeDetectorRef} from 'angular2/core';
import {ActivityService} from './worklist.service';
import {Activity} from './activity';
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
@Component({
    selector: 'another-my-worklist',
    template: `
             <h4>Normal Priority Tasks - {{normalPrioQueue}}</h4>
             <article class="panel panel-default  activity-box">
                <div class="panel-body normal-priority"  *ngFor="#activity of anotherActivities$ | async" >
                {{activity.value}}
                </div>
             </article>
                
    `
})

export class AnotherWorklistComponent implements OnInit{
     
     anotherActivities$: Observable<any>;
    
     normalPrioQueue: number;
     height = 230;
     
    constructor(private _activityService: ActivityService) {}
    
    ngOnInit(){
       
        this.anotherActivities$ = this._activityService.Activities$
        .map(todos => todos.filter(item => item.priority > 5)); // subscribe to entire collection
        
        this._activityService.loadAll();    // load all todos
        
        this.anotherActivities$.subscribe(data => this.normalPrioQueue = data.length);
     }
    
}