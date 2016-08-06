var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("messages/message", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Message;
    return {
        setters:[],
        execute: function() {
            Message = (function () {
                function Message(content, messageId, username, userId) {
                    this.content = content;
                    this.messageId = messageId;
                    this.username = username;
                    this.userId = userId;
                }
                return Message;
            }());
            exports_1("Message", Message);
        }
    }
});
System.register("messages/message.service", ["messages/message", "angular2/http", "angular2/core", "rxjs/Observable"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var message_1, http_1, core_1, Observable_1;
    var MessageService;
    return {
        setters:[
            function (message_1_1) {
                message_1 = message_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            MessageService = (function () {
                function MessageService(_http) {
                    this._http = _http;
                    this.messages = [];
                    this.messageIsEdit = new core_1.EventEmitter();
                }
                MessageService.prototype.addMessage = function (message) {
                    var body = JSON.stringify(message);
                    console.log("Message is: ", message);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    return this._http.post('http://localhost:3000/message', body, { headers: headers })
                        .map(function (response) {
                        var data = response.json().obj;
                        var message = new message_1.Message(data.content, data._id, 'Dummy', null);
                        return message;
                    })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                MessageService.prototype.getMessages = function () {
                    return this._http.get('http://localhost:3000/message')
                        .map(function (response) {
                        var data = response.json().obj;
                        var objs = [];
                        for (var i = 0; i < data.length; i++) {
                            var message = new message_1.Message(data[i].content, data[i]._id, 'Dummy', null);
                            objs.push(message);
                        }
                        return objs;
                    })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                MessageService.prototype.updateMessage = function (message) {
                    var body = JSON.stringify(message);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    return this._http.patch('http://localhost:3000/message/' + message.messageId, body, { headers: headers })
                        .map(function (response) { return response.json(); })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                MessageService.prototype.editMessage = function (message) {
                    this.messageIsEdit.emit(message);
                };
                MessageService.prototype.deleteMessage = function (message) {
                    this.messages.splice(this.messages.indexOf(message), 1);
                    return this._http.delete('http://localhost:3000/message/' + message.messageId)
                        .map(function (response) { return response.json(); })
                        .catch(function (error) { return Observable_1.Observable.throw(error.json()); });
                };
                MessageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], MessageService);
                return MessageService;
            }());
            exports_2("MessageService", MessageService);
        }
    }
});
System.register("messages/message-input.component", ["angular2/core", "messages/message", "messages/message.service"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_2, message_2, message_service_1;
    var MessageInputComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (message_2_1) {
                message_2 = message_2_1;
            },
            function (message_service_1_1) {
                message_service_1 = message_service_1_1;
            }],
        execute: function() {
            MessageInputComponent = (function () {
                function MessageInputComponent(_messageService) {
                    this._messageService = _messageService;
                    this.message = null;
                }
                MessageInputComponent.prototype.onSubmit = function (form) {
                    var _this = this;
                    if (this.message) {
                        // Edit
                        this.message.content = form.content;
                        this._messageService.updateMessage(this.message)
                            .subscribe(function (data) { return console.log(data); }, function (error) { return console.error(error); });
                        this.message = null;
                    }
                    else {
                        var message = new message_2.Message(form.content, null, 'Dummy');
                        console.log("Message is--: ", message);
                        this._messageService.addMessage(message)
                            .subscribe(function (data) {
                            console.log(data);
                            _this._messageService.messages.push(data);
                        }, function (error) { return console.error(error); });
                    }
                };
                MessageInputComponent.prototype.onCancel = function () {
                    this.message = null;
                };
                MessageInputComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._messageService.messageIsEdit.subscribe(function (message) {
                        _this.message = message;
                    });
                };
                MessageInputComponent = __decorate([
                    core_2.Component({
                        selector: 'my-message-input',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form (ngSubmit)=\"onSubmit(f.value)\" #f=\"ngForm\">\n                <div class=\"form-group\">\n                    <label for=\"content\">Content</label>\n                    <input ngControl=\"content\" type=\"text\" class=\"form-control\" id=\"content\" #input [ngModel]=\"message?.content\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\">{{ !message ? 'Send Message' : 'Save Message' }}</button>\n                <button type=\"button\" class=\"btn btn-danger\" (click)=\"onCancel()\" *ngIf=\"message\">Cancel</button>\n            </form>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [message_service_1.MessageService])
                ], MessageInputComponent);
                return MessageInputComponent;
            }());
            exports_3("MessageInputComponent", MessageInputComponent);
        }
    }
});
System.register("messages/message.component", ["angular2/core", "messages/message", "messages/message.service"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_3, message_3, message_service_2;
    var MessageComponent;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (message_3_1) {
                message_3 = message_3_1;
            },
            function (message_service_2_1) {
                message_service_2 = message_service_2_1;
            }],
        execute: function() {
            MessageComponent = (function () {
                function MessageComponent(_messageService) {
                    this._messageService = _messageService;
                    this.editClicked = new core_3.EventEmitter();
                }
                MessageComponent.prototype.onEdit = function () {
                    this._messageService.editMessage(this.message);
                };
                MessageComponent.prototype.onDelete = function () {
                    this._messageService.deleteMessage(this.message)
                        .subscribe(function (data) { return console.log(data); }, function (error) { return console.error(error); });
                };
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', message_3.Message)
                ], MessageComponent.prototype, "message", void 0);
                __decorate([
                    core_3.Output(), 
                    __metadata('design:type', Object)
                ], MessageComponent.prototype, "editClicked", void 0);
                MessageComponent = __decorate([
                    core_3.Component({
                        selector: 'my-message',
                        template: "\n        <article class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                {{ message.content }}\n            </div>\n            <footer class=\"panel-footer\">\n                <div class=\"author\">\n                    {{ message.username }}\n                </div>\n                <div class=\"config\">\n                    <a (click)=\"onEdit()\">Edit</a>\n                    <a (click)=\"onDelete()\">Delete</a>\n                </div>\n            </footer>\n        </article>\n    ",
                        styles: ["\n        .author {\n            display: inline-block;\n            font-style: italic;\n            font-size: 12px;\n            width: 80%;\n        }\n        .config {\n            display: inline-block;\n            text-align: right;\n            font-size: 12px;\n            width: 19%;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [message_service_2.MessageService])
                ], MessageComponent);
                return MessageComponent;
            }());
            exports_4("MessageComponent", MessageComponent);
        }
    }
});
System.register("messages/message-list.component", ["angular2/core", "messages/message.component", "messages/message.service"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_4, message_component_1, message_service_3;
    var MessageListComponent;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (message_component_1_1) {
                message_component_1 = message_component_1_1;
            },
            function (message_service_3_1) {
                message_service_3 = message_service_3_1;
            }],
        execute: function() {
            MessageListComponent = (function () {
                function MessageListComponent(_messageService) {
                    this._messageService = _messageService;
                }
                MessageListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._messageService.getMessages()
                        .subscribe(function (messages) {
                        _this.messages = messages;
                        _this._messageService.messages = messages;
                    }, function (error) { return console.error(error); });
                };
                MessageListComponent = __decorate([
                    core_4.Component({
                        selector: 'my-message-list',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <my-message *ngFor=\"#message of messages\" [message]=\"message\" (editClicked)=\"message.content = $event\"></my-message>     \n        </section>\n    ",
                        directives: [message_component_1.MessageComponent]
                    }), 
                    __metadata('design:paramtypes', [message_service_3.MessageService])
                ], MessageListComponent);
                return MessageListComponent;
            }());
            exports_5("MessageListComponent", MessageListComponent);
        }
    }
});
System.register("messages/messages.component", ["angular2/core", "messages/message-input.component", "messages/message-list.component"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_5, message_input_component_1, message_list_component_1;
    var MessagesComponent;
    return {
        setters:[
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (message_input_component_1_1) {
                message_input_component_1 = message_input_component_1_1;
            },
            function (message_list_component_1_1) {
                message_list_component_1 = message_list_component_1_1;
            }],
        execute: function() {
            MessagesComponent = (function () {
                function MessagesComponent() {
                }
                MessagesComponent = __decorate([
                    core_5.Component({
                        selector: 'my-messages',
                        template: "\n        <div class=\"row spacing\">\n            <my-message-input></my-message-input>\n        </div>\n        <div class=\"row spacing\">\n            <my-message-list></my-message-list>\n        </div> \n    ",
                        directives: [message_list_component_1.MessageListComponent, message_input_component_1.MessageInputComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], MessagesComponent);
                return MessagesComponent;
            }());
            exports_6("MessagesComponent", MessagesComponent);
        }
    }
});
System.register("header.component", ["angular2/core", "angular2/router"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_6, router_1;
    var HeaderComponent;
    return {
        setters:[
            function (core_6_1) {
                core_6 = core_6_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            HeaderComponent = (function () {
                function HeaderComponent() {
                }
                HeaderComponent = __decorate([
                    core_6.Component({
                        selector: 'my-header',
                        template: "\n        <header class=\"row\">\n            <nav class=\"col-md-8 col-md-offset-2\">\n                <ul class=\"nav nav-pills\">\n                    <li><a [routerLink]=\"['Messages']\">Messages</a></li>\n                    <li><a [routerLink]=\"['Auth']\">Authentication</a></li>\n                    <li><a [routerLink]=\"['Search']\">Search</a></li>\n                    <li><a [routerLink]=\"['Worklist']\">Worklist</a></li>\n                    <li><a [routerLink]=\"['Cart']\">Cart</a></li>\n                    <li><a [routerLink]=\"['Change']\">Change</a></li>\n                </ul>\n            </nav>\n        </header>\n    ",
                        directives: [router_1.ROUTER_DIRECTIVES],
                        styles: ["\n        header {\n            margin-bottom: 20px;\n        }\n    \n        ul {\n          text-align: center;  \n        }\n        \n        li {\n            float: none;\n            display: inline-block;\n        }\n        \n        .router-link-active, .nav>li>a:focus {\n            background: #337ab7;\n            color: white;\n        }\n        \n       \n    "]
                    }), 
                    __metadata('design:paramtypes', [])
                ], HeaderComponent);
                return HeaderComponent;
            }());
            exports_7("HeaderComponent", HeaderComponent);
        }
    }
});
System.register("auth/user", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var User;
    return {
        setters:[],
        execute: function() {
            User = (function () {
                function User(email, password, firstName, lastName) {
                    this.email = email;
                    this.password = password;
                    this.firstName = firstName;
                    this.lastName = lastName;
                    this.email = email;
                    this.password = password;
                    this.firstName = firstName;
                    this.lastName = lastName;
                }
                return User;
            }());
            exports_8("User", User);
        }
    }
});
System.register("auth/auth.service", ["angular2/http", "angular2/core", 'rxjs/Rx', "rxjs/Observable"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var http_2, core_7, Observable_2;
    var AuthService;
    return {
        setters:[
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (_1) {},
            function (Observable_2_1) {
                Observable_2 = Observable_2_1;
            }],
        execute: function() {
            AuthService = (function () {
                function AuthService(_http) {
                    this._http = _http;
                }
                AuthService.prototype.signup = function (user) {
                    var body = JSON.stringify(user);
                    console.log("User is: ", user);
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    return this._http.post('http://localhost:3000/user', body, { headers: headers })
                        .map(function (response) {
                        var data = response.json().obj;
                        //let message = new Message(data.content, data._id, 'Dummy', null);
                        return data;
                    })
                        .catch(function (error) { return Observable_2.Observable.throw(error.json()); });
                };
                AuthService.prototype.signin = function (user) {
                    var body = JSON.stringify(user);
                    console.log("User is: ", user);
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    return this._http.post('http://localhost:3000/user/signin', body, { headers: headers })
                        .map(function (response) {
                        var data = response.json();
                        //let message = new Message(data.content, data._id, 'Dummy', null);
                        return data;
                    })
                        .catch(function (error) { return Observable_2.Observable.throw(error.json()); });
                };
                AuthService.prototype.logout = function () {
                    localStorage.clear();
                };
                AuthService.prototype.isLoggendIn = function () {
                    return localStorage['token'] != null;
                };
                AuthService = __decorate([
                    core_7.Injectable(), 
                    __metadata('design:paramtypes', [http_2.Http])
                ], AuthService);
                return AuthService;
            }());
            exports_9("AuthService", AuthService);
        }
    }
});
System.register("auth/signup.component", ['angular2/core', 'angular2/common', "auth/auth.service", "auth/user"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var core_8, common_1, auth_service_1, user_1;
    var SignupComponent;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            SignupComponent = (function () {
                function SignupComponent(_fb, _authService) {
                    this._fb = _fb;
                    this._authService = _authService;
                }
                SignupComponent.prototype.ngOnInit = function () {
                    this.myForm = this._fb.group({
                        firstName: ['', common_1.Validators.required],
                        lastName: ['', common_1.Validators.required],
                        email: ['', common_1.Validators.compose([
                                common_1.Validators.required,
                                this.isEmail
                            ])],
                        password: ['', common_1.Validators.required]
                    });
                };
                SignupComponent.prototype.onSubmit = function () {
                    var user = new user_1.User(this.myForm.value.email, this.myForm.value.password, this.myForm.value.firstName, this.myForm.value.lastName);
                    console.log("User is--: ", user);
                    this._authService.signup(user)
                        .subscribe(function (data) {
                        console.log(data);
                        //this._messageService.messages.push(data);
                    }, function (error) { return console.error(error); });
                };
                SignupComponent.prototype.isEmail = function (control) {
                    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
                        return { 'invalidMail': true };
                    }
                };
                ;
                SignupComponent = __decorate([
                    core_8.Component({
                        selector: 'my-signup',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form [ngFormModel]=\"myForm\" (ngSubmit)=\"onSubmit()\">\n                <div class=\"form-group\">\n                    <lable for=\"firstName\">First Name</lable>\n                        <input [ngFormControl]=\"myForm.find('firstName')\" type=\"text\" id=\"firstName\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"lastName\">Last Name</lable>\n                        <input [ngFormControl]=\"myForm.find('lastName')\" type=\"text\" id=\"lastName\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"email\">Mail</lable>\n                        <input [ngFormControl]=\"myForm.find('email')\" type=\"email\" id=\"email\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"password\">Password</lable>\n                        <input [ngFormControl]=\"myForm.find('password')\" type=\"password\" id=\"password\" class=\"form-control\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!myForm.valid\">Sign Up</button>\n        </form>\n    </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, auth_service_1.AuthService])
                ], SignupComponent);
                return SignupComponent;
            }());
            exports_10("SignupComponent", SignupComponent);
        }
    }
});
System.register("auth/signin.component", ['angular2/core', "auth/auth.service", "auth/user", 'angular2/router'], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_9, auth_service_2, user_2, router_2;
    var SigninComponent;
    return {
        setters:[
            function (core_9_1) {
                core_9 = core_9_1;
            },
            function (auth_service_2_1) {
                auth_service_2 = auth_service_2_1;
            },
            function (user_2_1) {
                user_2 = user_2_1;
            },
            function (router_2_1) {
                router_2 = router_2_1;
            }],
        execute: function() {
            SigninComponent = (function () {
                function SigninComponent(_authService, _router) {
                    this._authService = _authService;
                    this._router = _router;
                }
                SigninComponent.prototype.onSubmit = function (myForm) {
                    var _this = this;
                    var user = new user_2.User(myForm.email, myForm.password);
                    this._authService.signin(user)
                        .subscribe(function (data) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userId', data.userId);
                        _this._router.navigateByUrl('/');
                    }, function (error) { return console.error(error); });
                };
                SigninComponent = __decorate([
                    core_9.Component({
                        selector: 'my-signin',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form  (ngSubmit)=\"onSubmit(f.value)\" #f=\"ngForm\">\n                \n                <div class=\"form-group\">\n                    <lable for=\"email\">Mail</lable>\n                        <input ngControl=\"email\" type=\"email\" id=\"email\" class=\"form-control\" required>\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"password\">Password</lable>\n                        <input ngControl=\"password\" type=\"password\" id=\"password\" class=\"form-control\" required>\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!f.valid\">Sign In</button>\n        </form>\n    </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [auth_service_2.AuthService, router_2.Router])
                ], SigninComponent);
                return SigninComponent;
            }());
            exports_11("SigninComponent", SigninComponent);
        }
    }
});
System.register("auth/logout.component", ['angular2/core', "auth/auth.service", 'angular2/router'], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_10, auth_service_3, router_3;
    var LogoutComponent;
    return {
        setters:[
            function (core_10_1) {
                core_10 = core_10_1;
            },
            function (auth_service_3_1) {
                auth_service_3 = auth_service_3_1;
            },
            function (router_3_1) {
                router_3 = router_3_1;
            }],
        execute: function() {
            LogoutComponent = (function () {
                function LogoutComponent(_authService, _router) {
                    this._authService = _authService;
                    this._router = _router;
                }
                LogoutComponent.prototype.onLogout = function () {
                    this._authService.logout();
                    this._router.navigate(['Signin']);
                };
                LogoutComponent = __decorate([
                    core_10.Component({
                        selector: 'my-logout',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <button class=\"btn btn-danger\" (click)=\"onLogout()\">Logout</button>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [auth_service_3.AuthService, router_3.Router])
                ], LogoutComponent);
                return LogoutComponent;
            }());
            exports_12("LogoutComponent", LogoutComponent);
        }
    }
});
System.register("auth/authentication.component", ['angular2/core', "auth/signup.component", "auth/signin.component", "auth/auth.service", "auth/logout.component", 'angular2/router'], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var core_11, signup_component_1, signin_component_1, auth_service_4, logout_component_1, router_4;
    var AuthenticationComponent;
    return {
        setters:[
            function (core_11_1) {
                core_11 = core_11_1;
            },
            function (signup_component_1_1) {
                signup_component_1 = signup_component_1_1;
            },
            function (signin_component_1_1) {
                signin_component_1 = signin_component_1_1;
            },
            function (auth_service_4_1) {
                auth_service_4 = auth_service_4_1;
            },
            function (logout_component_1_1) {
                logout_component_1 = logout_component_1_1;
            },
            function (router_4_1) {
                router_4 = router_4_1;
            }],
        execute: function() {
            AuthenticationComponent = (function () {
                function AuthenticationComponent(_authService) {
                    this._authService = _authService;
                }
                AuthenticationComponent.prototype.isLoggedIn = function () {
                    return this._authService.isLoggendIn();
                };
                AuthenticationComponent = __decorate([
                    core_11.Component({
                        selector: 'my-auth',
                        template: "\n        <header class=\"row spacing\">\n            <nav class=\"col-md-8 col-md-offset-2\">\n                <ul class=\"nav nav-tabs\">\n                    <li><a [routerLink]=\"['Signup']\">Signup</a></li>\n                    <li><a [routerLink]=\"['Signin']\" *ngIf=\"! isLoggedIn()\">Signin</a></li>\n                    <li><a [routerLink]=\"['Logout']\" *ngIf=\"isLoggedIn()\">Logout</a></li>\n                </ul>\n            </nav>\n        </header>\n        <div class=\"row spacing\">\n            <router-outlet></router-outlet>\n        </div>\n    ",
                        directives: [signup_component_1.SignupComponent, signin_component_1.SigninComponent, logout_component_1.LogoutComponent, router_4.ROUTER_DIRECTIVES],
                        styles: ["\n         .router-link-active {\n            color: #555;\n            cursor: default;\n            background-color: #fff;\n            border: 1px solid #ddd;\n            border-bottom-color: transparent;\n        }\n    "]
                    }),
                    router_4.RouteConfig([
                        { path: '/signup', name: 'Signup', component: signup_component_1.SignupComponent, useAsDefault: true },
                        { path: '/signin', name: 'Signin', component: signin_component_1.SigninComponent },
                        { path: '/logout', name: 'Logout', component: logout_component_1.LogoutComponent }
                    ]), 
                    __metadata('design:paramtypes', [auth_service_4.AuthService])
                ], AuthenticationComponent);
                return AuthenticationComponent;
            }());
            exports_13("AuthenticationComponent", AuthenticationComponent);
        }
    }
});
System.register("search/search.results.component", ['angular2/common', 'angular2/core', "rxjs/Observable"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var common_2, core_12, Observable_3;
    var SearchResultsComponent;
    return {
        setters:[
            function (common_2_1) {
                common_2 = common_2_1;
            },
            function (core_12_1) {
                core_12 = core_12_1;
            },
            function (Observable_3_1) {
                Observable_3 = Observable_3_1;
            }],
        execute: function() {
            SearchResultsComponent = (function () {
                function SearchResultsComponent() {
                    var _this = this;
                    this.searchEvent = new core_12.EventEmitter();
                    this.searchCount = 0;
                    //
                    this.source = new Observable_3.Observable(function (observer) {
                        var socket = new WebSocket('ws://localhost:8080');
                        socket.onmessage = function (event) {
                            observer.next(event);
                        };
                        socket.onclose = function (event) {
                            alert('Server closed the connection........');
                        };
                        return function () { return socket.close(); };
                    })
                        .retryWhen(function (errors) { return errors.switchMap(function (err) {
                        return navigator.onLine ? Observable_3.Observable.timer(3000) :
                            Observable_3.Observable.fromEvent(window, 'online').take(1);
                    }); });
                    this.searchBox = new common_2.Control();
                    this.hot = this.source.share();
                    this.searchBox
                        .valueChanges
                        .debounceTime(200)
                        .subscribe(function (event) {
                        _this.searchEvent.emit(event);
                    });
                }
                SearchResultsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.counter.subscribe(function (data) { return _this.searchCount = data; });
                    // first connection
                    var sub1 = this.hot.subscribe(function (e) { return console.log('s1', e); });
                    var sub2;
                    // second connection one second later
                    setTimeout(function () {
                        console.log('using hot observable...');
                        sub2 = _this.hot.subscribe(function (e) { return console.log('s2', e); });
                    }, 1000);
                    // since we're pumping all of the values through a Subject, which 
                    // mutlicasts to all subscribers, we've made our source "hot".
                    // After a while, we'll unsubscribe from both,
                    // and now our socket will disconnect.
                    setTimeout(function () {
                        sub1.unsubscribe();
                        sub2.unsubscribe();
                    }, 4000);
                    setTimeout(function () {
                        // reusing the hot observable
                        console.log('reusing hot observable...');
                        _this.hot.subscribe(function (e) { return console.log('s3', e); });
                    }, 4500);
                };
                __decorate([
                    core_12.Input(), 
                    __metadata('design:type', Observable_3.Observable)
                ], SearchResultsComponent.prototype, "results", void 0);
                __decorate([
                    core_12.Input(), 
                    __metadata('design:type', Observable_3.Observable)
                ], SearchResultsComponent.prototype, "counter", void 0);
                __decorate([
                    core_12.Output(), 
                    __metadata('design:type', core_12.EventEmitter)
                ], SearchResultsComponent.prototype, "searchEvent", void 0);
                SearchResultsComponent = __decorate([
                    core_12.Component({
                        selector: 'my-search',
                        directives: [common_2.FORM_DIRECTIVES],
                        template: "\n    <h1>Search</h1>\n    <input class=\"form-control\"\n      [ngFormControl]=\"searchBox\" \n      placeholder=\"Search artist\" />\n      <h3>Searched: {{searchCount}} times</h3>\n      \n    <div *ngFor=\"#books of results | async\">\n      <section class=\"panel panel-default\">\n        <div class=\"panel-body\">\n          <div class=\"col col-md-6\">{{ books.volumeInfo.title }}</div>\n          <div class=\"col col-md-4\">{{ books.volumeInfo.publisher }}</div>\n        </div>\n      </section>\n      \n    </div>\n  "
                    }), 
                    __metadata('design:paramtypes', [])
                ], SearchResultsComponent);
                return SearchResultsComponent;
            }());
            exports_14("SearchResultsComponent", SearchResultsComponent);
        }
    }
});
System.register("search/search.component", ['angular2/http', 'angular2/core', 'rxjs/Rx', 'rxjs/Observable', "search/search.results.component"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var http_3, core_13, Observable_4, search_results_component_1;
    var SearchComponent;
    return {
        setters:[
            function (http_3_1) {
                http_3 = http_3_1;
            },
            function (core_13_1) {
                core_13 = core_13_1;
            },
            function (_2) {},
            function (Observable_4_1) {
                Observable_4 = Observable_4_1;
            },
            function (search_results_component_1_1) {
                search_results_component_1 = search_results_component_1_1;
            }],
        execute: function() {
            SearchComponent = (function () {
                function SearchComponent(http) {
                    var _this = this;
                    this.http = http;
                    this.cnt = 0;
                    this.data = new Observable_4.Observable(function (observer) { return _this.dataObserver = observer; });
                    this.counter = new Observable_4.Observable(function (observer) { return _this.counterObserver = observer; });
                }
                SearchComponent.prototype.onSearch = function (event) {
                    var _this = this;
                    return this.http.get('https://www.googleapis.com/books/v1/volumes?q=' + event).map(function (response) {
                        var books = response.json();
                        return books.items;
                    }).subscribe(function (result) {
                        _this.dataObserver.next(result);
                        _this.counterObserver.next(++_this.cnt);
                        console.log("Counter in service: ", _this.cnt);
                    }, function (error) { return console.log('Could not load artists'); });
                };
                SearchComponent = __decorate([
                    core_13.Component({
                        selector: 'app-root',
                        directives: [search_results_component_1.SearchResultsComponent],
                        template: "\n\t\t<my-search (searchEvent)=\"onSearch($event)\" [results]=\"data\" [counter]=\"counter\"></my-search>\n\t\t\n\t"
                    }), 
                    __metadata('design:paramtypes', [http_3.Http])
                ], SearchComponent);
                return SearchComponent;
            }());
            exports_15("SearchComponent", SearchComponent);
        }
    }
});
System.register("worklist/activity", [], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var Activity;
    return {
        setters:[],
        execute: function() {
            Activity = (function () {
                function Activity(value, priority, createdAt) {
                    this.value = value;
                    this.createdAt = createdAt || new Date();
                    this.priority = priority || 5;
                }
                return Activity;
            }());
            exports_16("Activity", Activity);
        }
    }
});
System.register("worklist/worklist.service", ['angular2/core', 'angular2/http', 'rxjs/Subject'], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var core_14, http_4, Subject_1;
    var ActivityService;
    return {
        setters:[
            function (core_14_1) {
                core_14 = core_14_1;
            },
            function (http_4_1) {
                http_4 = http_4_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }],
        execute: function() {
            ActivityService = (function () {
                function ActivityService(http) {
                    this.http = http;
                    this.baseUrl = 'http://localhost:3000';
                    this.dataStore = { Activities: [] };
                    this._Activities$ = new Subject_1.Subject();
                }
                Object.defineProperty(ActivityService.prototype, "Activities$", {
                    get: function () {
                        return this._Activities$.asObservable();
                    },
                    enumerable: true,
                    configurable: true
                });
                ActivityService.prototype.loadAll = function () {
                    var _this = this;
                    this.http.get(this.baseUrl + "/activities").map(function (response) { return response.json(); })
                        .subscribe(function (data) {
                        _this.dataStore.Activities = data.obj;
                        _this._Activities$.next(_this.dataStore.Activities);
                    }, function (error) { return console.log('Could not load Activities.'); });
                };
                ActivityService.prototype.create = function (activity) {
                    var _this = this;
                    console.log("Activity to save at UI: ", activity);
                    var headers = new http_4.Headers({ 'Content-Type': 'application/json' });
                    var body = JSON.stringify(activity);
                    return this.http.post(this.baseUrl + "/activities", body, { headers: headers })
                        .map(function (response) { return response.json(); }).subscribe(function (data) {
                        _this.dataStore.Activities.push(data.obj);
                        _this._Activities$.next(_this.dataStore.Activities);
                    }, function (error) { return console.log('Could not create Activity.'); });
                };
                ActivityService = __decorate([
                    core_14.Injectable(), 
                    __metadata('design:paramtypes', [http_4.Http])
                ], ActivityService);
                return ActivityService;
            }());
            exports_17("ActivityService", ActivityService);
        }
    }
});
/*
/*load(id: any) {
  this.http.get(`${this.baseUrl}/activities/${id}`).map(response => response.json()).subscribe(data => {
    let notFound = true;

    this.dataStore.Activities.forEach((item, index) => {
      if (item.id === data.id) {
        this.dataStore.Activities[index] = data;
        notFound = false;
      }
    });

    if (notFound) {
      this.dataStore.Activities.push(data);
    }

    this._Activities$.next(this.dataStore.Activities);
  }, error => console.log('Could not load Activity.'));
}
update(Activity: Activity) {
  this.http.put(`${this.baseUrl}/activities/${Activity.id}`, JSON.stringify(Activity))
    .map(response => response.json()).subscribe(data => {
      this.dataStore.Activities.forEach((Activity, i) => {
        if (Activity._id === data._id) { this.dataStore.Activities[i] = data; }
      });

      this._Activities$.next(this.dataStore.Activities);
    }, error => console.log('Could not update Activity.'));
}

remove(ActivityId: number) {
  this.http.delete(`${this.baseUrl}/Activities/${ActivityId}`).subscribe(response => {
    this.dataStore.Activities.forEach((t, i) => {
      if (t.id === ActivityId) { this.dataStore.Activities.splice(i, 1); }
    });

    this._Activities$.next(this.dataStore.Activities);
  }, error => console.log('Could not delete Activity.'));
}*/
System.register("worklist/another.worklist.component", ['angular2/core', "worklist/worklist.service", 'rxjs/Rx'], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var core_15, worklist_service_1;
    var AnotherWorklistComponent;
    return {
        setters:[
            function (core_15_1) {
                core_15 = core_15_1;
            },
            function (worklist_service_1_1) {
                worklist_service_1 = worklist_service_1_1;
            },
            function (_3) {}],
        execute: function() {
            AnotherWorklistComponent = (function () {
                function AnotherWorklistComponent(_activityService) {
                    this._activityService = _activityService;
                    this.height = 230;
                }
                AnotherWorklistComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.anotherActivities$ = this._activityService.Activities$
                        .map(function (todos) { return todos.filter(function (item) { return item.priority > 5; }); }); // subscribe to entire collection
                    this._activityService.loadAll(); // load all todos
                    this.anotherActivities$.subscribe(function (data) { return _this.normalPrioQueue = data.length; });
                };
                AnotherWorklistComponent = __decorate([
                    core_15.Component({
                        selector: 'another-my-worklist',
                        template: "\n             <h4>Normal Priority Tasks - {{normalPrioQueue}}</h4>\n             <article class=\"panel panel-default  activity-box\">\n                <div class=\"panel-body normal-priority\"  *ngFor=\"#activity of anotherActivities$ | async\" >\n                {{activity.value}}\n                </div>\n             </article>\n                \n    "
                    }), 
                    __metadata('design:paramtypes', [worklist_service_1.ActivityService])
                ], AnotherWorklistComponent);
                return AnotherWorklistComponent;
            }());
            exports_18("AnotherWorklistComponent", AnotherWorklistComponent);
        }
    }
});
System.register("worklist/worklist.add.component", ['angular2/core', "worklist/worklist.service", "worklist/activity"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var core_16, worklist_service_2, activity_1;
    var WorklistAddComponent;
    return {
        setters:[
            function (core_16_1) {
                core_16 = core_16_1;
            },
            function (worklist_service_2_1) {
                worklist_service_2 = worklist_service_2_1;
            },
            function (activity_1_1) {
                activity_1 = activity_1_1;
            }],
        execute: function() {
            WorklistAddComponent = (function () {
                function WorklistAddComponent(_activityService) {
                    this._activityService = _activityService;
                }
                WorklistAddComponent.prototype.onSubmit = function (form) {
                    var activity = new activity_1.Activity(form.value, form.priority);
                    this._activityService.create(activity);
                };
                WorklistAddComponent = __decorate([
                    core_16.Component({
                        selector: 'my-worklist-add',
                        template: "\n       \n            <form (ngSubmit)=\"onSubmit(f.value)\" #f=\"ngForm\">\n                    <div class=\"form-group\">\n                        <label for=\"value\">Activity</label>\n                        <input ngControl=\"value\" type=\"text\" class=\"form-control\" id=\"value\">\n                        <label for=\"priority\">Priority</label>\n                        <input ngControl=\"priority\" type=\"number\" class=\"form-control\" id=\"priority\">\n                    </div>\n                    <button type=\"submit\" class=\"btn btn-primary spacing\">Add Activity</button>\n                    \n                </form>\n           \n    "
                    }), 
                    __metadata('design:paramtypes', [worklist_service_2.ActivityService])
                ], WorklistAddComponent);
                return WorklistAddComponent;
            }());
            exports_19("WorklistAddComponent", WorklistAddComponent);
        }
    }
});
System.register("worklist/worklist.component", ['angular2/core', "worklist/worklist.service", "worklist/activity", 'rxjs/Rx', "worklist/another.worklist.component", "worklist/worklist.add.component"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var core_17, worklist_service_3, activity_2, another_worklist_component_1, worklist_add_component_1;
    var WorklistComponent;
    return {
        setters:[
            function (core_17_1) {
                core_17 = core_17_1;
            },
            function (worklist_service_3_1) {
                worklist_service_3 = worklist_service_3_1;
            },
            function (activity_2_1) {
                activity_2 = activity_2_1;
            },
            function (_4) {},
            function (another_worklist_component_1_1) {
                another_worklist_component_1 = another_worklist_component_1_1;
            },
            function (worklist_add_component_1_1) {
                worklist_add_component_1 = worklist_add_component_1_1;
            }],
        execute: function() {
            WorklistComponent = (function () {
                function WorklistComponent(_activityService) {
                    this._activityService = _activityService;
                    this.height = 230;
                }
                WorklistComponent.prototype.onSubmit = function (form) {
                    var activity = new activity_2.Activity(form.value, form.priority);
                    this._activityService.create(activity);
                };
                WorklistComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.activities$ = this._activityService.Activities$
                        .map(function (todos) { return todos.filter(function (item) { return item.priority <= 5; }); }); // subscribe to entire collection
                    this._activityService.loadAll(); // load all todos
                    this.activities$.subscribe(function (data) { return _this.highPrioQueue = data.length; });
                };
                WorklistComponent = __decorate([
                    core_17.Component({
                        selector: 'my-worklist',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <my-worklist-add></my-worklist-add>\n            <div class=\"row\" >\n                <div class=\"col-md-4\">\n                    <h4>High Priority Tasks - {{highPrioQueue}}</h4>\n                        <article class=\"panel panel-default  activity-box\">\n                        \n                            <div class=\"panel-body high-priority\"  *ngFor=\"#activity of activities$ | async\" >\n                                {{activity.value}}</div>\n                        </article> \n                 </div>\n                 <div class=\"col-md-4 col-md-offset-4\">    \n                        <another-my-worklist></another-my-worklist>\n                 </div>\n                \n           </div>\n            </section>\n    ",
                        directives: [another_worklist_component_1.AnotherWorklistComponent, worklist_add_component_1.WorklistAddComponent]
                    }), 
                    __metadata('design:paramtypes', [worklist_service_3.ActivityService])
                ], WorklistComponent);
                return WorklistComponent;
            }());
            exports_20("WorklistComponent", WorklistComponent);
        }
    }
});
System.register("cartbadge/master.comment", [], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var MasterComponent;
    return {
        setters:[],
        execute: function() {
            MasterComponent = (function () {
                function MasterComponent() {
                }
                MasterComponent.prototype.updateMe = function () {
                };
                MasterComponent.prototype.lastUpdated = function () {
                    return Date().toString();
                };
                return MasterComponent;
            }());
            exports_21("MasterComponent", MasterComponent);
        }
    }
});
System.register("cartbadge/cart.badge.component", ['angular2/core', "rxjs/Observable", "cartbadge/master.comment"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var core_18, Observable_5, master_comment_1;
    var CartBadgeComponent;
    return {
        setters:[
            function (core_18_1) {
                core_18 = core_18_1;
            },
            function (Observable_5_1) {
                Observable_5 = Observable_5_1;
            },
            function (master_comment_1_1) {
                master_comment_1 = master_comment_1_1;
            }],
        execute: function() {
            CartBadgeComponent = (function (_super) {
                __extends(CartBadgeComponent, _super);
                function CartBadgeComponent(cd) {
                    var _this = this;
                    _super.call(this);
                    this.cd = cd;
                    this.counter = 0;
                    this.message = 'Using ChangeDetectionStrategy.onPush, i decide when to update myself, currently at an interval of 5 secs';
                    setInterval(function () {
                        _this.cd.markForCheck();
                    }, 5000);
                }
                ;
                //private cnt: number = 0;
                CartBadgeComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.itemAddStream.subscribe(function () {
                        _this.counter++; // application state changed
                        console.log("Item is Cart: ", _this.counter);
                    });
                };
                __decorate([
                    core_18.Input(), 
                    __metadata('design:type', Observable_5.Observable)
                ], CartBadgeComponent.prototype, "itemAddStream", void 0);
                CartBadgeComponent = __decorate([
                    core_18.Component({
                        selector: 'my-cart-badge',
                        template: "\n  <div style=\"border: 1px solid black;padding: 5px;\">\n        <div class=\"alert alert-info\">\n            {{message}}\n        </div>\n        <div><strong>{{lastUpdated()}}</strong></div>\n        <h3>The Cart Badge</h3>\n        <h4>Items in your cart : {{counter}}</h4>\n    \n    </div>\n     \n  ",
                        changeDetection: core_18.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [core_18.ChangeDetectorRef])
                ], CartBadgeComponent);
                return CartBadgeComponent;
            }(master_comment_1.MasterComponent));
            exports_22("CartBadgeComponent", CartBadgeComponent);
        }
    }
});
System.register("cartbadge/child.component.section", ['angular2/core', "cartbadge/master.comment"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var core_19, master_comment_2;
    var ChildComponentSection1, ChildComponentSection2;
    return {
        setters:[
            function (core_19_1) {
                core_19 = core_19_1;
            },
            function (master_comment_2_1) {
                master_comment_2 = master_comment_2_1;
            }],
        execute: function() {
            ChildComponentSection1 = (function (_super) {
                __extends(ChildComponentSection1, _super);
                function ChildComponentSection1() {
                    _super.call(this);
                    this.message = 'Using ChangeDetectionStrategy.OnPush, only update myself for changes initiated from within me. I am aloof to the change detection cycle initiated by any other component.';
                }
                ChildComponentSection1 = __decorate([
                    core_19.Component({
                        moduleId: __moduleName,
                        templateUrl: 'child.component.html',
                        selector: 'child-section-1',
                        changeDetection: core_19.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [])
                ], ChildComponentSection1);
                return ChildComponentSection1;
            }(master_comment_2.MasterComponent));
            exports_23("ChildComponentSection1", ChildComponentSection1);
            ChildComponentSection2 = (function (_super) {
                __extends(ChildComponentSection2, _super);
                function ChildComponentSection2() {
                    _super.call(this);
                    this.message = 'Using ChangeDetectionStrategy.Default, getting update for any change to any component on the page, i participate in each change detection cycle regardless of who initiated it.';
                }
                ChildComponentSection2 = __decorate([
                    core_19.Component({
                        moduleId: __moduleName,
                        templateUrl: 'child.component.html',
                        selector: 'child-section-2',
                        changeDetection: core_19.ChangeDetectionStrategy.Default
                    }), 
                    __metadata('design:paramtypes', [])
                ], ChildComponentSection2);
                return ChildComponentSection2;
            }(master_comment_2.MasterComponent));
            exports_23("ChildComponentSection2", ChildComponentSection2);
        }
    }
});
System.register("cartbadge/cart.component", ['angular2/core', "rxjs/Observable", "cartbadge/cart.badge.component", "cartbadge/child.component.section"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var core_20, Observable_6, cart_badge_component_1, child_component_section_1;
    var CartComponent;
    return {
        setters:[
            function (core_20_1) {
                core_20 = core_20_1;
            },
            function (Observable_6_1) {
                Observable_6 = Observable_6_1;
            },
            function (cart_badge_component_1_1) {
                cart_badge_component_1 = cart_badge_component_1_1;
            },
            function (child_component_section_1_1) {
                child_component_section_1 = child_component_section_1_1;
            }],
        execute: function() {
            CartComponent = (function () {
                function CartComponent() {
                    var _this = this;
                    this.counter = new Observable_6.Observable(function (observer) { return _this.counterObserver = observer; });
                }
                CartComponent.prototype.onAddToCart = function () {
                    this.counterObserver.next(1);
                };
                CartComponent = __decorate([
                    core_20.Component({
                        selector: 'my-cart',
                        template: "<div class=\"panel-body\">\n                <h3>Pick Items from here...</h3>\n                <button class=\"btn btn-primary\" (click)=\"onAddToCart()\">Add to Cart</button>\n              </div>\n            <my-cart-badge [itemAddStream]=\"counter\"></my-cart-badge>\n            <child-section-1></child-section-1>\n            <child-section-2></child-section-2>\n  ",
                        directives: [cart_badge_component_1.CartBadgeComponent, child_component_section_1.ChildComponentSection1, child_component_section_1.ChildComponentSection2],
                    }), 
                    __metadata('design:paramtypes', [])
                ], CartComponent);
                return CartComponent;
            }());
            exports_24("CartComponent", CartComponent);
        }
    }
});
System.register("changedetect/child.component", ['angular2/core'], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var core_21;
    var ChildComponent;
    return {
        setters:[
            function (core_21_1) {
                core_21 = core_21_1;
            }],
        execute: function() {
            ChildComponent = (function () {
                function ChildComponent(differs) {
                    this.differs = differs;
                    this.differ = differs.find({}).create(null);
                }
                ChildComponent.prototype.ngDoCheck = function () {
                    var changes = this.differ.diff(this.person);
                    if (changes) {
                        console.log('changes detected');
                        changes.forEachChangedItem(function (r) { return console.log('changed ', r.currentValue); });
                        changes.forEachAddedItem(function (r) { return console.log('added ' + r.currentValue); });
                        changes.forEachRemovedItem(function (r) { return console.log('removed ' + r.currentValue); });
                    }
                    else {
                        console.log('nothing changed');
                    }
                };
                __decorate([
                    core_21.Input(), 
                    __metadata('design:type', Object)
                ], ChildComponent.prototype, "person", void 0);
                ChildComponent = __decorate([
                    core_21.Component({
                        selector: 'my-child',
                        template: "\n\t\t<h2>Child component</h2>\n\t\t{{ person.name }}\n\t"
                    }), 
                    __metadata('design:paramtypes', [core_21.KeyValueDiffers])
                ], ChildComponent);
                return ChildComponent;
            }());
            exports_25("ChildComponent", ChildComponent);
        }
    }
});
System.register("changedetect/parent.component", ['angular2/core', "changedetect/child.component", "angular2/http"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var core_22, child_component_1, http_5;
    var ParentComponent;
    return {
        setters:[
            function (core_22_1) {
                core_22 = core_22_1;
            },
            function (child_component_1_1) {
                child_component_1 = child_component_1_1;
            },
            function (http_5_1) {
                http_5 = http_5_1;
            }],
        execute: function() {
            ParentComponent = (function () {
                function ParentComponent(http) {
                    var _this = this;
                    this.person = {
                        name: 'Juri'
                    };
                    this.activities = http.get('activities.json')
                        .map(function (response) { return response.json().activityItems; })
                        .share();
                    //.publishLast()
                    //.refCount();
                    setTimeout(function () { return _this.activities2 = _this.activities; }, 500);
                    //this.profession = 'Engineer';
                    //http://blog.thoughtram.io/angular/2016/06/16/cold-vs-hot-observables.html
                }
                ParentComponent.prototype.changePerson = function () {
                    this.person.name = "Thomas";
                };
                ParentComponent = __decorate([
                    core_22.Component({
                        selector: 'my-parent',
                        template: "\n        <button class=\"btn btn-primary\" (click)=\"changePerson()\">Change Person</button>\n\t\t<my-child [person]=\"person\"></my-child>\n       <h3>1st List</h3> \n        <ul>\n      <li *ngFor=\"#activity of activities | async\">{{activity.name}}</li>\n    </ul>\n    <h3>2nd List</h3>\n        <ul>\n      <li *ngFor=\"#activity of activities2 | async\">{{activity.name}}</li>\n    </ul>\n\t",
                        directives: [child_component_1.ChildComponent]
                    }), 
                    __metadata('design:paramtypes', [http_5.Http])
                ], ParentComponent);
                return ParentComponent;
            }());
            exports_26("ParentComponent", ParentComponent);
        }
    }
});
System.register("app.component", ['angular2/core', 'angular2/router', "messages/messages.component", "header.component", "auth/authentication.component", "search/search.component", "worklist/worklist.component", "cartbadge/cart.component", "changedetect/parent.component"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var core_23, router_5, messages_component_1, header_component_1, authentication_component_1, search_component_1, worklist_component_1, cart_component_1, parent_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_23_1) {
                core_23 = core_23_1;
            },
            function (router_5_1) {
                router_5 = router_5_1;
            },
            function (messages_component_1_1) {
                messages_component_1 = messages_component_1_1;
            },
            function (header_component_1_1) {
                header_component_1 = header_component_1_1;
            },
            function (authentication_component_1_1) {
                authentication_component_1 = authentication_component_1_1;
            },
            function (search_component_1_1) {
                search_component_1 = search_component_1_1;
            },
            function (worklist_component_1_1) {
                worklist_component_1 = worklist_component_1_1;
            },
            function (cart_component_1_1) {
                cart_component_1 = cart_component_1_1;
            },
            function (parent_component_1_1) {
                parent_component_1 = parent_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.message = "A message";
                }
                AppComponent = __decorate([
                    core_23.Component({
                        selector: 'my-app',
                        template: "  \n        <div class=\"container\">\n            <my-header></my-header>\n            <router-outlet></router-outlet>\n        </div>\n    ",
                        directives: [messages_component_1.MessagesComponent, router_5.ROUTER_DIRECTIVES, header_component_1.HeaderComponent]
                    }),
                    router_5.RouteConfig([
                        { path: '/', name: 'Messages', component: messages_component_1.MessagesComponent, useAsDefault: true },
                        { path: '/auth/...', name: 'Auth', component: authentication_component_1.AuthenticationComponent },
                        { path: '/search', name: 'Search', component: search_component_1.SearchComponent },
                        { path: '/activity', name: 'Worklist', component: worklist_component_1.WorklistComponent },
                        { path: '/cart', name: 'Cart', component: cart_component_1.CartComponent },
                        { path: '/change', name: 'Change', component: parent_component_1.ParentComponent }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_27("AppComponent", AppComponent);
        }
    }
});
System.register("boot", ['angular2/platform/browser', "app.component", "messages/message.service", "auth/auth.service", "worklist/worklist.service", "angular2/router", 'angular2/http', "angular2/core"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var browser_1, app_component_1, message_service_4, auth_service_5, worklist_service_4, router_6, http_6, core_24;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (message_service_4_1) {
                message_service_4 = message_service_4_1;
            },
            function (auth_service_5_1) {
                auth_service_5 = auth_service_5_1;
            },
            function (worklist_service_4_1) {
                worklist_service_4 = worklist_service_4_1;
            },
            function (router_6_1) {
                router_6 = router_6_1;
            },
            function (http_6_1) {
                http_6 = http_6_1;
            },
            function (core_24_1) {
                core_24 = core_24_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [worklist_service_4.ActivityService, auth_service_5.AuthService, message_service_4.MessageService, http_6.HTTP_PROVIDERS, router_6.ROUTER_PROVIDERS,
                core_24.provide(router_6.LocationStrategy, { useClass: router_6.HashLocationStrategy })]);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc3NhZ2VzL21lc3NhZ2UudHMiLCJtZXNzYWdlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJtZXNzYWdlcy9tZXNzYWdlLWlucHV0LmNvbXBvbmVudC50cyIsIm1lc3NhZ2VzL21lc3NhZ2UuY29tcG9uZW50LnRzIiwibWVzc2FnZXMvbWVzc2FnZS1saXN0LmNvbXBvbmVudC50cyIsIm1lc3NhZ2VzL21lc3NhZ2VzLmNvbXBvbmVudC50cyIsImhlYWRlci5jb21wb25lbnQudHMiLCJhdXRoL3VzZXIudHMiLCJhdXRoL2F1dGguc2VydmljZS50cyIsImF1dGgvc2lnbnVwLmNvbXBvbmVudC50cyIsImF1dGgvc2lnbmluLmNvbXBvbmVudC50cyIsImF1dGgvbG9nb3V0LmNvbXBvbmVudC50cyIsImF1dGgvYXV0aGVudGljYXRpb24uY29tcG9uZW50LnRzIiwic2VhcmNoL3NlYXJjaC5yZXN1bHRzLmNvbXBvbmVudC50cyIsInNlYXJjaC9zZWFyY2guY29tcG9uZW50LnRzIiwid29ya2xpc3QvYWN0aXZpdHkudHMiLCJ3b3JrbGlzdC93b3JrbGlzdC5zZXJ2aWNlLnRzIiwid29ya2xpc3QvYW5vdGhlci53b3JrbGlzdC5jb21wb25lbnQudHMiLCJ3b3JrbGlzdC93b3JrbGlzdC5hZGQuY29tcG9uZW50LnRzIiwid29ya2xpc3Qvd29ya2xpc3QuY29tcG9uZW50LnRzIiwiY2FydGJhZGdlL21hc3Rlci5jb21tZW50LnRzIiwiY2FydGJhZGdlL2NhcnQuYmFkZ2UuY29tcG9uZW50LnRzIiwiY2FydGJhZGdlL2NoaWxkLmNvbXBvbmVudC5zZWN0aW9uLnRzIiwiY2FydGJhZGdlL2NhcnQuY29tcG9uZW50LnRzIiwiY2hhbmdlZGV0ZWN0L2NoaWxkLmNvbXBvbmVudC50cyIsImNoYW5nZWRldGVjdC9wYXJlbnQuY29tcG9uZW50LnRzIiwiYXBwLmNvbXBvbmVudC50cyIsImJvb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q1QsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLHNDQUFpQixFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUM7d0JBQy9FLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxrREFBdUIsRUFBQzt3QkFDckUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLGtDQUFlLEVBQUM7d0JBQzdELEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxzQ0FBaUIsRUFBQzt3QkFDbkUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLDhCQUFhLEVBQUM7d0JBQ3ZELEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxrQ0FBZSxFQUFDO3FCQUNoRSxDQUFDOztnQ0FBQTtnQkFLRixtQkFBQztZQUFELENBSkEsQUFJQyxJQUFBO1lBSkQsd0NBSUMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUNyQkQsbUJBQVMsQ0FBQyw0QkFBWSxFQUFFLENBQUMsa0NBQWUsRUFBRSwwQkFBVyxFQUFFLGdDQUFjLEVBQUUscUJBQWMsRUFBRSx5QkFBZ0I7Z0JBQ3ZHLGVBQU8sQ0FBQyx5QkFBZ0IsRUFBRSxFQUFDLFFBQVEsRUFBRSw2QkFBb0IsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4uLy4uLy4uL2EyX05vZGVfTW9uZ28vYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIE1lc3NhZ2Uge1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICB1c2VybmFtZTogc3RyaW5nO1xuICAgIG1lc3NhZ2VJZDogc3RyaW5nO1xuICAgIHVzZXJJZDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IgKGNvbnRlbnQ6IHN0cmluZywgbWVzc2FnZUlkPzogc3RyaW5nLCB1c2VybmFtZT86IHN0cmluZywgdXNlcklkPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgIHRoaXMubWVzc2FnZUlkID0gbWVzc2FnZUlkO1xuICAgICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgICAgIHRoaXMudXNlcklkID0gdXNlcklkO1xuICAgIH1cbn0iLCJpbXBvcnQge01lc3NhZ2V9IGZyb20gXCIuL21lc3NhZ2VcIjtcbmltcG9ydCB7SHR0cCwgSGVhZGVyc30gZnJvbSBcImFuZ3VsYXIyL2h0dHBcIjtcbmltcG9ydCB7SW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyfSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuLy9pbXBvcnQge1J4fSBmcm9tICdyeGpzL1J4JztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiO1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcbiAgICBtZXNzYWdlczogTWVzc2FnZVtdID0gW107XG4gICAgbWVzc2FnZUlzRWRpdCA9IG5ldyBFdmVudEVtaXR0ZXI8TWVzc2FnZT4oKTtcbiAgICBcbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBfaHR0cDogSHR0cCkge31cblxuICAgIGFkZE1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTWVzc2FnZSBpczogXCIsIG1lc3NhZ2UpO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL21lc3NhZ2UnLCBib2R5LCB7aGVhZGVyczogaGVhZGVyc30pXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuanNvbigpLm9iajtcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKGRhdGEuY29udGVudCwgZGF0YS5faWQsICdEdW1teScsIG51bGwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuICAgIH1cblxuICAgIGdldE1lc3NhZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9tZXNzYWdlJylcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXNwb25zZS5qc29uKCkub2JqO1xuICAgICAgICAgICAgICAgIGxldCBvYmpzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKGRhdGFbaV0uY29udGVudCwgZGF0YVtpXS5faWQsICdEdW1teScsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBvYmpzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpzO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuICAgIH1cblxuICAgIHVwZGF0ZU1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wYXRjaCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL21lc3NhZ2UvJyArIG1lc3NhZ2UubWVzc2FnZUlkLCBib2R5LCB7aGVhZGVyczogaGVhZGVyc30pXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuICAgIH1cblxuICAgIGVkaXRNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlSXNFZGl0LmVtaXQobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgZGVsZXRlTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMuc3BsaWNlKHRoaXMubWVzc2FnZXMuaW5kZXhPZihtZXNzYWdlKSwgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLmRlbGV0ZSgnaHR0cDovL2xvY2FsaG9zdDozMDAwL21lc3NhZ2UvJyArIG1lc3NhZ2UubWVzc2FnZUlkKVxuICAgICAgICAgICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvci5qc29uKCkpKTtcbiAgICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSBcIi4vbWVzc2FnZVwiO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSBcIi4vbWVzc2FnZS5zZXJ2aWNlXCI7XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ215LW1lc3NhZ2UtaW5wdXQnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC0yXCI+XG4gICAgICAgICAgICA8Zm9ybSAobmdTdWJtaXQpPVwib25TdWJtaXQoZi52YWx1ZSlcIiAjZj1cIm5nRm9ybVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb250ZW50XCI+Q29udGVudDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZ0NvbnRyb2w9XCJjb250ZW50XCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwiY29udGVudFwiICNpbnB1dCBbbmdNb2RlbF09XCJtZXNzYWdlPy5jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj57eyAhbWVzc2FnZSA/ICdTZW5kIE1lc3NhZ2UnIDogJ1NhdmUgTWVzc2FnZScgfX08L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgKGNsaWNrKT1cIm9uQ2FuY2VsKClcIiAqbmdJZj1cIm1lc3NhZ2VcIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgTWVzc2FnZUlucHV0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBtZXNzYWdlOiBNZXNzYWdlID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge31cblxuICAgIG9uU3VibWl0KGZvcm06YW55KSB7XG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIC8vIEVkaXRcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5jb250ZW50ID0gZm9ybS5jb250ZW50O1xuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UudXBkYXRlTWVzc2FnZSh0aGlzLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9PiBjb25zb2xlLmxvZyhkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2U6TWVzc2FnZSA9IG5ldyBNZXNzYWdlKGZvcm0uY29udGVudCwgbnVsbCwgJ0R1bW15Jyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1lc3NhZ2UgaXMtLTogXCIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UuYWRkTWVzc2FnZShtZXNzYWdlKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5tZXNzYWdlcy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbnVsbDtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UubWVzc2FnZUlzRWRpdC5zdWJzY3JpYmUoXG4gICAgICAgICAgICBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyfSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tIFwiLi9tZXNzYWdlXCI7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tIFwiLi9tZXNzYWdlLnNlcnZpY2VcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktbWVzc2FnZScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGFydGljbGUgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgICAgIHt7IG1lc3NhZ2UuY29udGVudCB9fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Zm9vdGVyIGNsYXNzPVwicGFuZWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImF1dGhvclwiPlxuICAgICAgICAgICAgICAgICAgICB7eyBtZXNzYWdlLnVzZXJuYW1lIH19XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbmZpZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8YSAoY2xpY2spPVwib25FZGl0KClcIj5FZGl0PC9hPlxuICAgICAgICAgICAgICAgICAgICA8YSAoY2xpY2spPVwib25EZWxldGUoKVwiPkRlbGV0ZTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZm9vdGVyPlxuICAgICAgICA8L2FydGljbGU+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIC5hdXRob3Ige1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgd2lkdGg6IDgwJTtcbiAgICAgICAgfVxuICAgICAgICAuY29uZmlnIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgd2lkdGg6IDE5JTtcbiAgICAgICAgfVxuICAgIGBdXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VDb21wb25lbnQge1xuICAgIEBJbnB1dCgpIG1lc3NhZ2U6TWVzc2FnZTtcbiAgICBAT3V0cHV0KCkgZWRpdENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHt9XG5cbiAgICBvbkVkaXQoKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLmVkaXRNZXNzYWdlKHRoaXMubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgb25EZWxldGUoKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLmRlbGV0ZU1lc3NhZ2UodGhpcy5tZXNzYWdlKVxuICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICBkYXRhID0+IGNvbnNvbGUubG9nKGRhdGEpLFxuICAgICAgICAgICAgICAgIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICApO1xuICAgIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtNZXNzYWdlQ29tcG9uZW50fSBmcm9tIFwiLi9tZXNzYWdlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tIFwiLi9tZXNzYWdlXCI7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tIFwiLi9tZXNzYWdlLnNlcnZpY2VcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktbWVzc2FnZS1saXN0JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwiPlxuICAgICAgICAgICAgPG15LW1lc3NhZ2UgKm5nRm9yPVwiI21lc3NhZ2Ugb2YgbWVzc2FnZXNcIiBbbWVzc2FnZV09XCJtZXNzYWdlXCIgKGVkaXRDbGlja2VkKT1cIm1lc3NhZ2UuY29udGVudCA9ICRldmVudFwiPjwvbXktbWVzc2FnZT4gICAgIFxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgYCxcbiAgICBkaXJlY3RpdmVzOiBbTWVzc2FnZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTWVzc2FnZUxpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7fVxuXG4gICAgbWVzc2FnZXM6IE1lc3NhZ2VbXTtcblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5nZXRNZXNzYWdlcygpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5tZXNzYWdlcyA9IG1lc3NhZ2VzO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICk7XG4gICAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtNZXNzYWdlSW5wdXRDb21wb25lbnR9IGZyb20gXCIuL21lc3NhZ2UtaW5wdXQuY29tcG9uZW50XCI7XG5pbXBvcnQge01lc3NhZ2VMaXN0Q29tcG9uZW50fSBmcm9tIFwiLi9tZXNzYWdlLWxpc3QuY29tcG9uZW50XCI7XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ215LW1lc3NhZ2VzJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IHNwYWNpbmdcIj5cbiAgICAgICAgICAgIDxteS1tZXNzYWdlLWlucHV0PjwvbXktbWVzc2FnZS1pbnB1dD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgc3BhY2luZ1wiPlxuICAgICAgICAgICAgPG15LW1lc3NhZ2UtbGlzdD48L215LW1lc3NhZ2UtbGlzdD5cbiAgICAgICAgPC9kaXY+IFxuICAgIGAsXG4gICAgZGlyZWN0aXZlczogW01lc3NhZ2VMaXN0Q29tcG9uZW50LCBNZXNzYWdlSW5wdXRDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VzQ29tcG9uZW50IHtcbiAgICBcbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcclxuaW1wb3J0IHtST1VURVJfRElSRUNUSVZFU30gZnJvbSBcImFuZ3VsYXIyL3JvdXRlclwiO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktaGVhZGVyJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPGhlYWRlciBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICA8bmF2IGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC0yXCI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXBpbGxzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnTWVzc2FnZXMnXVwiPk1lc3NhZ2VzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnQXV0aCddXCI+QXV0aGVudGljYXRpb248L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgW3JvdXRlckxpbmtdPVwiWydTZWFyY2gnXVwiPlNlYXJjaDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ1dvcmtsaXN0J11cIj5Xb3JrbGlzdDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ0NhcnQnXVwiPkNhcnQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgW3JvdXRlckxpbmtdPVwiWydDaGFuZ2UnXVwiPkNoYW5nZTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgPC9oZWFkZXI+XHJcbiAgICBgLFxyXG4gICAgZGlyZWN0aXZlczogW1JPVVRFUl9ESVJFQ1RJVkVTXSxcclxuICAgIHN0eWxlczogW2BcclxuICAgICAgICBoZWFkZXIge1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHVsIHtcclxuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjsgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsaSB7XHJcbiAgICAgICAgICAgIGZsb2F0OiBub25lO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC5yb3V0ZXItbGluay1hY3RpdmUsIC5uYXY+bGk+YTpmb2N1cyB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMzMzdhYjc7XHJcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICBcclxuICAgIGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIZWFkZXJDb21wb25lbnQge1xyXG4gICAgXHJcbn0iLCJleHBvcnQgY2xhc3MgVXNlciB7XHJcbiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocHVibGljIGVtYWlsOiBzdHJpbmcsIHB1YmxpYyBwYXNzd29yZDogc3RyaW5nLCBwdWJsaWMgZmlyc3ROYW1lPzogc3RyaW5nLCBwdWJsaWMgbGFzdE5hbWU/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmVtYWlsID0gZW1haWw7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IHBhc3N3b3JkO1xyXG4gICAgICAgIHRoaXMuZmlyc3ROYW1lID0gZmlyc3ROYW1lO1xyXG4gICAgICAgIHRoaXMubGFzdE5hbWUgPSBsYXN0TmFtZTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQge0h0dHAsIEhlYWRlcnN9IGZyb20gXCJhbmd1bGFyMi9odHRwXCI7XHJcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcclxuaW1wb3J0ICdyeGpzL1J4JztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7VXNlcn0gZnJvbSAnLi91c2VyJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0dHA6IEh0dHApIHt9XHJcbiAgICBcclxuICAgIHNpZ251cCh1c2VyOiBVc2VyKSB7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KHVzZXIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBpczogXCIsIHVzZXIpO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2VyJywgYm9keSwge2hlYWRlcnM6IGhlYWRlcnN9KVxyXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXNwb25zZS5qc29uKCkub2JqO1xyXG4gICAgICAgICAgICAgICAgLy9sZXQgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKGRhdGEuY29udGVudCwgZGF0YS5faWQsICdEdW1teScsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xyXG4gICAgfVxyXG4gICAgc2lnbmluKHVzZXI6IFVzZXIpe1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaXM6IFwiLCB1c2VyKTtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvdXNlci9zaWduaW4nLCBib2R5LCB7aGVhZGVyczogaGVhZGVyc30pXHJcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIC8vbGV0IG1lc3NhZ2UgPSBuZXcgTWVzc2FnZShkYXRhLmNvbnRlbnQsIGRhdGEuX2lkLCAnRHVtbXknLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvci5qc29uKCkpKTtcclxuICAgIH1cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIH1cclxuICAgIGlzTG9nZ2VuZEluKCkge1xyXG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2VbJ3Rva2VuJ10gIT0gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0Zvcm1CdWlsZGVyLCBDb250cm9sR3JvdXAsIFZhbGlkYXRvcnMsIENvbnRyb2x9IGZyb20gJ2FuZ3VsYXIyL2NvbW1vbic7XHJcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyfSBmcm9tICcuL3VzZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ215LXNpZ251cCcsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC0yXCI+XHJcbiAgICAgICAgICAgIDxmb3JtIFtuZ0Zvcm1Nb2RlbF09XCJteUZvcm1cIiAobmdTdWJtaXQpPVwib25TdWJtaXQoKVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFibGUgZm9yPVwiZmlyc3ROYW1lXCI+Rmlyc3QgTmFtZTwvbGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBbbmdGb3JtQ29udHJvbF09XCJteUZvcm0uZmluZCgnZmlyc3ROYW1lJylcIiB0eXBlPVwidGV4dFwiIGlkPVwiZmlyc3ROYW1lXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFibGUgZm9yPVwibGFzdE5hbWVcIj5MYXN0IE5hbWU8L2xhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgW25nRm9ybUNvbnRyb2xdPVwibXlGb3JtLmZpbmQoJ2xhc3ROYW1lJylcIiB0eXBlPVwidGV4dFwiIGlkPVwibGFzdE5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJsZSBmb3I9XCJlbWFpbFwiPk1haWw8L2xhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgW25nRm9ybUNvbnRyb2xdPVwibXlGb3JtLmZpbmQoJ2VtYWlsJylcIiB0eXBlPVwiZW1haWxcIiBpZD1cImVtYWlsXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFibGUgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZDwvbGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBbbmdGb3JtQ29udHJvbF09XCJteUZvcm0uZmluZCgncGFzc3dvcmQnKVwiIHR5cGU9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIFtkaXNhYmxlZF09XCIhbXlGb3JtLnZhbGlkXCI+U2lnbiBVcDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9ybT5cclxuICAgIDwvc2VjdGlvbj5cclxuICAgIGBcclxuICAgIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbnVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xyXG4gICAgbXlGb3JtOiBDb250cm9sR3JvdXA7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2ZiOiBGb3JtQnVpbGRlciwgcHJpdmF0ZSBfYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxyXG4gICAgbmdPbkluaXQoKXtcclxuICAgICAgICB0aGlzLm15Rm9ybSA9IHRoaXMuX2ZiLmdyb3VwKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXHJcbiAgICAgICAgICAgICAgICBsYXN0TmFtZTogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBbJycsIFZhbGlkYXRvcnMuY29tcG9zZShbXHJcbiAgICAgICAgICAgICAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW1haWxcclxuICAgICAgICAgICAgICAgIF0pXSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvblN1Ym1pdCgpIHtcclxuICAgICAgICBjb25zdCB1c2VyOlVzZXIgPSBuZXcgVXNlcih0aGlzLm15Rm9ybS52YWx1ZS5lbWFpbCwgdGhpcy5teUZvcm0udmFsdWUucGFzc3dvcmQsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5teUZvcm0udmFsdWUuZmlyc3ROYW1lLCB0aGlzLm15Rm9ybS52YWx1ZS5sYXN0TmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBpcy0tOiBcIiwgdXNlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dGhTZXJ2aWNlLnNpZ251cCh1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5fbWVzc2FnZVNlcnZpY2UubWVzc2FnZXMucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc0VtYWlsKGNvbnRyb2w6IENvbnRyb2wpIDoge1tzOiBzdHJpbmddOiBib29sZWFufSB7XHJcbiAgICAgICAgIGlmICghY29udHJvbC52YWx1ZS5tYXRjaChcIlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1wiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geydpbnZhbGlkTWFpbCc6IHRydWV9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7VXNlcn0gZnJvbSAnLi91c2VyJztcclxuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktc2lnbmluJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cclxuICAgICAgICAgICAgPGZvcm0gIChuZ1N1Ym1pdCk9XCJvblN1Ym1pdChmLnZhbHVlKVwiICNmPVwibmdGb3JtXCI+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmxlIGZvcj1cImVtYWlsXCI+TWFpbDwvbGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZ0NvbnRyb2w9XCJlbWFpbFwiIHR5cGU9XCJlbWFpbFwiIGlkPVwiZW1haWxcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHJlcXVpcmVkPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJsZSBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkPC9sYWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5nQ29udHJvbD1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcmVxdWlyZWQ+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgW2Rpc2FibGVkXT1cIiFmLnZhbGlkXCI+U2lnbiBJbjwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9ybT5cclxuICAgIDwvc2VjdGlvbj5cclxuICAgIGBcclxuICAgIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbmluQ29tcG9uZW50IHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge31cclxuICAgIG9uU3VibWl0KG15Rm9ybTphbnkpIHtcclxuICAgICAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIobXlGb3JtLmVtYWlsLCBteUZvcm0ucGFzc3dvcmQpO1xyXG4gICAgICAgIHRoaXMuX2F1dGhTZXJ2aWNlLnNpZ25pbih1c2VyKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIGRhdGEudG9rZW4pO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcklkJywgZGF0YS51c2VySWQpO1xyXG4gICAgICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGVCeVVybCgnLycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgKTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7Um91dGVyfSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktbG9nb3V0JyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgKGNsaWNrKT1cIm9uTG9nb3V0KClcIj5Mb2dvdXQ8L2J1dHRvbj5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICBgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2dvdXRDb21wb25lbnR7XHJcbiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2F1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSwgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIpIHt9XHJcbiAgIG9uTG9nb3V0KCl7XHJcbiAgICAgIHRoaXMuX2F1dGhTZXJ2aWNlLmxvZ291dCgpO1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWydTaWduaW4nXSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgfSBcclxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtTaWdudXBDb21wb25lbnR9IGZyb20gJy4vc2lnbnVwLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7U2lnbmluQ29tcG9uZW50fSBmcm9tICcuL3NpZ25pbi5jb21wb25lbnQnO1xyXG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcblxyXG5pbXBvcnQge0xvZ291dENvbXBvbmVudH0gZnJvbSAnLi9sb2dvdXQuY29tcG9uZW50JztcclxuaW1wb3J0IHtSb3V0ZUNvbmZpZywgUk9VVEVSX0RJUkVDVElWRVN9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS1hdXRoJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPGhlYWRlciBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XHJcbiAgICAgICAgICAgIDxuYXYgY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ1NpZ251cCddXCI+U2lnbnVwPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnU2lnbmluJ11cIiAqbmdJZj1cIiEgaXNMb2dnZWRJbigpXCI+U2lnbmluPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnTG9nb3V0J11cIiAqbmdJZj1cImlzTG9nZ2VkSW4oKVwiPkxvZ291dDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XHJcbiAgICAgICAgICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgICBkaXJlY3RpdmVzOiBbU2lnbnVwQ29tcG9uZW50LCBTaWduaW5Db21wb25lbnQsIExvZ291dENvbXBvbmVudCwgUk9VVEVSX0RJUkVDVElWRVNdLFxyXG4gICAgc3R5bGVzOiBbYFxyXG4gICAgICAgICAucm91dGVyLWxpbmstYWN0aXZlIHtcclxuICAgICAgICAgICAgY29sb3I6ICM1NTU7XHJcbiAgICAgICAgICAgIGN1cnNvcjogZGVmYXVsdDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgYF0gXHJcbn0pXHJcbkBSb3V0ZUNvbmZpZyhbXHJcbiAgICB7cGF0aDogJy9zaWdudXAnLCBuYW1lOiAnU2lnbnVwJywgY29tcG9uZW50OiBTaWdudXBDb21wb25lbnQsIHVzZUFzRGVmYXVsdDogdHJ1ZX0sXHJcbiAgICB7cGF0aDogJy9zaWduaW4nLCBuYW1lOiAnU2lnbmluJywgY29tcG9uZW50OiBTaWduaW5Db21wb25lbnR9LFxyXG4gICAge3BhdGg6ICcvbG9nb3V0JywgbmFtZTogJ0xvZ291dCcsIGNvbXBvbmVudDogTG9nb3V0Q29tcG9uZW50fVxyXG5dKVxyXG5leHBvcnQgY2xhc3MgQXV0aGVudGljYXRpb25Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxyXG4gICAgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXV0aFNlcnZpY2UuaXNMb2dnZW5kSW4oKTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IHtDb250cm9sLCBGT1JNX0RJUkVDVElWRVN9IGZyb20gJ2FuZ3VsYXIyL2NvbW1vbic7ICBcclxuaW1wb3J0IHtDb21wb25lbnQsIE91dHB1dCwgSW5wdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnOyAgXHJcbi8vaW1wb3J0ICdyeGpzL1J4JztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ215LXNlYXJjaCcsXHJcbiAgZGlyZWN0aXZlczogW0ZPUk1fRElSRUNUSVZFU10sXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxoMT5TZWFyY2g8L2gxPlxyXG4gICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCJcclxuICAgICAgW25nRm9ybUNvbnRyb2xdPVwic2VhcmNoQm94XCIgXHJcbiAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIGFydGlzdFwiIC8+XHJcbiAgICAgIDxoMz5TZWFyY2hlZDoge3tzZWFyY2hDb3VudH19IHRpbWVzPC9oMz5cclxuICAgICAgXHJcbiAgICA8ZGl2ICpuZ0Zvcj1cIiNib29rcyBvZiByZXN1bHRzIHwgYXN5bmNcIj5cclxuICAgICAgPHNlY3Rpb24gY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLW1kLTZcIj57eyBib29rcy52b2x1bWVJbmZvLnRpdGxlIH19PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sIGNvbC1tZC00XCI+e3sgYm9va3Mudm9sdW1lSW5mby5wdWJsaXNoZXIgfX08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICBcclxuICAgIDwvZGl2PlxyXG4gIGBcclxufSlcclxuZXhwb3J0IGNsYXNzIFNlYXJjaFJlc3VsdHNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBASW5wdXQoKSByZXN1bHRzOiBPYnNlcnZhYmxlPGFueT47XHJcbiAgQElucHV0KCkgY291bnRlcjogT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBPdXRwdXQoKSBzZWFyY2hFdmVudDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgc2VhcmNoQ291bnQ6IG51bWJlciA9IDA7XHJcbiAgXHJcbiAgLy9cclxuICBzb3VyY2UgPSBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcclxuICBjb25zdCBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDo4MDgwJyk7XHJcbiAgXHJcbiAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChldmVudCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgIGFsZXJ0KCdTZXJ2ZXIgY2xvc2VkIHRoZSBjb25uZWN0aW9uLi4uLi4uLi4nKTtcclxuICAgICAgfTtcclxuICBcclxuICAgIHJldHVybiAoKSA9PiBzb2NrZXQuY2xvc2UoKTtcclxuICB9KVxyXG4gIC5yZXRyeVdoZW4oZXJyb3JzID0+IGVycm9ycy5zd2l0Y2hNYXAoZXJyID0+IHtcclxuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLm9uTGluZSA/IE9ic2VydmFibGUudGltZXIoMzAwMCkgOlxyXG4gICAgICAgIE9ic2VydmFibGUuZnJvbUV2ZW50KHdpbmRvdywgJ29ubGluZScpLnRha2UoMSk7XHJcbiAgICB9KSk7XHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgXHJcblxyXG4gcHJpdmF0ZSBzZWFyY2hCb3g6Q29udHJvbCA9IG5ldyBDb250cm9sKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWFyY2hCb3hcclxuICAgICAgICAudmFsdWVDaGFuZ2VzXHJcbiAgICAgICAgLmRlYm91bmNlVGltZSgyMDApXHJcbiAgICAgICAgLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2VhcmNoRXZlbnQuZW1pdChldmVudClcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICB9KTtcclxuICAgICBcclxuICB9XHJcbiAgaG90ID0gdGhpcy5zb3VyY2Uuc2hhcmUoKTtcclxuICBcclxuIFxyXG4gIFxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgXHJcbiAgICAgdGhpcy5jb3VudGVyLnN1YnNjcmliZShkYXRhID0+IHRoaXMuc2VhcmNoQ291bnQgPSBkYXRhKTtcclxuICAgICBcclxuICAgIC8vIGZpcnN0IGNvbm5lY3Rpb25cclxuICAgIHZhciAgc3ViMSA9IHRoaXMuaG90LnN1YnNjcmliZSgoZSkgPT4gY29uc29sZS5sb2coJ3MxJywgZSkpO1xyXG4gICAgdmFyIHN1YjI6IGFueTtcclxuXHJcbiAgICAvLyBzZWNvbmQgY29ubmVjdGlvbiBvbmUgc2Vjb25kIGxhdGVyXHJcbiAgICBcclxuICAgIFxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2luZyBob3Qgb2JzZXJ2YWJsZS4uLicpO1xyXG4gICAgICBzdWIyID0gdGhpcy5ob3Quc3Vic2NyaWJlKChlKSA9PiBjb25zb2xlLmxvZygnczInLCBlKSk7XHJcbiAgICB9LCAxMDAwKTtcclxuXHJcblxyXG4gICAgLy8gc2luY2Ugd2UncmUgcHVtcGluZyBhbGwgb2YgdGhlIHZhbHVlcyB0aHJvdWdoIGEgU3ViamVjdCwgd2hpY2ggXHJcbiAgICAvLyBtdXRsaWNhc3RzIHRvIGFsbCBzdWJzY3JpYmVycywgd2UndmUgbWFkZSBvdXIgc291cmNlIFwiaG90XCIuXHJcblxyXG4gICAgLy8gQWZ0ZXIgYSB3aGlsZSwgd2UnbGwgdW5zdWJzY3JpYmUgZnJvbSBib3RoLFxyXG4gICAgLy8gYW5kIG5vdyBvdXIgc29ja2V0IHdpbGwgZGlzY29ubmVjdC5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBzdWIxLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIHN1YjIudW5zdWJzY3JpYmUoKTtcclxuICAgIH0sIDQwMDApO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAvLyByZXVzaW5nIHRoZSBob3Qgb2JzZXJ2YWJsZVxyXG4gICAgICBjb25zb2xlLmxvZygncmV1c2luZyBob3Qgb2JzZXJ2YWJsZS4uLicpO1xyXG4gICAgICB0aGlzLmhvdC5zdWJzY3JpYmUoKGUpID0+IGNvbnNvbGUubG9nKCdzMycsIGUpKTtcclxuICAgIH0sIDQ1MDApO1xyXG4gIH1cclxuICBcclxuIFxyXG4gICAgXHJcblxyXG59XHJcblxyXG5cclxuIiwiaW1wb3J0IHtIdHRwfSBmcm9tICdhbmd1bGFyMi9odHRwJztcclxuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0lucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCAncnhqcy9SeCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtPYnNlcnZlcn0gZnJvbSAncnhqcy9PYnNlcnZlcic7XHJcbmltcG9ydCB7U2VhcmNoUmVzdWx0c0NvbXBvbmVudH0gZnJvbSAnLi9zZWFyY2gucmVzdWx0cy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICdhcHAtcm9vdCcsXHJcblx0ZGlyZWN0aXZlczogW1NlYXJjaFJlc3VsdHNDb21wb25lbnRdLFxyXG5cdHRlbXBsYXRlOiBgXHJcblx0XHQ8bXktc2VhcmNoIChzZWFyY2hFdmVudCk9XCJvblNlYXJjaCgkZXZlbnQpXCIgW3Jlc3VsdHNdPVwiZGF0YVwiIFtjb3VudGVyXT1cImNvdW50ZXJcIj48L215LXNlYXJjaD5cclxuXHRcdFxyXG5cdGBcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQge1xyXG4gIHByaXZhdGUgZGF0YTpPYnNlcnZhYmxlPGFueT47XHJcbiAgcHJpdmF0ZSBkYXRhT2JzZXJ2ZXI6T2JzZXJ2ZXI8YW55PjtcclxuXHRwcml2YXRlIGNvdW50ZXI6T2JzZXJ2YWJsZTxhbnk+O1xyXG5cdHByaXZhdGUgY291bnRlck9ic2VydmVyOk9ic2VydmVyPGFueT47XHJcbiAgcHJpdmF0ZSBjbnQ6IG51bWJlciA9IDA7XHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB0aGlzLmRhdGFPYnNlcnZlciA9IG9ic2VydmVyKTtcclxuXHRcdHRoaXMuY291bnRlciA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHRoaXMuY291bnRlck9ic2VydmVyID0gb2JzZXJ2ZXIpO1xyXG5cdH1cclxuXHRcclxuXHRvblNlYXJjaChldmVudCkge1xyXG5cdCAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2Jvb2tzL3YxL3ZvbHVtZXM/cT0nICsgZXZlbnQpLm1hcCgocmVzcG9uc2UpID0+IHtcclxuXHQgICAgdmFyIGJvb2tzID0gcmVzcG9uc2UuanNvbigpO1xyXG5cdCAgICByZXR1cm4gYm9va3MuaXRlbXM7XHJcblx0IH0pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cdCAgIHRoaXMuZGF0YU9ic2VydmVyLm5leHQocmVzdWx0KTtcclxuXHRcdCB0aGlzLmNvdW50ZXJPYnNlcnZlci5uZXh0KCsrdGhpcy5jbnQpO1xyXG5cdFx0IGNvbnNvbGUubG9nKFwiQ291bnRlciBpbiBzZXJ2aWNlOiBcIiwgdGhpcy5jbnQpO1xyXG5cdCB9LCBlcnJvciA9PiBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvYWQgYXJ0aXN0cycpKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgQWN0aXZpdHkge1xyXG4gICAgXHJcbiAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgY3JlYXRlZEF0OiBEYXRlO1xyXG4gICAgcHJpb3JpdHk6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKHZhbHVlOiBzdHJpbmcsIHByaW9yaXR5OiBudW1iZXIsIGNyZWF0ZWRBdD86IERhdGUpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSBjcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHkgfHwgNTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgSGVhZGVycyB9IGZyb20gJ2FuZ3VsYXIyL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMvU3ViamVjdCc7XHJcbmltcG9ydCB7QWN0aXZpdHl9IGZyb20gJy4vYWN0aXZpdHknO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQWN0aXZpdHlTZXJ2aWNlIHtcclxuICBwcml2YXRlIF9BY3Rpdml0aWVzJDogU3ViamVjdDxBY3Rpdml0eVtdPjtcclxuICBwcml2YXRlIGJhc2VVcmw6IHN0cmluZztcclxuICBwcml2YXRlIGRhdGFTdG9yZToge1xyXG4gICAgQWN0aXZpdGllczogQWN0aXZpdHlbXVxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgdGhpcy5iYXNlVXJsICA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xyXG4gICAgdGhpcy5kYXRhU3RvcmUgPSB7IEFjdGl2aXRpZXM6IFtdIH07XHJcbiAgICB0aGlzLl9BY3Rpdml0aWVzJCA9IDxTdWJqZWN0PEFjdGl2aXR5W10+Pm5ldyBTdWJqZWN0KCk7XHJcbiAgfVxyXG5cclxuICBnZXQgQWN0aXZpdGllcyQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fQWN0aXZpdGllcyQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkQWxsKCkge1xyXG4gICAgdGhpcy5odHRwLmdldChgJHt0aGlzLmJhc2VVcmx9L2FjdGl2aXRpZXNgKS5tYXAocmVzcG9uc2UgPT4gIHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgIHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXMgPSBkYXRhLm9iajtcclxuICAgICAgdGhpcy5fQWN0aXZpdGllcyQubmV4dCh0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzKTtcclxuICAgIH0sIGVycm9yID0+IGNvbnNvbGUubG9nKCdDb3VsZCBub3QgbG9hZCBBY3Rpdml0aWVzLicpKTtcclxuICB9XHJcblxyXG4gIFxyXG4gIGNyZWF0ZShhY3Rpdml0eTogQWN0aXZpdHkpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiQWN0aXZpdHkgdG8gc2F2ZSBhdCBVSTogXCIsIGFjdGl2aXR5KTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KGFjdGl2aXR5KTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChgJHt0aGlzLmJhc2VVcmx9L2FjdGl2aXRpZXNgLGJvZHkgLCB7aGVhZGVyczogaGVhZGVyc30pXHJcbiAgICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcy5wdXNoKGRhdGEub2JqKTtcclxuICAgICAgICB0aGlzLl9BY3Rpdml0aWVzJC5uZXh0KHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXMpO1xyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmxvZygnQ291bGQgbm90IGNyZWF0ZSBBY3Rpdml0eS4nKSk7XHJcbiAgfVxyXG59XHJcbiAgLypcclxuICAvKmxvYWQoaWQ6IGFueSkge1xyXG4gICAgdGhpcy5odHRwLmdldChgJHt0aGlzLmJhc2VVcmx9L2FjdGl2aXRpZXMvJHtpZH1gKS5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgIGxldCBub3RGb3VuZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcclxuICAgICAgICAgIHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXNbaW5kZXhdID0gZGF0YTtcclxuICAgICAgICAgIG5vdEZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChub3RGb3VuZCkge1xyXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXMucHVzaChkYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fQWN0aXZpdGllcyQubmV4dCh0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzKTtcclxuICAgIH0sIGVycm9yID0+IGNvbnNvbGUubG9nKCdDb3VsZCBub3QgbG9hZCBBY3Rpdml0eS4nKSk7XHJcbiAgfVxyXG4gIHVwZGF0ZShBY3Rpdml0eTogQWN0aXZpdHkpIHtcclxuICAgIHRoaXMuaHR0cC5wdXQoYCR7dGhpcy5iYXNlVXJsfS9hY3Rpdml0aWVzLyR7QWN0aXZpdHkuaWR9YCwgSlNPTi5zdHJpbmdpZnkoQWN0aXZpdHkpKVxyXG4gICAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXMuZm9yRWFjaCgoQWN0aXZpdHksIGkpID0+IHtcclxuICAgICAgICAgIGlmIChBY3Rpdml0eS5faWQgPT09IGRhdGEuX2lkKSB7IHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXNbaV0gPSBkYXRhOyB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX0FjdGl2aXRpZXMkLm5leHQodGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcyk7XHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUubG9nKCdDb3VsZCBub3QgdXBkYXRlIEFjdGl2aXR5LicpKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZShBY3Rpdml0eUlkOiBudW1iZXIpIHtcclxuICAgIHRoaXMuaHR0cC5kZWxldGUoYCR7dGhpcy5iYXNlVXJsfS9BY3Rpdml0aWVzLyR7QWN0aXZpdHlJZH1gKS5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xyXG4gICAgICB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzLmZvckVhY2goKHQsIGkpID0+IHtcclxuICAgICAgICBpZiAodC5pZCA9PT0gQWN0aXZpdHlJZCkgeyB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzLnNwbGljZShpLCAxKTsgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuX0FjdGl2aXRpZXMkLm5leHQodGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcyk7XHJcbiAgICB9LCBlcnJvciA9PiBjb25zb2xlLmxvZygnQ291bGQgbm90IGRlbGV0ZSBBY3Rpdml0eS4nKSk7XHJcbiAgfSovXHJcblxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0NoYW5nZURldGVjdG9yUmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtBY3Rpdml0eVNlcnZpY2V9IGZyb20gJy4vd29ya2xpc3Quc2VydmljZSc7XHJcbmltcG9ydCB7QWN0aXZpdHl9IGZyb20gJy4vYWN0aXZpdHknO1xyXG5pbXBvcnQgJ3J4anMvUngnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2Fub3RoZXItbXktd29ya2xpc3QnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICAgICAgIDxoND5Ob3JtYWwgUHJpb3JpdHkgVGFza3MgLSB7e25vcm1hbFByaW9RdWV1ZX19PC9oND5cclxuICAgICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdCAgYWN0aXZpdHktYm94XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keSBub3JtYWwtcHJpb3JpdHlcIiAgKm5nRm9yPVwiI2FjdGl2aXR5IG9mIGFub3RoZXJBY3Rpdml0aWVzJCB8IGFzeW5jXCIgPlxyXG4gICAgICAgICAgICAgICAge3thY3Rpdml0eS52YWx1ZX19XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgYFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEFub3RoZXJXb3JrbGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcclxuICAgICBcclxuICAgICBhbm90aGVyQWN0aXZpdGllcyQ6IE9ic2VydmFibGU8YW55PjtcclxuICAgIFxyXG4gICAgIG5vcm1hbFByaW9RdWV1ZTogbnVtYmVyO1xyXG4gICAgIGhlaWdodCA9IDIzMDtcclxuICAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2FjdGl2aXR5U2VydmljZTogQWN0aXZpdHlTZXJ2aWNlKSB7fVxyXG4gICAgXHJcbiAgICBuZ09uSW5pdCgpe1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5hbm90aGVyQWN0aXZpdGllcyQgPSB0aGlzLl9hY3Rpdml0eVNlcnZpY2UuQWN0aXZpdGllcyRcclxuICAgICAgICAubWFwKHRvZG9zID0+IHRvZG9zLmZpbHRlcihpdGVtID0+IGl0ZW0ucHJpb3JpdHkgPiA1KSk7IC8vIHN1YnNjcmliZSB0byBlbnRpcmUgY29sbGVjdGlvblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2FjdGl2aXR5U2VydmljZS5sb2FkQWxsKCk7ICAgIC8vIGxvYWQgYWxsIHRvZG9zXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hbm90aGVyQWN0aXZpdGllcyQuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5ub3JtYWxQcmlvUXVldWUgPSBkYXRhLmxlbmd0aCk7XHJcbiAgICAgfVxyXG4gICAgXHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7QWN0aXZpdHlTZXJ2aWNlfSBmcm9tICcuL3dvcmtsaXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0FjdGl2aXR5fSBmcm9tICcuL2FjdGl2aXR5JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS13b3JrbGlzdC1hZGQnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgIFxyXG4gICAgICAgICAgICA8Zm9ybSAobmdTdWJtaXQpPVwib25TdWJtaXQoZi52YWx1ZSlcIiAjZj1cIm5nRm9ybVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ2YWx1ZVwiPkFjdGl2aXR5PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5nQ29udHJvbD1cInZhbHVlXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwidmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInByaW9yaXR5XCI+UHJpb3JpdHk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmdDb250cm9sPVwicHJpb3JpdHlcIiB0eXBlPVwibnVtYmVyXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZD1cInByaW9yaXR5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgc3BhY2luZ1wiPkFkZCBBY3Rpdml0eTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgIFxyXG4gICAgYFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmtsaXN0QWRkQ29tcG9uZW50IHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfYWN0aXZpdHlTZXJ2aWNlOiBBY3Rpdml0eVNlcnZpY2UpIHt9XHJcbiAgICBvblN1Ym1pdChmb3JtOmFueSkge1xyXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0eTpBY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShmb3JtLnZhbHVlLCBmb3JtLnByaW9yaXR5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2aXR5U2VydmljZS5jcmVhdGUoYWN0aXZpdHkpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIElucHV0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0FjdGl2aXR5U2VydmljZX0gZnJvbSAnLi93b3JrbGlzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtBY3Rpdml0eX0gZnJvbSAnLi9hY3Rpdml0eSc7XHJcbmltcG9ydCAncnhqcy9SeCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQge0Fub3RoZXJXb3JrbGlzdENvbXBvbmVudH0gZnJvbSAnLi9hbm90aGVyLndvcmtsaXN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7V29ya2xpc3RBZGRDb21wb25lbnR9IGZyb20gJy4vd29ya2xpc3QuYWRkLmNvbXBvbmVudCc7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS13b3JrbGlzdCcsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC0yXCI+XHJcbiAgICAgICAgICAgIDxteS13b3JrbGlzdC1hZGQ+PC9teS13b3JrbGlzdC1hZGQ+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiA+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDQ+SGlnaCBQcmlvcml0eSBUYXNrcyAtIHt7aGlnaFByaW9RdWV1ZX19PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGFydGljbGUgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0ICBhY3Rpdml0eS1ib3hcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keSBoaWdoLXByaW9yaXR5XCIgICpuZ0Zvcj1cIiNhY3Rpdml0eSBvZiBhY3Rpdml0aWVzJCB8IGFzeW5jXCIgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7YWN0aXZpdHkudmFsdWV9fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2FydGljbGU+IFxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjb2wtbWQtb2Zmc2V0LTRcIj4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhbm90aGVyLW15LXdvcmtsaXN0PjwvYW5vdGhlci1teS13b3JrbGlzdD5cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICBgLFxyXG4gICAgZGlyZWN0aXZlczogW0Fub3RoZXJXb3JrbGlzdENvbXBvbmVudCwgV29ya2xpc3RBZGRDb21wb25lbnRdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgV29ya2xpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XHJcbiAgICBhY3Rpdml0aWVzJDogT2JzZXJ2YWJsZTxhbnk+O1xyXG4gICAgaGlnaFByaW9RdWV1ZTogbnVtYmVyO1xyXG4gICAgaGVpZ2h0ID0gMjMwO1xyXG4gICAgIFxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfYWN0aXZpdHlTZXJ2aWNlOiBBY3Rpdml0eVNlcnZpY2UpIHt9XHJcbiAgICBvblN1Ym1pdChmb3JtOmFueSkge1xyXG4gICAgICAgICAgICBjb25zdCBhY3Rpdml0eTpBY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShmb3JtLnZhbHVlLCBmb3JtLnByaW9yaXR5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2aXR5U2VydmljZS5jcmVhdGUoYWN0aXZpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCl7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0aWVzJCA9IHRoaXMuX2FjdGl2aXR5U2VydmljZS5BY3Rpdml0aWVzJFxyXG4gICAgICAgICAubWFwKHRvZG9zID0+IHRvZG9zLmZpbHRlcihpdGVtID0+IGl0ZW0ucHJpb3JpdHkgPD0gNSkpOyAvLyBzdWJzY3JpYmUgdG8gZW50aXJlIGNvbGxlY3Rpb25cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9hY3Rpdml0eVNlcnZpY2UubG9hZEFsbCgpOyAgICAvLyBsb2FkIGFsbCB0b2Rvc1xyXG4gICAgICAgIFxyXG4gICAgICAgdGhpcy5hY3Rpdml0aWVzJC5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLmhpZ2hQcmlvUXVldWUgPSBkYXRhLmxlbmd0aCk7XHJcbiAgICAgfVxyXG4gICAgXHJcbn0iLCJcclxuZXhwb3J0IGNsYXNzIE1hc3RlckNvbXBvbmVudHtcclxuICAgIFxyXG4gICAgdXBkYXRlTWUoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGxhc3RVcGRhdGVkKCl7XHJcbiAgICAgICAgcmV0dXJuIERhdGUoKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDb21wb25lbnQsIE91dHB1dCwgSW5wdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcclxuaW1wb3J0IHtNYXN0ZXJDb21wb25lbnR9IGZyb20gJy4vbWFzdGVyLmNvbW1lbnQnO1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ215LWNhcnQtYmFkZ2UnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBzdHlsZT1cImJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO3BhZGRpbmc6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiPlxyXG4gICAgICAgICAgICB7e21lc3NhZ2V9fVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+PHN0cm9uZz57e2xhc3RVcGRhdGVkKCl9fTwvc3Ryb25nPjwvZGl2PlxyXG4gICAgICAgIDxoMz5UaGUgQ2FydCBCYWRnZTwvaDM+XHJcbiAgICAgICAgPGg0Pkl0ZW1zIGluIHlvdXIgY2FydCA6IHt7Y291bnRlcn19PC9oND5cclxuICAgIFxyXG4gICAgPC9kaXY+XHJcbiAgICAgXHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FydEJhZGdlQ29tcG9uZW50IGV4dGVuZHMgTWFzdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQElucHV0KCkgaXRlbUFkZFN0cmVhbTpPYnNlcnZhYmxlPGFueT47XHJcbiAgY291bnRlciA9IDA7XHJcbiAgbWVzc2FnZSA9ICdVc2luZyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5vblB1c2gsIGkgZGVjaWRlIHdoZW4gdG8gdXBkYXRlIG15c2VsZiwgY3VycmVudGx5IGF0IGFuIGludGVydmFsIG9mIDUgc2Vjcyc7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgIH0sIDUwMDApO1xyXG4gIH07XHJcbiAgLy9wcml2YXRlIGNudDogbnVtYmVyID0gMDtcclxuICBcclxuXHJcbiAgXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLml0ZW1BZGRTdHJlYW0uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5jb3VudGVyKys7IC8vIGFwcGxpY2F0aW9uIHN0YXRlIGNoYW5nZWRcclxuICAgICAgY29uc29sZS5sb2coXCJJdGVtIGlzIENhcnQ6IFwiLCB0aGlzLmNvdW50ZXIpO1xyXG4gICAgIH0pO1xyXG4gXHJcbiAgfVxyXG59IiwiLy9QdXNoIFN0cmF0ZWd5XHJcbmltcG9ydCB7Q29tcG9uZW50LENoYW5nZURldGVjdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtNYXN0ZXJDb21wb25lbnR9IGZyb20gJy4vbWFzdGVyLmNvbW1lbnQnO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBfX21vZHVsZU5hbWUsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2NoaWxkLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHNlbGVjdG9yOidjaGlsZC1zZWN0aW9uLTEnLFxyXG4gICAgY2hhbmdlRGV0ZWN0aW9uOkNoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2hpbGRDb21wb25lbnRTZWN0aW9uMSBleHRlbmRzIE1hc3RlckNvbXBvbmVudHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnVXNpbmcgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLCBvbmx5IHVwZGF0ZSBteXNlbGYgZm9yIGNoYW5nZXMgaW5pdGlhdGVkIGZyb20gd2l0aGluIG1lLiBJIGFtIGFsb29mIHRvIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlIGluaXRpYXRlZCBieSBhbnkgb3RoZXIgY29tcG9uZW50Lic7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIG1vZHVsZUlkOiBfX21vZHVsZU5hbWUsXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2NoaWxkLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHNlbGVjdG9yOidjaGlsZC1zZWN0aW9uLTInLFxyXG4gICAgY2hhbmdlRGV0ZWN0aW9uOkNoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHRcclxufSlcclxuZXhwb3J0IGNsYXNzIENoaWxkQ29tcG9uZW50U2VjdGlvbjIgZXh0ZW5kcyBNYXN0ZXJDb21wb25lbnR7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gJ1VzaW5nIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsIGdldHRpbmcgdXBkYXRlIGZvciBhbnkgY2hhbmdlIHRvIGFueSBjb21wb25lbnQgb24gdGhlIHBhZ2UsIGkgcGFydGljaXBhdGUgaW4gZWFjaCBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlIHJlZ2FyZGxlc3Mgb2Ygd2hvIGluaXRpYXRlZCBpdC4nO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDb21wb25lbnQsIE91dHB1dCwgSW5wdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcclxuaW1wb3J0IHtPYnNlcnZlcn0gZnJvbSAncnhqcy9PYnNlcnZlcic7XHJcbmltcG9ydCB7Q2FydEJhZGdlQ29tcG9uZW50fSBmcm9tICcuL2NhcnQuYmFkZ2UuY29tcG9uZW50JztcclxuaW1wb3J0IHtDaGlsZENvbXBvbmVudFNlY3Rpb24xLCBDaGlsZENvbXBvbmVudFNlY3Rpb24yfSBmcm9tICcuL2NoaWxkLmNvbXBvbmVudC5zZWN0aW9uJztcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdteS1jYXJ0JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+UGljayBJdGVtcyBmcm9tIGhlcmUuLi48L2gzPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIChjbGljayk9XCJvbkFkZFRvQ2FydCgpXCI+QWRkIHRvIENhcnQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPG15LWNhcnQtYmFkZ2UgW2l0ZW1BZGRTdHJlYW1dPVwiY291bnRlclwiPjwvbXktY2FydC1iYWRnZT5cclxuICAgICAgICAgICAgPGNoaWxkLXNlY3Rpb24tMT48L2NoaWxkLXNlY3Rpb24tMT5cclxuICAgICAgICAgICAgPGNoaWxkLXNlY3Rpb24tMj48L2NoaWxkLXNlY3Rpb24tMj5cclxuICBgLFxyXG4gIGRpcmVjdGl2ZXM6IFtDYXJ0QmFkZ2VDb21wb25lbnQsIENoaWxkQ29tcG9uZW50U2VjdGlvbjEsIENoaWxkQ29tcG9uZW50U2VjdGlvbjJdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FydENvbXBvbmVudCB7XHJcblxyXG4gIHByaXZhdGUgY291bnRlcjpPYnNlcnZhYmxlPGFueT47XHJcbiAgcHJpdmF0ZSBjb3VudGVyT2JzZXJ2ZXI6T2JzZXJ2ZXI8YW55PjtcclxuICBcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY291bnRlciA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHRoaXMuY291bnRlck9ic2VydmVyID0gb2JzZXJ2ZXIpO1xyXG4gIH1cclxuICBvbkFkZFRvQ2FydCgpe1xyXG4gICAgdGhpcy5jb3VudGVyT2JzZXJ2ZXIubmV4dCgxKTtcclxuICB9XHJcbiAgXHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25DaGFuZ2VzLCBJbnB1dCwgRG9DaGVjaywgS2V5VmFsdWVEaWZmZXJzfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAnbXktY2hpbGQnLFxyXG5cdHRlbXBsYXRlOiBgXHJcblx0XHQ8aDI+Q2hpbGQgY29tcG9uZW50PC9oMj5cclxuXHRcdHt7IHBlcnNvbi5uYW1lIH19XHJcblx0YFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2hpbGRDb21wb25lbnQgaW1wbGVtZW50cyBEb0NoZWNrIHtcclxuXHRASW5wdXQoKSBwZXJzb246IGFueTtcclxuXHRkaWZmZXI6IGFueTtcclxuXHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMpIHtcclxuXHRcdHRoaXMuZGlmZmVyID0gZGlmZmVycy5maW5kKHt9KS5jcmVhdGUobnVsbCk7XHJcblx0fVxyXG5cclxuXHRuZ0RvQ2hlY2soKSB7XHJcblx0XHR2YXIgY2hhbmdlcyA9IHRoaXMuZGlmZmVyLmRpZmYodGhpcy5wZXJzb24pO1xyXG5cclxuXHRcdGlmKGNoYW5nZXMpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2NoYW5nZXMgZGV0ZWN0ZWQnKTtcclxuXHRcdFx0Y2hhbmdlcy5mb3JFYWNoQ2hhbmdlZEl0ZW0ociA9PiBjb25zb2xlLmxvZygnY2hhbmdlZCAnLCByLmN1cnJlbnRWYWx1ZSkpO1xyXG5cdFx0XHRjaGFuZ2VzLmZvckVhY2hBZGRlZEl0ZW0ociA9PiBjb25zb2xlLmxvZygnYWRkZWQgJyArIHIuY3VycmVudFZhbHVlKSk7XHJcblx0XHRcdGNoYW5nZXMuZm9yRWFjaFJlbW92ZWRJdGVtKHIgPT4gY29uc29sZS5sb2coJ3JlbW92ZWQgJyArIHIuY3VycmVudFZhbHVlKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnbm90aGluZyBjaGFuZ2VkJyk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuLy9pbXBvcnQge1J4fSBmcm9tICdyeGpzL1J4JztcclxuaW1wb3J0IHtDaGlsZENvbXBvbmVudH0gZnJvbSAnLi9jaGlsZC5jb21wb25lbnQnO1xyXG5pbXBvcnQge0h0dHB9IGZyb20gXCJhbmd1bGFyMi9odHRwXCI7XHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAnbXktcGFyZW50JyxcclxuXHR0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiAoY2xpY2spPVwiY2hhbmdlUGVyc29uKClcIj5DaGFuZ2UgUGVyc29uPC9idXR0b24+XHJcblx0XHQ8bXktY2hpbGQgW3BlcnNvbl09XCJwZXJzb25cIj48L215LWNoaWxkPlxyXG4gICAgICAgPGgzPjFzdCBMaXN0PC9oMz4gXHJcbiAgICAgICAgPHVsPlxyXG4gICAgICA8bGkgKm5nRm9yPVwiI2FjdGl2aXR5IG9mIGFjdGl2aXRpZXMgfCBhc3luY1wiPnt7YWN0aXZpdHkubmFtZX19PC9saT5cclxuICAgIDwvdWw+XHJcbiAgICA8aDM+Mm5kIExpc3Q8L2gzPlxyXG4gICAgICAgIDx1bD5cclxuICAgICAgPGxpICpuZ0Zvcj1cIiNhY3Rpdml0eSBvZiBhY3Rpdml0aWVzMiB8IGFzeW5jXCI+e3thY3Rpdml0eS5uYW1lfX08L2xpPlxyXG4gICAgPC91bD5cclxuXHRgLFxyXG4gICAgZGlyZWN0aXZlczogW0NoaWxkQ29tcG9uZW50XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFyZW50Q29tcG9uZW50IHtcclxuXHRwZXJzb246IGFueTtcclxuICAgIC8vcHJvZmVzc2lvbjogc3RyaW5nO1xyXG4gICAgYWN0aXZpdGllczogT2JzZXJ2YWJsZTxBcnJheTxhbnk+PjtcclxuICAgIGFjdGl2aXRpZXMyOiBPYnNlcnZhYmxlPEFycmF5PGFueT4+O1xyXG5cdGNvbnN0cnVjdG9yKGh0dHA6IEh0dHApIHtcclxuXHRcdHRoaXMucGVyc29uID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnSnVyaSdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGh0dHAuZ2V0KCdhY3Rpdml0aWVzLmpzb24nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpLmFjdGl2aXR5SXRlbXMpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNoYXJlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8ucHVibGlzaExhc3QoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vLnJlZkNvdW50KCk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmFjdGl2aXRpZXMyID0gdGhpcy5hY3Rpdml0aWVzLCA1MDApO1xyXG4gICAgICAgIC8vdGhpcy5wcm9mZXNzaW9uID0gJ0VuZ2luZWVyJztcclxuICAgICAgICAvL2h0dHA6Ly9ibG9nLnRob3VnaHRyYW0uaW8vYW5ndWxhci8yMDE2LzA2LzE2L2NvbGQtdnMtaG90LW9ic2VydmFibGVzLmh0bWxcclxuXHR9XHJcbiAgICBjaGFuZ2VQZXJzb24oKSB7XHJcbiAgICAgICAgdGhpcy5wZXJzb24ubmFtZSA9IFwiVGhvbWFzXCI7XHJcbiAgICB9XHJcbiAgICAvKmxldCBvYnMgPSBcclxuICAgIE9ic2VydmFibGVcclxuICAgICAgICAgICAgLmludGVydmFsKDEwMDApXHJcbiAgICAgICAgICAgIC5wdWJsaXNoKCk7XHJcbiAgICBvYnMuY29ubmVjdCgpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgb2JzLnN1YnNjcmliZSh2ID0+IGNvbnNvbGUubG9nKFwiU3Vic2NyaWJlciMgMTogXCIgKyB2KSk7XHJcbiAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICgpID0+IG9icy5zdWJzY3JpYmUodiA9PiBjb25zb2xlLmxvZyhcIlN1YnNjcmliZXIjIDI6IFwiICsgdikpLCAxMDAwKTtcclxuXHJcbiAgICB9LDIxMDApOyovXHJcblxyXG5cclxuLypsZXQgb2JzID0gT2JzZXJ2YWJsZS5jcmVhdGUob2JzZXJ2ZXIgPT4gb2JzZXJ2ZXIubmV4dChEYXRlLm5vdygpKSk7XHJcbm9icy5zdWJzY3JpYmUodiA9PiBjb25zb2xlLmxvZyhcIlN1YnNjcmliZXIjIDE6IFwiICsgdikpO1xyXG5vYnMuc3Vic2NyaWJlKHYgPT4gY29uc29sZS5sb2coXCJTdWJzY3JpYmVyIyAyOiBcIiArIHYpKTtcclxuLy9vYnMuY29ubmVjdCgpOyovXHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1JvdXRlQ29uZmlnLCBST1VURVJfRElSRUNUSVZFU30gZnJvbSAnYW5ndWxhcjIvcm91dGVyJztcbmltcG9ydCB7TWVzc2FnZXNDb21wb25lbnR9IGZyb20gJy4vbWVzc2FnZXMvbWVzc2FnZXMuY29tcG9uZW50JztcbmltcG9ydCB7SGVhZGVyQ29tcG9uZW50fSBmcm9tICcuL2hlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHtBdXRoZW50aWNhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9hdXRoL2F1dGhlbnRpY2F0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQge1NlYXJjaENvbXBvbmVudH0gZnJvbSAnLi9zZWFyY2gvc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQge1dvcmtsaXN0Q29tcG9uZW50fSBmcm9tICcuL3dvcmtsaXN0L3dvcmtsaXN0LmNvbXBvbmVudCc7XG5pbXBvcnQge0NhcnRDb21wb25lbnR9IGZyb20gJy4vY2FydGJhZGdlL2NhcnQuY29tcG9uZW50JztcbmltcG9ydCB7UGFyZW50Q29tcG9uZW50fSBmcm9tICcuL2NoYW5nZWRldGVjdC9wYXJlbnQuY29tcG9uZW50JztcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktYXBwJyxcbiAgICB0ZW1wbGF0ZTogYCAgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxteS1oZWFkZXI+PC9teS1oZWFkZXI+XG4gICAgICAgICAgICA8cm91dGVyLW91dGxldD48L3JvdXRlci1vdXRsZXQ+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgZGlyZWN0aXZlczogW01lc3NhZ2VzQ29tcG9uZW50LCBST1VURVJfRElSRUNUSVZFUywgSGVhZGVyQ29tcG9uZW50XVxufSlcbkBSb3V0ZUNvbmZpZyhbXG4gICAge3BhdGg6ICcvJywgbmFtZTogJ01lc3NhZ2VzJywgY29tcG9uZW50OiBNZXNzYWdlc0NvbXBvbmVudCwgdXNlQXNEZWZhdWx0OiB0cnVlfSxcbiAgICB7cGF0aDogJy9hdXRoLy4uLicsIG5hbWU6ICdBdXRoJywgY29tcG9uZW50OiBBdXRoZW50aWNhdGlvbkNvbXBvbmVudH0sXG4gICAge3BhdGg6ICcvc2VhcmNoJywgbmFtZTogJ1NlYXJjaCcsIGNvbXBvbmVudDogU2VhcmNoQ29tcG9uZW50fSxcbiAgICB7cGF0aDogJy9hY3Rpdml0eScsIG5hbWU6ICdXb3JrbGlzdCcsIGNvbXBvbmVudDogV29ya2xpc3RDb21wb25lbnR9LFxuICAgIHtwYXRoOiAnL2NhcnQnLCBuYW1lOiAnQ2FydCcsIGNvbXBvbmVudDogQ2FydENvbXBvbmVudH0sXG4gICAge3BhdGg6ICcvY2hhbmdlJywgbmFtZTogJ0NoYW5nZScsIGNvbXBvbmVudDogUGFyZW50Q29tcG9uZW50fVxuXSlcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgIFxuICAgIG1lc3NhZ2UgPSBcIkEgbWVzc2FnZVwiO1xuXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIyL3R5cGluZ3MvYnJvd3Nlci5kLnRzXCIvPlxuaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xuaW1wb3J0IHtBcHBDb21wb25lbnR9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4vbWVzc2FnZXMvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHtBY3Rpdml0eVNlcnZpY2V9IGZyb20gJy4vd29ya2xpc3Qvd29ya2xpc3Quc2VydmljZSc7XG5pbXBvcnQge1JPVVRFUl9QUk9WSURFUlMsIExvY2F0aW9uU3RyYXRlZ3ksIEhhc2hMb2NhdGlvblN0cmF0ZWd5fSBmcm9tIFwiYW5ndWxhcjIvcm91dGVyXCI7XG5pbXBvcnQge0hUVFBfUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9odHRwJztcbmltcG9ydCB7cHJvdmlkZX0gZnJvbSBcImFuZ3VsYXIyL2NvcmVcIjtcblxuYm9vdHN0cmFwKEFwcENvbXBvbmVudCwgW0FjdGl2aXR5U2VydmljZSwgQXV0aFNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlLCBIVFRQX1BST1ZJREVSUywgUk9VVEVSX1BST1ZJREVSUywgXG5wcm92aWRlKExvY2F0aW9uU3RyYXRlZ3ksIHt1c2VDbGFzczogSGFzaExvY2F0aW9uU3RyYXRlZ3l9KV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
