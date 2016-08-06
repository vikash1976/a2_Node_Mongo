import {Http} from 'angular2/http';
import {Component} from 'angular2/core';
import {Input, Output, EventEmitter} from 'angular2/core';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {SearchResultsComponent} from './search.results.component';

@Component({
	selector: 'app-root',
	directives: [SearchResultsComponent],
	template: `
		<my-search (searchEvent)="onSearch($event)" [results]="data" [counter]="counter"></my-search>
		
	`
})

export class SearchComponent {
  private data:Observable<any>;
  private dataObserver:Observer<any>;
	private counter:Observable<any>;
	private counterObserver:Observer<any>;
  private cnt: number = 0;
	constructor(private http: Http) {
    this.data = new Observable(observer => this.dataObserver = observer);
		this.counter = new Observable(observer => this.counterObserver = observer);
	}
	
	onSearch(event) {
	  return this.http.get('https://www.googleapis.com/books/v1/volumes?q=' + event).map((response) => {
	    var books = response.json();
	    return books.items;
	 }).subscribe(result => {
	   this.dataObserver.next(result);
		 this.counterObserver.next(++this.cnt);
		 console.log("Counter in service: ", this.cnt);
	 }, error => console.log('Could not load artists'));
	}
}