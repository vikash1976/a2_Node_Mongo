import {Component, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {AuthService} from './auth.service';
import {User} from './user';

@Component({
    selector: 'my-signup',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form [ngFormModel]="myForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <lable for="firstName">First Name</lable>
                        <input [ngFormControl]="myForm.find('firstName')" type="text" id="firstName" class="form-control">
                </div>
                <div class="form-group">
                    <lable for="lastName">Last Name</lable>
                        <input [ngFormControl]="myForm.find('lastName')" type="text" id="lastName" class="form-control">
                </div>
                <div class="form-group">
                    <lable for="email">Mail</lable>
                        <input [ngFormControl]="myForm.find('email')" type="email" id="email" class="form-control">
                </div>
                <div class="form-group">
                    <lable for="password">Password</lable>
                        <input [ngFormControl]="myForm.find('password')" type="password" id="password" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="!myForm.valid">Sign Up</button>
        </form>
    </section>
    `
    
})
export class SignupComponent implements OnInit{
    myForm: ControlGroup;
    
    constructor(private _fb: FormBuilder, private _authService: AuthService) {}
    ngOnInit(){
        this.myForm = this._fb.group(
            {
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', Validators.compose([
                    Validators.required,
                    this.isEmail
                ])],
                password: ['', Validators.required]
            });
    }
    
    onSubmit() {
        const user:User = new User(this.myForm.value.email, this.myForm.value.password, 
                            this.myForm.value.firstName, this.myForm.value.lastName);
            console.log("User is--: ", user);
            this._authService.signup(user)
                .subscribe(
                    data => {
                        console.log(data);
                        //this._messageService.messages.push(data);
                    },
                    error => console.error(error)
                );
    }
    private isEmail(control: Control) : {[s: string]: boolean} {
         if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
            return {'invalidMail': true};
        }
    };
    
}