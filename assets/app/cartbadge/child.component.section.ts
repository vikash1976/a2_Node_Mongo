//Push Strategy
import {Component,ChangeDetectionStrategy} from 'angular2/core';
import {MasterComponent} from './master.comment';
@Component({
    moduleId: __moduleName,
    templateUrl: 'child.component.html',
    selector:'child-section-1',
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class ChildComponentSection1 extends MasterComponent{
    message: string;
    constructor(){
        super();
        this.message = 'Using ChangeDetectionStrategy.OnPush, only update myself for changes initiated from within me. I am aloof to the change detection cycle initiated by any other component.';
    }
}


@Component({
    moduleId: __moduleName,
    templateUrl: 'child.component.html',
    selector:'child-section-2',
    changeDetection:ChangeDetectionStrategy.Default
})
export class ChildComponentSection2 extends MasterComponent{
    message: string;
    constructor(){
        super();
        this.message = 'Using ChangeDetectionStrategy.Default, getting update for any change to any component on the page, i participate in each change detection cycle regardless of who initiated it.';
    }
}