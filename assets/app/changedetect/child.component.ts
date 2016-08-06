import {Component, OnChanges, Input, DoCheck, KeyValueDiffers} from 'angular2/core';

@Component({
	selector: 'my-child',
	template: `
		<h2>Child component</h2>
		{{ person.name }}
	`
})
export class ChildComponent implements DoCheck {
	@Input() person: any;
	differ: any;

	constructor(private differs: KeyValueDiffers) {
		this.differ = differs.find({}).create(null);
	}

	ngDoCheck() {
		var changes = this.differ.diff(this.person);

		if(changes) {
			console.log('changes detected');
			changes.forEachChangedItem(r => console.log('changed ', r.currentValue));
			changes.forEachAddedItem(r => console.log('added ' + r.currentValue));
			changes.forEachRemovedItem(r => console.log('removed ' + r.currentValue));
		} else {
			console.log('nothing changed');
		}
	}
}