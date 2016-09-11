import {Component} from 'angular2/core';
import {SignupComponent} from './signup.component';
import {SigninComponent} from './signin.component';
import {AuthService} from './auth.service';
import {ErrorComponent} from '../errors/error.component';

import {LogoutComponent} from './logout.component';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
@Component({
    selector: 'my-auth',
    template: `
        <header class="row spacing">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-tabs">
                    <li><a [routerLink]="['Signup']">Signup</a></li>
                    <li><a [routerLink]="['Signin']" *ngIf="! isLoggedIn()">Signin</a></li>
                    <li><a [routerLink]="['Logout']" *ngIf="isLoggedIn()">Logout</a></li>
                </ul>
            </nav>
        </header>
        <div class="row spacing">
            <router-outlet></router-outlet>
        </div>
        <my-error></my-error>
    `,
    directives: [SignupComponent, SigninComponent, LogoutComponent, ROUTER_DIRECTIVES, ErrorComponent],
    styles: [`
         .router-link-active {
            color: #555;
            cursor: default;
            background-color: #fff;
            border: 1px solid #ddd;
            border-bottom-color: transparent;
        }
    `] 
})
@RouteConfig([
    {path: '/signup', name: 'Signup', component: SignupComponent, useAsDefault: true},
    {path: '/signin', name: 'Signin', component: SigninComponent},
    {path: '/logout', name: 'Logout', component: LogoutComponent}
])
export class AuthenticationComponent {
    constructor(private _authService: AuthService) {}
    isLoggedIn() {
        return this._authService.isLoggendIn();
        
    }
    
}