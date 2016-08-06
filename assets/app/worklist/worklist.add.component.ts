import {Component} from 'angular2/core';
import {ActivityService} from './worklist.service';
import {Activity} from './activity';

@Component({
    selector: 'my-worklist-add',
    template: `
       
            <form (ngSubmit)="onSubmit(f.value)" #f="ngForm">
                    <div class="form-group">
                        <label for="value">Activity</label>
                        <input ngControl="value" type="text" class="form-control" id="value">
                        <label for="priority">Priority</label>
                        <input ngControl="priority" type="number" class="form-control" id="priority">
                    </div>
                    <button type="submit" class="btn btn-primary spacing">Add Activity</button>
                    
                </form>
           
    `
})

export class WorklistAddComponent {
    
    constructor(private _activityService: ActivityService) {}
    onSubmit(form:any) {
            const activity:Activity = new Activity(form.value, form.priority);
            
            this._activityService.create(activity);
    }

}