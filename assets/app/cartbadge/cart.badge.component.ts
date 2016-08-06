import {Component, Output, Input, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {MasterComponent} from './master.comment';
@Component({
  selector: 'my-cart-badge',
  template: `
  <div style="border: 1px solid black;padding: 5px;">
        <div class="alert alert-info">
            {{message}}
        </div>
        <div><strong>{{lastUpdated()}}</strong></div>
        <h3>The Cart Badge</h3>
        <h4>Items in your cart : {{counter}}</h4>
    
    </div>
     
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartBadgeComponent extends MasterComponent implements OnInit {

  @Input() itemAddStream:Observable<any>;
  counter = 0;
  message = 'Using ChangeDetectionStrategy.onPush, i decide when to update myself, currently at an interval of 5 secs';
  constructor(private cd: ChangeDetectorRef) {
    super();
    setInterval(() => {
      this.cd.markForCheck();
      }, 5000);
  };
  //private cnt: number = 0;
  

  
  ngOnInit() {
    this.itemAddStream.subscribe(() => {
      this.counter++; // application state changed
      console.log("Item is Cart: ", this.counter);
     });
 
  }
}