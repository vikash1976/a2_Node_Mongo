///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from "./app.component";
import {MessageService} from './messages/message.service';
import {AuthService} from './auth/auth.service';
import {ActivityService} from './worklist/worklist.service';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from "angular2/router";
import {HTTP_PROVIDERS} from 'angular2/http';
import {provide} from "angular2/core";

bootstrap(AppComponent, [ActivityService, AuthService, MessageService, HTTP_PROVIDERS, ROUTER_PROVIDERS, 
provide(LocationStrategy, {useClass: HashLocationStrategy})]);