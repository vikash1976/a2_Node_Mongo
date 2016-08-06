import {Component, Output, Input, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Observer} from 'rxjs/Observer';
import {CartBadgeComponent} from './cart.badge.component';
import {ChildComponentSection1, ChildComponentSection2} from './child.component.section';
@Component({
  selector: 'my-cart',
  template: `<div class="panel-body">
                <h3>Pick Items from here...</h3>
                <button class="btn btn-primary" (click)="onAddToCart()">Add to Cart</button>
              </div>
            <my-cart-badge [itemAddStream]="counter"></my-cart-badge>
            <child-section-1></child-section-1>
            <child-section-2></child-section-2>
  `,
  directives: [CartBadgeComponent, ChildComponentSection1, ChildComponentSection2],
})
export class CartComponent {

  private counter:Observable<any>;
  private counterObserver:Observer<any>;
  
  constructor() {
    this.counter = new Observable(observer => this.counterObserver = observer);
  }
  onAddToCart(){
    this.counterObserver.next(1);
  }
  
}