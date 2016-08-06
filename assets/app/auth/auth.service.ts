
import {Http, Headers} from "angular2/http";
import {Injectable} from "angular2/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {User} from './user';

@Injectable()
export class AuthService {
    constructor(private _http: Http) {}
    
    signup(user: User) {
        const body = JSON.stringify(user);
        console.log("User is: ", user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this._http.post('http://localhost:3000/user', body, {headers: headers})
            .map(response => {
                const data = response.json().obj;
                //let message = new Message(data.content, data._id, 'Dummy', null);
                return data;
            })
            .catch(error => Observable.throw(error.json()));
    }
    signin(user: User){
        const body = JSON.stringify(user);
        console.log("User is: ", user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this._http.post('http://localhost:3000/user/signin', body, {headers: headers})
            .map(response => {
                const data = response.json();
                //let message = new Message(data.content, data._id, 'Dummy', null);
                return data;
            })
            .catch(error => Observable.throw(error.json()));
    }
    logout() {
        localStorage.clear();
    }
    isLoggendIn() {
        return localStorage['token'] != null;
    }
}