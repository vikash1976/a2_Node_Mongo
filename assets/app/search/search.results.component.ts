import {Control, FORM_DIRECTIVES} from 'angular2/common';  
import {Component, Output, Input, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';  
//import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'my-search',
  directives: [FORM_DIRECTIVES],
  template: `
    <h1>Search</h1>
    <input class="form-control"
      [ngFormControl]="searchBox" 
      placeholder="Search artist" />
      <h3>Searched: {{searchCount}} times</h3>
      
    <div *ngFor="#books of results | async">
      <section class="panel panel-default">
        <div class="panel-body">
          <div class="col col-md-6">{{ books.volumeInfo.title }}</div>
          <div class="col col-md-4">{{ books.volumeInfo.publisher }}</div>
        </div>
      </section>
      
    </div>
  `
})
export class SearchResultsComponent implements OnInit {

  @Input() results: Observable<any>;
  @Input() counter: Observable<any>;
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  searchCount: number = 0;
  
  //
  source = new Observable((observer) => {
  const socket = new WebSocket('ws://localhost:8080');
  
    socket.onmessage = function (event) {
        observer.next(event);
      };
      socket.onclose = function(event) {
          alert('Server closed the connection........');
      };
  
    return () => socket.close();
  })
  .retryWhen(errors => errors.switchMap(err => {
        return navigator.onLine ? Observable.timer(3000) :
        Observable.fromEvent(window, 'online').take(1);
    }));
  
  
  
  

 private searchBox:Control = new Control();

  constructor() {
    this.searchBox
        .valueChanges
        .debounceTime(200)
        .subscribe((event) => {
          this.searchEvent.emit(event)
                
      });
     
  }
  hot = this.source.share();
  
 
  
  ngOnInit() {
    
     this.counter.subscribe(data => this.searchCount = data);
     
    // first connection
    var  sub1 = this.hot.subscribe((e) => console.log('s1', e));
    var sub2: any;

    // second connection one second later
    
    
    setTimeout(() => {
      console.log('using hot observable...');
      sub2 = this.hot.subscribe((e) => console.log('s2', e));
    }, 1000);


    // since we're pumping all of the values through a Subject, which 
    // mutlicasts to all subscribers, we've made our source "hot".

    // After a while, we'll unsubscribe from both,
    // and now our socket will disconnect.
    setTimeout(() => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    }, 4000);

    setTimeout(() => {
      // reusing the hot observable
      console.log('reusing hot observable...');
      this.hot.subscribe((e) => console.log('s3', e));
    }, 4500);
  }
  
 
    

}


