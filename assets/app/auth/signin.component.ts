import {Component, OnInit} from 'angular2/core';
import {AuthService} from './auth.service';
import {User} from './user';
import {Router} from 'angular2/router';

@Component({
    selector: 'my-signin',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form  (ngSubmit)="onSubmit(f.value)" #f="ngForm">
                
                <div class="form-group">
                    <lable for="email">Mail</lable>
                        <input ngControl="email" type="email" id="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <lable for="password">Password</lable>
                        <input ngControl="password" type="password" id="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="!f.valid">Sign In</button>
        </form>
    </section>
    `
    
})
export class SigninComponent {
    
    constructor(private _authService: AuthService, private _router: Router) {}
    onSubmit(myForm:any) {
        const user = new User(myForm.email, myForm.password);
        this._authService.signin(user)
        .subscribe(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            this._router.navigateByUrl('/');
            
        },
        error => console.error(error)
     );
        
    }
    
}