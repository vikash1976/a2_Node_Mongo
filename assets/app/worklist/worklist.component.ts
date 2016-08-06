import {Component, OnInit, Input, ChangeDetectionStrategy} from 'angular2/core';
import {ChangeDetectorRef} from 'angular2/core';
import {ActivityService} from './worklist.service';
import {Activity} from './activity';
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {AnotherWorklistComponent} from './another.worklist.component';
import {WorklistAddComponent} from './worklist.add.component';
@Component({
    selector: 'my-worklist',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <my-worklist-add></my-worklist-add>
            <div class="row" >
                <div class="col-md-4">
                    <h4>High Priority Tasks - {{highPrioQueue}}</h4>
                        <article class="panel panel-default  activity-box">
                        
                            <div class="panel-body high-priority"  *ngFor="#activity of activities$ | async" >
                                {{activity.value}}</div>
                        </article> 
                 </div>
                 <div class="col-md-4 col-md-offset-4">    
                        <another-my-worklist></another-my-worklist>
                 </div>
                
           </div>
            </section>
    `,
    directives: [AnotherWorklistComponent, WorklistAddComponent]
})

export class WorklistComponent implements OnInit{
    activities$: Observable<any>;
    highPrioQueue: number;
    height = 230;
     
    constructor(private _activityService: ActivityService) {}
    onSubmit(form:any) {
            const activity:Activity = new Activity(form.value, form.priority);
            
            this._activityService.create(activity);
    }

    ngOnInit(){
        this.activities$ = this._activityService.Activities$
         .map(todos => todos.filter(item => item.priority <= 5)); // subscribe to entire collection
        
        this._activityService.loadAll();    // load all todos
        
       this.activities$.subscribe(data => this.highPrioQueue = data.length);
     }
    
}