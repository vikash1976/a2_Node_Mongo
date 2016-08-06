import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {MessagesComponent} from './messages/messages.component';
import {HeaderComponent} from './header.component';
import {AuthenticationComponent} from './auth/authentication.component';
import {SearchComponent} from './search/search.component';
import {WorklistComponent} from './worklist/worklist.component';
import {CartComponent} from './cartbadge/cart.component';
import {ParentComponent} from './changedetect/parent.component';
@Component({
    selector: 'my-app',
    template: `  
        <div class="container">
            <my-header></my-header>
            <router-outlet></router-outlet>
        </div>
    `,
    directives: [MessagesComponent, ROUTER_DIRECTIVES, HeaderComponent]
})
@RouteConfig([
    {path: '/', name: 'Messages', component: MessagesComponent, useAsDefault: true},
    {path: '/auth/...', name: 'Auth', component: AuthenticationComponent},
    {path: '/search', name: 'Search', component: SearchComponent},
    {path: '/activity', name: 'Worklist', component: WorklistComponent},
    {path: '/cart', name: 'Cart', component: CartComponent},
    {path: '/change', name: 'Change', component: ParentComponent}
])
export class AppComponent {
    
    message = "A message";

}