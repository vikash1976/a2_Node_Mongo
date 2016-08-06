import {Component} from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";
@Component({
    selector: 'my-header',
    template: `
        <header class="row">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-pills">
                    <li><a [routerLink]="['Messages']">Messages</a></li>
                    <li><a [routerLink]="['Auth']">Authentication</a></li>
                    <li><a [routerLink]="['Search']">Search</a></li>
                    <li><a [routerLink]="['Worklist']">Worklist</a></li>
                    <li><a [routerLink]="['Cart']">Cart</a></li>
                    <li><a [routerLink]="['Change']">Change</a></li>
                </ul>
            </nav>
        </header>
    `,
    directives: [ROUTER_DIRECTIVES],
    styles: [`
        header {
            margin-bottom: 20px;
        }
    
        ul {
          text-align: center;  
        }
        
        li {
            float: none;
            display: inline-block;
        }
        
        .router-link-active, .nav>li>a:focus {
            background: #337ab7;
            color: white;
        }
        
       
    `]
})
export class HeaderComponent {
    
}