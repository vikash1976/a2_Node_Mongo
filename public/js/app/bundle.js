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
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
                ], MessageService);
                return MessageService;
                var _a;
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
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_2.Http !== 'undefined' && http_2.Http) === 'function' && _a) || Object])
                ], AuthService);
                return AuthService;
                var _a;
            }());
            exports_9("AuthService", AuthService);
        }
    }
});
System.register("errors/error", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var Error;
    return {
        setters:[],
        execute: function() {
            Error = (function () {
                function Error(title, message) {
                    this.title = title;
                    this.message = message;
                }
                return Error;
            }());
            exports_10("Error", Error);
        }
    }
});
System.register("errors/error.service", ["angular2/core", "errors/error"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_8, error_1;
    var ErrorService;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            },
            function (error_1_1) {
                error_1 = error_1_1;
            }],
        execute: function() {
            ErrorService = (function () {
                function ErrorService() {
                    this.errorOccurred = new core_8.EventEmitter();
                }
                ErrorService.prototype.handleError = function (error) {
                    var errorData = new error_1.Error(error.title, error.error.message);
                    this.errorOccurred.emit(errorData);
                };
                return ErrorService;
            }());
            exports_11("ErrorService", ErrorService);
        }
    }
});
System.register("auth/signup.component", ['angular2/core', 'angular2/common', "auth/auth.service", "errors/error.service", "auth/user"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_9, common_1, auth_service_1, error_service_1, user_1;
    var SignupComponent;
    return {
        setters:[
            function (core_9_1) {
                core_9 = core_9_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            },
            function (error_service_1_1) {
                error_service_1 = error_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            SignupComponent = (function () {
                function SignupComponent(_fb, _authService, _errorService) {
                    this._fb = _fb;
                    this._authService = _authService;
                    this._errorService = _errorService;
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
                    var _this = this;
                    var user = new user_1.User(this.myForm.value.email, this.myForm.value.password, this.myForm.value.firstName, this.myForm.value.lastName);
                    console.log("User is--: ", user);
                    this._authService.signup(user)
                        .subscribe(function (data) {
                        console.log(data);
                        //this._messageService.messages.push(data);
                    }, function (error) { return _this._errorService.handleError(error); });
                };
                SignupComponent.prototype.isEmail = function (control) {
                    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
                        return { 'invalidMail': true };
                    }
                };
                ;
                SignupComponent = __decorate([
                    core_9.Component({
                        selector: 'my-signup',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form [ngFormModel]=\"myForm\" (ngSubmit)=\"onSubmit()\">\n                <div class=\"form-group\">\n                    <lable for=\"firstName\">First Name</lable>\n                        <input [ngFormControl]=\"myForm.find('firstName')\" type=\"text\" id=\"firstName\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"lastName\">Last Name</lable>\n                        <input [ngFormControl]=\"myForm.find('lastName')\" type=\"text\" id=\"lastName\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"email\">Mail</lable>\n                        <input [ngFormControl]=\"myForm.find('email')\" type=\"email\" id=\"email\" class=\"form-control\">\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"password\">Password</lable>\n                        <input [ngFormControl]=\"myForm.find('password')\" type=\"password\" id=\"password\" class=\"form-control\">\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!myForm.valid\">Sign Up</button>\n        </form>\n    </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof common_1.FormBuilder !== 'undefined' && common_1.FormBuilder) === 'function' && _a) || Object, auth_service_1.AuthService, error_service_1.ErrorService])
                ], SignupComponent);
                return SignupComponent;
                var _a;
            }());
            exports_12("SignupComponent", SignupComponent);
        }
    }
});
System.register("auth/signin.component", ['angular2/core', "auth/auth.service", "auth/user", 'angular2/router', "errors/error.service"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var core_10, auth_service_2, user_2, router_2, error_service_2;
    var SigninComponent;
    return {
        setters:[
            function (core_10_1) {
                core_10 = core_10_1;
            },
            function (auth_service_2_1) {
                auth_service_2 = auth_service_2_1;
            },
            function (user_2_1) {
                user_2 = user_2_1;
            },
            function (router_2_1) {
                router_2 = router_2_1;
            },
            function (error_service_2_1) {
                error_service_2 = error_service_2_1;
            }],
        execute: function() {
            SigninComponent = (function () {
                function SigninComponent(_authService, _errorService, _router) {
                    this._authService = _authService;
                    this._errorService = _errorService;
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
                    }, function (error) { return _this._errorService.handleError(error); });
                };
                SigninComponent = __decorate([
                    core_10.Component({
                        selector: 'my-signin',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <form  (ngSubmit)=\"onSubmit(f.value)\" #f=\"ngForm\">\n                \n                <div class=\"form-group\">\n                    <lable for=\"email\">Mail</lable>\n                        <input ngControl=\"email\" type=\"email\" id=\"email\" class=\"form-control\" required>\n                </div>\n                <div class=\"form-group\">\n                    <lable for=\"password\">Password</lable>\n                        <input ngControl=\"password\" type=\"password\" id=\"password\" class=\"form-control\" required>\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\" [disabled]=\"!f.valid\">Sign In</button>\n        </form>\n    </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [auth_service_2.AuthService, error_service_2.ErrorService, (typeof (_a = typeof router_2.Router !== 'undefined' && router_2.Router) === 'function' && _a) || Object])
                ], SigninComponent);
                return SigninComponent;
                var _a;
            }());
            exports_13("SigninComponent", SigninComponent);
        }
    }
});
System.register("errors/error.component", ["angular2/core", "errors/error.service"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var core_11, error_service_3;
    var ErrorComponent;
    return {
        setters:[
            function (core_11_1) {
                core_11 = core_11_1;
            },
            function (error_service_3_1) {
                error_service_3 = error_service_3_1;
            }],
        execute: function() {
            ErrorComponent = (function () {
                function ErrorComponent(_errorService) {
                    this._errorService = _errorService;
                    this.errorDisplay = 'none';
                }
                ErrorComponent.prototype.onErrorHandled = function () {
                    this.errorDisplay = 'none';
                };
                ErrorComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._errorService.errorOccurred.subscribe(function (errorData) {
                        _this.errorData = errorData;
                        _this.errorDisplay = 'block';
                    });
                };
                ErrorComponent = __decorate([
                    core_11.Component({
                        selector: 'my-error',
                        template: "\n        <div class=\"backdrop\" [ngStyle]=\"{'display': errorDisplay}\"></div>\n        <div class=\"modal\" tabindex=\"-1\" role=\"dialog\" [ngStyle]=\"{'display': errorDisplay}\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"onErrorHandled()\"><span aria-hidden=\"true\">&times;</span></button>\n                        <h4 class=\"modal-title\">{{errorData?.title}}</h4>\n                    </div>\n                    <div class=\"modal-body\">\n                     <p>{{errorData?.message}}</p>\n                    </div>\n                    <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-default\" (click)=\"onErrorHandled()\">Close</button>\n                    </div>\n                </div><!-- /.modal-content -->\n            </div><!-- /.modal-dialog -->\n        </div><!-- /.modal -->  \n    ",
                        styles: ["\n        .backdrop {\n            background-color: rgba(0,0,0,0.6);\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100vh;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [error_service_3.ErrorService])
                ], ErrorComponent);
                return ErrorComponent;
            }());
            exports_14("ErrorComponent", ErrorComponent);
        }
    }
});
System.register("auth/logout.component", ['angular2/core', "auth/auth.service", 'angular2/router'], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var core_12, auth_service_3, router_3;
    var LogoutComponent;
    return {
        setters:[
            function (core_12_1) {
                core_12 = core_12_1;
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
                    core_12.Component({
                        selector: 'my-logout',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <button class=\"btn btn-danger\" (click)=\"onLogout()\">Logout</button>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [auth_service_3.AuthService, (typeof (_a = typeof router_3.Router !== 'undefined' && router_3.Router) === 'function' && _a) || Object])
                ], LogoutComponent);
                return LogoutComponent;
                var _a;
            }());
            exports_15("LogoutComponent", LogoutComponent);
        }
    }
});
System.register("auth/authentication.component", ['angular2/core', "auth/signup.component", "auth/signin.component", "auth/auth.service", "errors/error.component", "auth/logout.component", 'angular2/router'], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var core_13, signup_component_1, signin_component_1, auth_service_4, error_component_1, logout_component_1, router_4;
    var AuthenticationComponent;
    return {
        setters:[
            function (core_13_1) {
                core_13 = core_13_1;
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
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
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
                    core_13.Component({
                        selector: 'my-auth',
                        template: "\n        <header class=\"row spacing\">\n            <nav class=\"col-md-8 col-md-offset-2\">\n                <ul class=\"nav nav-tabs\">\n                    <li><a [routerLink]=\"['Signup']\">Signup</a></li>\n                    <li><a [routerLink]=\"['Signin']\" *ngIf=\"! isLoggedIn()\">Signin</a></li>\n                    <li><a [routerLink]=\"['Logout']\" *ngIf=\"isLoggedIn()\">Logout</a></li>\n                </ul>\n            </nav>\n        </header>\n        <div class=\"row spacing\">\n            <router-outlet></router-outlet>\n        </div>\n        <my-error></my-error>\n    ",
                        directives: [signup_component_1.SignupComponent, signin_component_1.SigninComponent, logout_component_1.LogoutComponent, router_4.ROUTER_DIRECTIVES, error_component_1.ErrorComponent],
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
            exports_16("AuthenticationComponent", AuthenticationComponent);
        }
    }
});
System.register("search/search.results.component", ['angular2/common', 'angular2/core', "rxjs/Observable"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var common_2, core_14, Observable_3;
    var SearchResultsComponent;
    return {
        setters:[
            function (common_2_1) {
                common_2 = common_2_1;
            },
            function (core_14_1) {
                core_14 = core_14_1;
            },
            function (Observable_3_1) {
                Observable_3 = Observable_3_1;
            }],
        execute: function() {
            SearchResultsComponent = (function () {
                function SearchResultsComponent() {
                    var _this = this;
                    this.searchEvent = new core_14.EventEmitter();
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
                    core_14.Input(), 
                    __metadata('design:type', Observable_3.Observable)
                ], SearchResultsComponent.prototype, "results", void 0);
                __decorate([
                    core_14.Input(), 
                    __metadata('design:type', Observable_3.Observable)
                ], SearchResultsComponent.prototype, "counter", void 0);
                __decorate([
                    core_14.Output(), 
                    __metadata('design:type', (typeof (_a = typeof core_14.EventEmitter !== 'undefined' && core_14.EventEmitter) === 'function' && _a) || Object)
                ], SearchResultsComponent.prototype, "searchEvent", void 0);
                SearchResultsComponent = __decorate([
                    core_14.Component({
                        selector: 'my-search',
                        directives: [common_2.FORM_DIRECTIVES],
                        template: "\n    <h1>Search</h1>\n    <input class=\"form-control\"\n      [ngFormControl]=\"searchBox\" \n      placeholder=\"Search artist\" />\n      <h3>Searched: {{searchCount}} times</h3>\n      \n    <div *ngFor=\"#books of results | async\">\n      <section class=\"panel panel-default\">\n        <div class=\"panel-body\">\n          <div class=\"col col-md-6\">{{ books.volumeInfo.title }}</div>\n          <div class=\"col col-md-4\">{{ books.volumeInfo.publisher }}</div>\n        </div>\n      </section>\n      \n    </div>\n  "
                    }), 
                    __metadata('design:paramtypes', [])
                ], SearchResultsComponent);
                return SearchResultsComponent;
                var _a;
            }());
            exports_17("SearchResultsComponent", SearchResultsComponent);
        }
    }
});
System.register("search/search.component", ['angular2/http', 'angular2/core', 'rxjs/Rx', 'rxjs/Observable', "search/search.results.component"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var http_3, core_15, Observable_4, search_results_component_1;
    var SearchComponent;
    return {
        setters:[
            function (http_3_1) {
                http_3 = http_3_1;
            },
            function (core_15_1) {
                core_15 = core_15_1;
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
                    core_15.Component({
                        selector: 'app-root',
                        directives: [search_results_component_1.SearchResultsComponent],
                        template: "\n\t\t<my-search (searchEvent)=\"onSearch($event)\" [results]=\"data\" [counter]=\"counter\"></my-search>\n\t\t\n\t"
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_3.Http !== 'undefined' && http_3.Http) === 'function' && _a) || Object])
                ], SearchComponent);
                return SearchComponent;
                var _a;
            }());
            exports_18("SearchComponent", SearchComponent);
        }
    }
});
System.register("worklist/activity", [], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
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
            exports_19("Activity", Activity);
        }
    }
});
System.register("worklist/worklist.service", ['angular2/core', 'angular2/http', 'rxjs/Subject'], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var core_16, http_4, Subject_1;
    var ActivityService;
    return {
        setters:[
            function (core_16_1) {
                core_16 = core_16_1;
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
                    core_16.Injectable(), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_4.Http !== 'undefined' && http_4.Http) === 'function' && _a) || Object])
                ], ActivityService);
                return ActivityService;
                var _a;
            }());
            exports_20("ActivityService", ActivityService);
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
System.register("worklist/another.worklist.component", ['angular2/core', "worklist/worklist.service", 'rxjs/Rx'], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var core_17, worklist_service_1;
    var AnotherWorklistComponent;
    return {
        setters:[
            function (core_17_1) {
                core_17 = core_17_1;
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
                    core_17.Component({
                        selector: 'another-my-worklist',
                        template: "\n             <h4>Normal Priority Tasks - {{normalPrioQueue}}</h4>\n             <article class=\"panel panel-default  activity-box\">\n                <div class=\"panel-body normal-priority\"  *ngFor=\"#activity of anotherActivities$ | async\" >\n                {{activity.value}}\n                </div>\n             </article>\n                \n    "
                    }), 
                    __metadata('design:paramtypes', [worklist_service_1.ActivityService])
                ], AnotherWorklistComponent);
                return AnotherWorklistComponent;
            }());
            exports_21("AnotherWorklistComponent", AnotherWorklistComponent);
        }
    }
});
System.register("worklist/worklist.add.component", ['angular2/core', "worklist/worklist.service", "worklist/activity"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var core_18, worklist_service_2, activity_1;
    var WorklistAddComponent;
    return {
        setters:[
            function (core_18_1) {
                core_18 = core_18_1;
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
                    core_18.Component({
                        selector: 'my-worklist-add',
                        template: "\n       \n            <form (ngSubmit)=\"onSubmit(f.value)\" #f=\"ngForm\">\n                    <div class=\"form-group\">\n                        <label for=\"value\">Activity</label>\n                        <input ngControl=\"value\" type=\"text\" class=\"form-control\" id=\"value\">\n                        <label for=\"priority\">Priority</label>\n                        <input ngControl=\"priority\" type=\"number\" class=\"form-control\" id=\"priority\">\n                    </div>\n                    <button type=\"submit\" class=\"btn btn-primary spacing\">Add Activity</button>\n                    \n                </form>\n           \n    "
                    }), 
                    __metadata('design:paramtypes', [worklist_service_2.ActivityService])
                ], WorklistAddComponent);
                return WorklistAddComponent;
            }());
            exports_22("WorklistAddComponent", WorklistAddComponent);
        }
    }
});
System.register("worklist/worklist.component", ['angular2/core', "worklist/worklist.service", "worklist/activity", 'rxjs/Rx', "worklist/another.worklist.component", "worklist/worklist.add.component"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var core_19, worklist_service_3, activity_2, another_worklist_component_1, worklist_add_component_1;
    var WorklistComponent;
    return {
        setters:[
            function (core_19_1) {
                core_19 = core_19_1;
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
                    core_19.Component({
                        selector: 'my-worklist',
                        template: "\n        <section class=\"col-md-8 col-md-offset-2\">\n            <my-worklist-add></my-worklist-add>\n            <div class=\"row\" >\n                <div class=\"col-md-4\">\n                    <h4>High Priority Tasks - {{highPrioQueue}}</h4>\n                        <article class=\"panel panel-default  activity-box\">\n                        \n                            <div class=\"panel-body high-priority\"  *ngFor=\"#activity of activities$ | async\" >\n                                {{activity.value}}</div>\n                        </article> \n                 </div>\n                 <div class=\"col-md-4 col-md-offset-4\">    \n                        <another-my-worklist></another-my-worklist>\n                 </div>\n                \n           </div>\n            </section>\n    ",
                        directives: [another_worklist_component_1.AnotherWorklistComponent, worklist_add_component_1.WorklistAddComponent]
                    }), 
                    __metadata('design:paramtypes', [worklist_service_3.ActivityService])
                ], WorklistComponent);
                return WorklistComponent;
            }());
            exports_23("WorklistComponent", WorklistComponent);
        }
    }
});
System.register("cartbadge/master.comment", [], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
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
            exports_24("MasterComponent", MasterComponent);
        }
    }
});
System.register("cartbadge/cart.badge.component", ['angular2/core', "rxjs/Observable", "cartbadge/master.comment"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var core_20, Observable_5, master_comment_1;
    var CartBadgeComponent;
    return {
        setters:[
            function (core_20_1) {
                core_20 = core_20_1;
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
                    core_20.Input(), 
                    __metadata('design:type', Observable_5.Observable)
                ], CartBadgeComponent.prototype, "itemAddStream", void 0);
                CartBadgeComponent = __decorate([
                    core_20.Component({
                        selector: 'my-cart-badge',
                        template: "\n  <div style=\"border: 1px solid black;padding: 5px;\">\n        <div class=\"alert alert-info\">\n            {{message}}\n        </div>\n        <div><strong>{{lastUpdated()}}</strong></div>\n        <h3>The Cart Badge</h3>\n        <h4>Items in your cart : {{counter}}</h4>\n    \n    </div>\n     \n  ",
                        changeDetection: core_20.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof core_20.ChangeDetectorRef !== 'undefined' && core_20.ChangeDetectorRef) === 'function' && _a) || Object])
                ], CartBadgeComponent);
                return CartBadgeComponent;
                var _a;
            }(master_comment_1.MasterComponent));
            exports_25("CartBadgeComponent", CartBadgeComponent);
        }
    }
});
System.register("cartbadge/child.component.section", ['angular2/core', "cartbadge/master.comment"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var core_21, master_comment_2;
    var ChildComponentSection1, ChildComponentSection2;
    return {
        setters:[
            function (core_21_1) {
                core_21 = core_21_1;
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
                    core_21.Component({
                        //moduleId: module.id,
                        template: "\n    <div style=\"border: 1px solid black;padding: 5px;\">\n        <div class=\"alert alert-success\">\n            {{message}}\n        </div>\n        <div><strong>{{lastUpdated()}}</strong></div>\n        <div>\n            <button class=\"btn btn-primary\" (click)=\"updateMe()\">Update Me</button>\n        </div>\n        \n    </div>\n",
                        selector: 'child-section-1',
                        changeDetection: core_21.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [])
                ], ChildComponentSection1);
                return ChildComponentSection1;
            }(master_comment_2.MasterComponent));
            exports_26("ChildComponentSection1", ChildComponentSection1);
            ChildComponentSection2 = (function (_super) {
                __extends(ChildComponentSection2, _super);
                function ChildComponentSection2() {
                    _super.call(this);
                    this.message = 'Using ChangeDetectionStrategy.Default, getting update for any change to any component on the page, i participate in each change detection cycle regardless of who initiated it.';
                }
                ChildComponentSection2 = __decorate([
                    core_21.Component({
                        //moduleId: __moduleName,
                        template: "\n    <div style=\"border: 1px solid black;padding: 5px;\">\n        <div class=\"alert alert-success\">\n            {{message}}\n        </div>\n        <div><strong>{{lastUpdated()}}</strong></div>\n        <div>\n            <button class=\"btn btn-primary\" (click)=\"updateMe()\">Update Me</button>\n        </div>\n        \n    </div>\n",
                        selector: 'child-section-2',
                        changeDetection: core_21.ChangeDetectionStrategy.Default
                    }), 
                    __metadata('design:paramtypes', [])
                ], ChildComponentSection2);
                return ChildComponentSection2;
            }(master_comment_2.MasterComponent));
            exports_26("ChildComponentSection2", ChildComponentSection2);
        }
    }
});
System.register("cartbadge/cart.component", ['angular2/core', "rxjs/Observable", "cartbadge/cart.badge.component", "cartbadge/child.component.section"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var core_22, Observable_6, cart_badge_component_1, child_component_section_1;
    var CartComponent;
    return {
        setters:[
            function (core_22_1) {
                core_22 = core_22_1;
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
                    core_22.Component({
                        selector: 'my-cart',
                        template: "<div class=\"panel-body\">\n                <h3>Pick Items from here...</h3>\n                <button class=\"btn btn-primary\" (click)=\"onAddToCart()\">Add to Cart</button>\n              </div>\n            <my-cart-badge [itemAddStream]=\"counter\"></my-cart-badge>\n            <child-section-1></child-section-1>\n            <child-section-2></child-section-2>\n  ",
                        directives: [cart_badge_component_1.CartBadgeComponent, child_component_section_1.ChildComponentSection1, child_component_section_1.ChildComponentSection2],
                    }), 
                    __metadata('design:paramtypes', [])
                ], CartComponent);
                return CartComponent;
            }());
            exports_27("CartComponent", CartComponent);
        }
    }
});
System.register("changedetect/child.component", ['angular2/core'], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var core_23;
    var ChildComponent;
    return {
        setters:[
            function (core_23_1) {
                core_23 = core_23_1;
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
                    core_23.Input(), 
                    __metadata('design:type', Object)
                ], ChildComponent.prototype, "person", void 0);
                ChildComponent = __decorate([
                    core_23.Component({
                        selector: 'my-child',
                        template: "\n\t\t<h2>Child component</h2>\n\t\t{{ person.name }}\n\t"
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof core_23.KeyValueDiffers !== 'undefined' && core_23.KeyValueDiffers) === 'function' && _a) || Object])
                ], ChildComponent);
                return ChildComponent;
                var _a;
            }());
            exports_28("ChildComponent", ChildComponent);
        }
    }
});
System.register("changedetect/parent.component", ['angular2/core', "changedetect/child.component", "angular2/http"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var core_24, child_component_1, http_5;
    var ParentComponent;
    return {
        setters:[
            function (core_24_1) {
                core_24 = core_24_1;
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
                    core_24.Component({
                        selector: 'my-parent',
                        template: "\n        <button class=\"btn btn-primary\" (click)=\"changePerson()\">Change Person</button>\n\t\t<my-child [person]=\"person\"></my-child>\n       <h3>1st List</h3> \n        <ul>\n      <li *ngFor=\"#activity of activities | async\">{{activity.name}}</li>\n    </ul>\n    <h3>2nd List</h3>\n        <ul>\n      <li *ngFor=\"#activity of activities2 | async\">{{activity.name}}</li>\n    </ul>\n\t",
                        directives: [child_component_1.ChildComponent]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_5.Http !== 'undefined' && http_5.Http) === 'function' && _a) || Object])
                ], ParentComponent);
                return ParentComponent;
                var _a;
            }());
            exports_29("ParentComponent", ParentComponent);
        }
    }
});
System.register("app.component", ['angular2/core', 'angular2/router', "messages/messages.component", "header.component", "auth/authentication.component", "search/search.component", "worklist/worklist.component", "cartbadge/cart.component", "changedetect/parent.component"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var core_25, router_5, messages_component_1, header_component_1, authentication_component_1, search_component_1, worklist_component_1, cart_component_1, parent_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_25_1) {
                core_25 = core_25_1;
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
                    core_25.Component({
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
            exports_30("AppComponent", AppComponent);
        }
    }
});
System.register("boot", ['angular2/platform/browser', "app.component", "messages/message.service", "auth/auth.service", "worklist/worklist.service", "angular2/router", 'angular2/http', "angular2/core", "errors/error.service"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var browser_1, app_component_1, message_service_4, auth_service_5, worklist_service_4, router_6, http_6, core_26, error_service_4;
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
            function (core_26_1) {
                core_26 = core_26_1;
            },
            function (error_service_4_1) {
                error_service_4 = error_service_4_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [worklist_service_4.ActivityService, auth_service_5.AuthService, error_service_4.ErrorService, message_service_4.MessageService, http_6.HTTP_PROVIDERS, router_6.ROUTER_PROVIDERS,
                core_26.provide(router_6.LocationStrategy, { useClass: router_6.HashLocationStrategy })]);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc3NhZ2VzL21lc3NhZ2UudHMiLCJtZXNzYWdlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJtZXNzYWdlcy9tZXNzYWdlLWlucHV0LmNvbXBvbmVudC50cyIsIm1lc3NhZ2VzL21lc3NhZ2UuY29tcG9uZW50LnRzIiwibWVzc2FnZXMvbWVzc2FnZS1saXN0LmNvbXBvbmVudC50cyIsIm1lc3NhZ2VzL21lc3NhZ2VzLmNvbXBvbmVudC50cyIsImhlYWRlci5jb21wb25lbnQudHMiLCJhdXRoL3VzZXIudHMiLCJhdXRoL2F1dGguc2VydmljZS50cyIsImVycm9ycy9lcnJvci50cyIsImVycm9ycy9lcnJvci5zZXJ2aWNlLnRzIiwiYXV0aC9zaWdudXAuY29tcG9uZW50LnRzIiwiYXV0aC9zaWduaW4uY29tcG9uZW50LnRzIiwiZXJyb3JzL2Vycm9yLmNvbXBvbmVudC50cyIsImF1dGgvbG9nb3V0LmNvbXBvbmVudC50cyIsImF1dGgvYXV0aGVudGljYXRpb24uY29tcG9uZW50LnRzIiwic2VhcmNoL3NlYXJjaC5yZXN1bHRzLmNvbXBvbmVudC50cyIsInNlYXJjaC9zZWFyY2guY29tcG9uZW50LnRzIiwid29ya2xpc3QvYWN0aXZpdHkudHMiLCJ3b3JrbGlzdC93b3JrbGlzdC5zZXJ2aWNlLnRzIiwid29ya2xpc3QvYW5vdGhlci53b3JrbGlzdC5jb21wb25lbnQudHMiLCJ3b3JrbGlzdC93b3JrbGlzdC5hZGQuY29tcG9uZW50LnRzIiwid29ya2xpc3Qvd29ya2xpc3QuY29tcG9uZW50LnRzIiwiY2FydGJhZGdlL21hc3Rlci5jb21tZW50LnRzIiwiY2FydGJhZGdlL2NhcnQuYmFkZ2UuY29tcG9uZW50LnRzIiwiY2FydGJhZGdlL2NoaWxkLmNvbXBvbmVudC5zZWN0aW9uLnRzIiwiY2FydGJhZGdlL2NhcnQuY29tcG9uZW50LnRzIiwiY2hhbmdlZGV0ZWN0L2NoaWxkLmNvbXBvbmVudC50cyIsImNoYW5nZWRldGVjdC9wYXJlbnQuY29tcG9uZW50LnRzIiwi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RUFBRSwwQkFBVyxFQUFFLDRCQUFZLEVBQUUsZ0NBQWMsRUFBRSxxQkFBYyxFQUFFLHlCQUFnQjtnQkFDckgsZUFBTyxDQUFDLHlCQUFnQixFQUFFLEVBQUMsUUFBUSxFQUFFLDZCQUFvQixFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiLi4vLi4vLi4vYTJfTm9kZV9Nb25nby9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgTWVzc2FnZSB7XG4gICAgY29udGVudDogc3RyaW5nO1xuICAgIHVzZXJuYW1lOiBzdHJpbmc7XG4gICAgbWVzc2FnZUlkOiBzdHJpbmc7XG4gICAgdXNlcklkOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvciAoY29udGVudDogc3RyaW5nLCBtZXNzYWdlSWQ/OiBzdHJpbmcsIHVzZXJuYW1lPzogc3RyaW5nLCB1c2VySWQ/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcbiAgICAgICAgdGhpcy5tZXNzYWdlSWQgPSBtZXNzYWdlSWQ7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgICAgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgfVxufSIsImltcG9ydCB7TWVzc2FnZX0gZnJvbSBcIi4vbWVzc2FnZVwiO1xuaW1wb3J0IHtIdHRwLCBIZWFkZXJzfSBmcm9tIFwiYW5ndWxhcjIvaHR0cFwiO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXJ9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG4vL2ltcG9ydCB7Unh9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWVzc2FnZVNlcnZpY2Uge1xuICAgIG1lc3NhZ2VzOiBNZXNzYWdlW10gPSBbXTtcbiAgICBtZXNzYWdlSXNFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcjxNZXNzYWdlPigpO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIF9odHRwOiBIdHRwKSB7fVxuXG4gICAgYWRkTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJNZXNzYWdlIGlzOiBcIiwgbWVzc2FnZSk7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvbWVzc2FnZScsIGJvZHksIHtoZWFkZXJzOiBoZWFkZXJzfSlcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXNwb25zZS5qc29uKCkub2JqO1xuICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoZGF0YS5jb250ZW50LCBkYXRhLl9pZCwgJ0R1bW15JywgbnVsbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpKSk7XG4gICAgfVxuXG4gICAgZ2V0TWVzc2FnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL21lc3NhZ2UnKVxuICAgICAgICAgICAgLm1hcChyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmpzb24oKS5vYmo7XG4gICAgICAgICAgICAgICAgbGV0IG9ianM6IGFueVtdID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoZGF0YVtpXS5jb250ZW50LCBkYXRhW2ldLl9pZCwgJ0R1bW15JywgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIG9ianMucHVzaChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ianM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpKSk7XG4gICAgfVxuXG4gICAgdXBkYXRlTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBhdGNoKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvbWVzc2FnZS8nICsgbWVzc2FnZS5tZXNzYWdlSWQsIGJvZHksIHtoZWFkZXJzOiBoZWFkZXJzfSlcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpKSk7XG4gICAgfVxuXG4gICAgZWRpdE1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VJc0VkaXQuZW1pdChtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBkZWxldGVNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5zcGxpY2UodGhpcy5tZXNzYWdlcy5pbmRleE9mKG1lc3NhZ2UpLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAuZGVsZXRlKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvbWVzc2FnZS8nICsgbWVzc2FnZS5tZXNzYWdlSWQpXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xuICAgIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tIFwiLi9tZXNzYWdlXCI7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tIFwiLi9tZXNzYWdlLnNlcnZpY2VcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktbWVzc2FnZS1pbnB1dCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cbiAgICAgICAgICAgIDxmb3JtIChuZ1N1Ym1pdCk9XCJvblN1Ym1pdChmLnZhbHVlKVwiICNmPVwibmdGb3JtXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNvbnRlbnRcIj5Db250ZW50PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5nQ29udHJvbD1cImNvbnRlbnRcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJjb250ZW50XCIgI2lucHV0IFtuZ01vZGVsXT1cIm1lc3NhZ2U/LmNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPnt7ICFtZXNzYWdlID8gJ1NlbmQgTWVzc2FnZScgOiAnU2F2ZSBNZXNzYWdlJyB9fTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXJcIiAoY2xpY2spPVwib25DYW5jZWwoKVwiICpuZ0lmPVwibWVzc2FnZVwiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdlSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIG1lc3NhZ2U6IE1lc3NhZ2UgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7fVxuXG4gICAgb25TdWJtaXQoZm9ybTphbnkpIHtcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZSkge1xuICAgICAgICAgICAgLy8gRWRpdFxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlLmNvbnRlbnQgPSBmb3JtLmNvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS51cGRhdGVNZXNzYWdlKHRoaXMubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICBkYXRhID0+IGNvbnNvbGUubG9nKGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZTpNZXNzYWdlID0gbmV3IE1lc3NhZ2UoZm9ybS5jb250ZW50LCBudWxsLCAnRHVtbXknKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWVzc2FnZSBpcy0tOiBcIiwgbWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5hZGRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2VzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2FuY2VsKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBudWxsO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5tZXNzYWdlSXNFZGl0LnN1YnNjcmliZShcbiAgICAgICAgICAgIG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG5pbXBvcnQge01lc3NhZ2V9IGZyb20gXCIuL21lc3NhZ2VcIjtcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gXCIuL21lc3NhZ2Uuc2VydmljZVwiO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdteS1tZXNzYWdlJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAge3sgbWVzc2FnZS5jb250ZW50IH19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxmb290ZXIgY2xhc3M9XCJwYW5lbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXV0aG9yXCI+XG4gICAgICAgICAgICAgICAgICAgIHt7IG1lc3NhZ2UudXNlcm5hbWUgfX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29uZmlnXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIChjbGljayk9XCJvbkVkaXQoKVwiPkVkaXQ8L2E+XG4gICAgICAgICAgICAgICAgICAgIDxhIChjbGljayk9XCJvbkRlbGV0ZSgpXCI+RGVsZXRlPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9mb290ZXI+XG4gICAgICAgIDwvYXJ0aWNsZT5cbiAgICBgLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgLmF1dGhvciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICB3aWR0aDogODAlO1xuICAgICAgICB9XG4gICAgICAgIC5jb25maWcge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICB3aWR0aDogMTklO1xuICAgICAgICB9XG4gICAgYF1cbn0pXG5leHBvcnQgY2xhc3MgTWVzc2FnZUNvbXBvbmVudCB7XG4gICAgQElucHV0KCkgbWVzc2FnZTpNZXNzYWdlO1xuICAgIEBPdXRwdXQoKSBlZGl0Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgY29uc3RydWN0b3IgKHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge31cblxuICAgIG9uRWRpdCgpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UuZWRpdE1lc3NhZ2UodGhpcy5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICBvbkRlbGV0ZSgpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UuZGVsZXRlTWVzc2FnZSh0aGlzLm1lc3NhZ2UpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIGRhdGEgPT4gY29uc29sZS5sb2coZGF0YSksXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICk7XG4gICAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG5pbXBvcnQge01lc3NhZ2VDb21wb25lbnR9IGZyb20gXCIuL21lc3NhZ2UuY29tcG9uZW50XCI7XG5pbXBvcnQge01lc3NhZ2V9IGZyb20gXCIuL21lc3NhZ2VcIjtcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gXCIuL21lc3NhZ2Uuc2VydmljZVwiO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdteS1tZXNzYWdlLWxpc3QnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC0yXCI+XG4gICAgICAgICAgICA8bXktbWVzc2FnZSAqbmdGb3I9XCIjbWVzc2FnZSBvZiBtZXNzYWdlc1wiIFttZXNzYWdlXT1cIm1lc3NhZ2VcIiAoZWRpdENsaWNrZWQpPVwibWVzc2FnZS5jb250ZW50ID0gJGV2ZW50XCI+PC9teS1tZXNzYWdlPiAgICAgXG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICBgLFxuICAgIGRpcmVjdGl2ZXM6IFtNZXNzYWdlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdlTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHt9XG5cbiAgICBtZXNzYWdlczogTWVzc2FnZVtdO1xuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLmdldE1lc3NhZ2VzKClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgbWVzc2FnZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgKTtcbiAgICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG5pbXBvcnQge01lc3NhZ2VJbnB1dENvbXBvbmVudH0gZnJvbSBcIi4vbWVzc2FnZS1pbnB1dC5jb21wb25lbnRcIjtcbmltcG9ydCB7TWVzc2FnZUxpc3RDb21wb25lbnR9IGZyb20gXCIuL21lc3NhZ2UtbGlzdC5jb21wb25lbnRcIjtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbXktbWVzc2FnZXMnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgc3BhY2luZ1wiPlxuICAgICAgICAgICAgPG15LW1lc3NhZ2UtaW5wdXQ+PC9teS1tZXNzYWdlLWlucHV0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XG4gICAgICAgICAgICA8bXktbWVzc2FnZS1saXN0PjwvbXktbWVzc2FnZS1saXN0PlxuICAgICAgICA8L2Rpdj4gXG4gICAgYCxcbiAgICBkaXJlY3RpdmVzOiBbTWVzc2FnZUxpc3RDb21wb25lbnQsIE1lc3NhZ2VJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTWVzc2FnZXNDb21wb25lbnQge1xuICAgIFxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge1JPVVRFUl9ESVJFQ1RJVkVTfSBmcm9tIFwiYW5ndWxhcjIvcm91dGVyXCI7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS1oZWFkZXInLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8aGVhZGVyIGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgIDxuYXYgY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtcGlsbHNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgW3JvdXRlckxpbmtdPVwiWydNZXNzYWdlcyddXCI+TWVzc2FnZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgW3JvdXRlckxpbmtdPVwiWydBdXRoJ11cIj5BdXRoZW50aWNhdGlvbjwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ1NlYXJjaCddXCI+U2VhcmNoPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnV29ya2xpc3QnXVwiPldvcmtsaXN0PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnQ2FydCddXCI+Q2FydDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ0NoYW5nZSddXCI+Q2hhbmdlPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L25hdj5cclxuICAgICAgICA8L2hlYWRlcj5cclxuICAgIGAsXHJcbiAgICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdLFxyXG4gICAgc3R5bGVzOiBbYFxyXG4gICAgICAgIGhlYWRlciB7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgdWwge1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyOyAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxpIHtcclxuICAgICAgICAgICAgZmxvYXQ6IG5vbmU7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLnJvdXRlci1saW5rLWFjdGl2ZSwgLm5hdj5saT5hOmZvY3VzIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogIzMzN2FiNztcclxuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgIFxyXG4gICAgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEhlYWRlckNvbXBvbmVudCB7XHJcbiAgICBcclxufSIsImV4cG9ydCBjbGFzcyBVc2VyIHtcclxuICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgZW1haWw6IHN0cmluZywgcHVibGljIHBhc3N3b3JkOiBzdHJpbmcsIHB1YmxpYyBmaXJzdE5hbWU/OiBzdHJpbmcsIHB1YmxpYyBsYXN0TmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkID0gcGFzc3dvcmQ7XHJcbiAgICAgICAgdGhpcy5maXJzdE5hbWUgPSBmaXJzdE5hbWU7XHJcbiAgICAgICAgdGhpcy5sYXN0TmFtZSA9IGxhc3ROYW1lO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7SHR0cCwgSGVhZGVyc30gZnJvbSBcImFuZ3VsYXIyL2h0dHBcIjtcclxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQgJ3J4anMvUngnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcclxuaW1wb3J0IHtVc2VyfSBmcm9tICcuL3VzZXInO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cCkge31cclxuICAgIFxyXG4gICAgc2lnbnVwKHVzZXI6IFVzZXIpIHtcclxuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGlzOiBcIiwgdXNlcik7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXInLCBib2R5LCB7aGVhZGVyczogaGVhZGVyc30pXHJcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmpzb24oKS5vYmo7XHJcbiAgICAgICAgICAgICAgICAvL2xldCBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoZGF0YS5jb250ZW50LCBkYXRhLl9pZCwgJ0R1bW15JywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpKSk7XHJcbiAgICB9XHJcbiAgICBzaWduaW4odXNlcjogVXNlcil7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KHVzZXIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBpczogXCIsIHVzZXIpO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2VyL3NpZ25pbicsIGJvZHksIHtoZWFkZXJzOiBoZWFkZXJzfSlcclxuICAgICAgICAgICAgLm1hcChyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgLy9sZXQgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKGRhdGEuY29udGVudCwgZGF0YS5faWQsICdEdW1teScsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBPYnNlcnZhYmxlLnRocm93KGVycm9yLmpzb24oKSkpO1xyXG4gICAgfVxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgaXNMb2dnZW5kSW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZVsndG9rZW4nXSAhPSBudWxsO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0aXRsZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7fVxyXG59IiwiaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XHJcbmltcG9ydCB7RXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmV4cG9ydCBjbGFzcyBFcnJvclNlcnZpY2Uge1xyXG4gICAgZXJyb3JPY2N1cnJlZD0gbmV3IEV2ZW50RW1pdHRlcjxFcnJvcj4oKTtcclxuICAgIFxyXG4gICAgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSkge1xyXG4gICAgICBjb25zdCBlcnJvckRhdGEgPSBuZXcgRXJyb3IoZXJyb3IudGl0bGUsIGVycm9yLmVycm9yLm1lc3NhZ2UpOyAgXHJcbiAgICAgIHRoaXMuZXJyb3JPY2N1cnJlZC5lbWl0KGVycm9yRGF0YSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtGb3JtQnVpbGRlciwgQ29udHJvbEdyb3VwLCBWYWxpZGF0b3JzLCBDb250cm9sfSBmcm9tICdhbmd1bGFyMi9jb21tb24nO1xyXG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7RXJyb3JTZXJ2aWNlfSBmcm9tICcuLi9lcnJvcnMvZXJyb3Iuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlcn0gZnJvbSAnLi91c2VyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS1zaWdudXAnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwiPlxyXG4gICAgICAgICAgICA8Zm9ybSBbbmdGb3JtTW9kZWxdPVwibXlGb3JtXCIgKG5nU3VibWl0KT1cIm9uU3VibWl0KClcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmxlIGZvcj1cImZpcnN0TmFtZVwiPkZpcnN0IE5hbWU8L2xhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgW25nRm9ybUNvbnRyb2xdPVwibXlGb3JtLmZpbmQoJ2ZpcnN0TmFtZScpXCIgdHlwZT1cInRleHRcIiBpZD1cImZpcnN0TmFtZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmxlIGZvcj1cImxhc3ROYW1lXCI+TGFzdCBOYW1lPC9sYWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IFtuZ0Zvcm1Db250cm9sXT1cIm15Rm9ybS5maW5kKCdsYXN0TmFtZScpXCIgdHlwZT1cInRleHRcIiBpZD1cImxhc3ROYW1lXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFibGUgZm9yPVwiZW1haWxcIj5NYWlsPC9sYWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IFtuZ0Zvcm1Db250cm9sXT1cIm15Rm9ybS5maW5kKCdlbWFpbCcpXCIgdHlwZT1cImVtYWlsXCIgaWQ9XCJlbWFpbFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmxlIGZvcj1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgW25nRm9ybUNvbnRyb2xdPVwibXlGb3JtLmZpbmQoJ3Bhc3N3b3JkJylcIiB0eXBlPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBbZGlzYWJsZWRdPVwiIW15Rm9ybS52YWxpZFwiPlNpZ24gVXA8L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+XHJcbiAgICA8L3NlY3Rpb24+XHJcbiAgICBgXHJcbiAgICBcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZ251cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcclxuICAgIG15Rm9ybTogQ29udHJvbEdyb3VwO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9mYjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgX2F1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSwgcHJpdmF0ZSBfZXJyb3JTZXJ2aWNlOiBFcnJvclNlcnZpY2UpIHt9XHJcbiAgICBuZ09uSW5pdCgpe1xyXG4gICAgICAgIHRoaXMubXlGb3JtID0gdGhpcy5fZmIuZ3JvdXAoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcclxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFtcclxuICAgICAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbWFpbFxyXG4gICAgICAgICAgICAgICAgXSldLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uU3VibWl0KCkge1xyXG4gICAgICAgIGNvbnN0IHVzZXI6VXNlciA9IG5ldyBVc2VyKHRoaXMubXlGb3JtLnZhbHVlLmVtYWlsLCB0aGlzLm15Rm9ybS52YWx1ZS5wYXNzd29yZCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm15Rm9ybS52YWx1ZS5maXJzdE5hbWUsIHRoaXMubXlGb3JtLnZhbHVlLmxhc3ROYW1lKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGlzLS06IFwiLCB1c2VyKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0aFNlcnZpY2Uuc2lnbnVwKHVzZXIpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLl9tZXNzYWdlU2VydmljZS5tZXNzYWdlcy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4gdGhpcy5fZXJyb3JTZXJ2aWNlLmhhbmRsZUVycm9yKGVycm9yKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNFbWFpbChjb250cm9sOiBDb250cm9sKSA6IHtbczogc3RyaW5nXTogYm9vbGVhbn0ge1xyXG4gICAgICAgICBpZiAoIWNvbnRyb2wudmFsdWUubWF0Y2goXCJbYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsnaW52YWxpZE1haWwnOiB0cnVlfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJ9IGZyb20gJy4vdXNlcic7XHJcbmltcG9ydCB7Um91dGVyfSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xyXG5pbXBvcnQge0Vycm9yU2VydmljZX0gZnJvbSAnLi4vZXJyb3JzL2Vycm9yLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ215LXNpZ25pbicsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC0yXCI+XHJcbiAgICAgICAgICAgIDxmb3JtICAobmdTdWJtaXQpPVwib25TdWJtaXQoZi52YWx1ZSlcIiAjZj1cIm5nRm9ybVwiPlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJsZSBmb3I9XCJlbWFpbFwiPk1haWw8L2xhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmdDb250cm9sPVwiZW1haWxcIiB0eXBlPVwiZW1haWxcIiBpZD1cImVtYWlsXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiByZXF1aXJlZD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFibGUgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZDwvbGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZ0NvbnRyb2w9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHJlcXVpcmVkPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIFtkaXNhYmxlZF09XCIhZi52YWxpZFwiPlNpZ24gSW48L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+XHJcbiAgICA8L3NlY3Rpb24+XHJcbiAgICBgXHJcbiAgICBcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZ25pbkNvbXBvbmVudCB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2F1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSAsIHByaXZhdGUgX2Vycm9yU2VydmljZTogRXJyb3JTZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge31cclxuICAgIG9uU3VibWl0KG15Rm9ybTphbnkpIHtcclxuICAgICAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIobXlGb3JtLmVtYWlsLCBteUZvcm0ucGFzc3dvcmQpO1xyXG4gICAgICAgIHRoaXMuX2F1dGhTZXJ2aWNlLnNpZ25pbih1c2VyKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIGRhdGEudG9rZW4pO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcklkJywgZGF0YS51c2VySWQpO1xyXG4gICAgICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGVCeVVybCgnLycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMuX2Vycm9yU2VydmljZS5oYW5kbGVFcnJvcihlcnJvcilcclxuICAgICApO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xyXG5pbXBvcnQge0Vycm9yfSBmcm9tIFwiLi9lcnJvclwiO1xyXG5pbXBvcnQge0Vycm9yU2VydmljZX0gZnJvbSBcIi4vZXJyb3Iuc2VydmljZVwiO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktZXJyb3InLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYmFja2Ryb3BcIiBbbmdTdHlsZV09XCJ7J2Rpc3BsYXknOiBlcnJvckRpc3BsYXl9XCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIiBbbmdTdHlsZV09XCJ7J2Rpc3BsYXknOiBlcnJvckRpc3BsYXl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgKGNsaWNrKT1cIm9uRXJyb3JIYW5kbGVkKClcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPnt7ZXJyb3JEYXRhPy50aXRsZX19PC9oND5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICA8cD57e2Vycm9yRGF0YT8ubWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiAoY2xpY2spPVwib25FcnJvckhhbmRsZWQoKVwiPkNsb3NlPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj48IS0tIC8ubW9kYWwtY29udGVudCAtLT5cclxuICAgICAgICAgICAgPC9kaXY+PCEtLSAvLm1vZGFsLWRpYWxvZyAtLT5cclxuICAgICAgICA8L2Rpdj48IS0tIC8ubW9kYWwgLS0+ICBcclxuICAgIGAsXHJcbiAgICBzdHlsZXM6IFtgXHJcbiAgICAgICAgLmJhY2tkcm9wIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwLjYpO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICAgICAgICAgIHRvcDogMDtcclxuICAgICAgICAgICAgbGVmdDogMDtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgfVxyXG4gICAgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEVycm9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIGVycm9yRGlzcGxheSA9ICdub25lJztcclxuICAgIGVycm9yRGF0YTogRXJyb3I7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHByaXZhdGUgX2Vycm9yU2VydmljZTogRXJyb3JTZXJ2aWNlKSB7fVxyXG5cclxuICAgIG9uRXJyb3JIYW5kbGVkKCkge1xyXG4gICAgICAgIHRoaXMuZXJyb3JEaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yU2VydmljZS5lcnJvck9jY3VycmVkLnN1YnNjcmliZShcclxuICAgICAgICAgIGVycm9yRGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5lcnJvckRhdGEgPSBlcnJvckRhdGE7XHJcbiAgICAgICAgICAgICAgdGhpcy5lcnJvckRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS1sb2dvdXQnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwiPlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXJcIiAoY2xpY2spPVwib25Mb2dvdXQoKVwiPkxvZ291dDwvYnV0dG9uPlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgIGBcclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ291dENvbXBvbmVudHtcclxuICAgY29uc3RydWN0b3IocHJpdmF0ZSBfYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge31cclxuICAgb25Mb2dvdXQoKXtcclxuICAgICAgdGhpcy5fYXV0aFNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbJ1NpZ25pbiddKTtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICB9IFxyXG59IiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge1NpZ251cENvbXBvbmVudH0gZnJvbSAnLi9zaWdudXAuY29tcG9uZW50JztcclxuaW1wb3J0IHtTaWduaW5Db21wb25lbnR9IGZyb20gJy4vc2lnbmluLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHtFcnJvckNvbXBvbmVudH0gZnJvbSAnLi4vZXJyb3JzL2Vycm9yLmNvbXBvbmVudCc7XHJcblxyXG5pbXBvcnQge0xvZ291dENvbXBvbmVudH0gZnJvbSAnLi9sb2dvdXQuY29tcG9uZW50JztcclxuaW1wb3J0IHtSb3V0ZUNvbmZpZywgUk9VVEVSX0RJUkVDVElWRVN9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdteS1hdXRoJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPGhlYWRlciBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XHJcbiAgICAgICAgICAgIDxuYXYgY2xhc3M9XCJjb2wtbWQtOCBjb2wtbWQtb2Zmc2V0LTJcIj5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBbcm91dGVyTGlua109XCJbJ1NpZ251cCddXCI+U2lnbnVwPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnU2lnbmluJ11cIiAqbmdJZj1cIiEgaXNMb2dnZWRJbigpXCI+U2lnbmluPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtyb3V0ZXJMaW5rXT1cIlsnTG9nb3V0J11cIiAqbmdJZj1cImlzTG9nZ2VkSW4oKVwiPkxvZ291dDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBzcGFjaW5nXCI+XHJcbiAgICAgICAgICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8bXktZXJyb3I+PC9teS1lcnJvcj5cclxuICAgIGAsXHJcbiAgICBkaXJlY3RpdmVzOiBbU2lnbnVwQ29tcG9uZW50LCBTaWduaW5Db21wb25lbnQsIExvZ291dENvbXBvbmVudCwgUk9VVEVSX0RJUkVDVElWRVMsIEVycm9yQ29tcG9uZW50XSxcclxuICAgIHN0eWxlczogW2BcclxuICAgICAgICAgLnJvdXRlci1saW5rLWFjdGl2ZSB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNTU1O1xyXG4gICAgICAgICAgICBjdXJzb3I6IGRlZmF1bHQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgIGBdIFxyXG59KVxyXG5AUm91dGVDb25maWcoW1xyXG4gICAge3BhdGg6ICcvc2lnbnVwJywgbmFtZTogJ1NpZ251cCcsIGNvbXBvbmVudDogU2lnbnVwQ29tcG9uZW50LCB1c2VBc0RlZmF1bHQ6IHRydWV9LFxyXG4gICAge3BhdGg6ICcvc2lnbmluJywgbmFtZTogJ1NpZ25pbicsIGNvbXBvbmVudDogU2lnbmluQ29tcG9uZW50fSxcclxuICAgIHtwYXRoOiAnL2xvZ291dCcsIG5hbWU6ICdMb2dvdXQnLCBjb21wb25lbnQ6IExvZ291dENvbXBvbmVudH1cclxuXSlcclxuZXhwb3J0IGNsYXNzIEF1dGhlbnRpY2F0aW9uQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2F1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cclxuICAgIGlzTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dGhTZXJ2aWNlLmlzTG9nZ2VuZEluKCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCB7Q29udHJvbCwgRk9STV9ESVJFQ1RJVkVTfSBmcm9tICdhbmd1bGFyMi9jb21tb24nOyAgXHJcbmltcG9ydCB7Q29tcG9uZW50LCBPdXRwdXQsIElucHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJzsgIFxyXG4vL2ltcG9ydCAncnhqcy9SeCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdteS1zZWFyY2gnLFxyXG4gIGRpcmVjdGl2ZXM6IFtGT1JNX0RJUkVDVElWRVNdLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8aDE+U2VhcmNoPC9oMT5cclxuICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiXHJcbiAgICAgIFtuZ0Zvcm1Db250cm9sXT1cInNlYXJjaEJveFwiIFxyXG4gICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhcnRpc3RcIiAvPlxyXG4gICAgICA8aDM+U2VhcmNoZWQ6IHt7c2VhcmNoQ291bnR9fSB0aW1lczwvaDM+XHJcbiAgICAgIFxyXG4gICAgPGRpdiAqbmdGb3I9XCIjYm9va3Mgb2YgcmVzdWx0cyB8IGFzeW5jXCI+XHJcbiAgICAgIDxzZWN0aW9uIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sIGNvbC1tZC02XCI+e3sgYm9va3Mudm9sdW1lSW5mby50aXRsZSB9fTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBjb2wtbWQtNFwiPnt7IGJvb2tzLnZvbHVtZUluZm8ucHVibGlzaGVyIH19PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgXHJcbiAgICA8L2Rpdj5cclxuICBgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hSZXN1bHRzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQElucHV0KCkgcmVzdWx0czogT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGNvdW50ZXI6IE9ic2VydmFibGU8YW55PjtcclxuICBAT3V0cHV0KCkgc2VhcmNoRXZlbnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIHNlYXJjaENvdW50OiBudW1iZXIgPSAwO1xyXG4gIFxyXG4gIC8vXHJcbiAgc291cmNlID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XHJcbiAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6ODA4MCcpO1xyXG4gIFxyXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIG9ic2VydmVyLm5leHQoZXZlbnQpO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICBhbGVydCgnU2VydmVyIGNsb3NlZCB0aGUgY29ubmVjdGlvbi4uLi4uLi4uJyk7XHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gKCkgPT4gc29ja2V0LmNsb3NlKCk7XHJcbiAgfSlcclxuICAucmV0cnlXaGVuKGVycm9ycyA9PiBlcnJvcnMuc3dpdGNoTWFwKGVyciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5vbkxpbmUgPyBPYnNlcnZhYmxlLnRpbWVyKDMwMDApIDpcclxuICAgICAgICBPYnNlcnZhYmxlLmZyb21FdmVudCh3aW5kb3csICdvbmxpbmUnKS50YWtlKDEpO1xyXG4gICAgfSkpO1xyXG4gIFxyXG4gIFxyXG4gIFxyXG4gIFxyXG5cclxuIHByaXZhdGUgc2VhcmNoQm94OkNvbnRyb2wgPSBuZXcgQ29udHJvbCgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VhcmNoQm94XHJcbiAgICAgICAgLnZhbHVlQ2hhbmdlc1xyXG4gICAgICAgIC5kZWJvdW5jZVRpbWUoMjAwKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNlYXJjaEV2ZW50LmVtaXQoZXZlbnQpXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgfSk7XHJcbiAgICAgXHJcbiAgfVxyXG4gIGhvdCA9IHRoaXMuc291cmNlLnNoYXJlKCk7XHJcbiAgXHJcbiBcclxuICBcclxuICBuZ09uSW5pdCgpIHtcclxuICAgIFxyXG4gICAgIHRoaXMuY291bnRlci5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLnNlYXJjaENvdW50ID0gZGF0YSk7XHJcbiAgICAgXHJcbiAgICAvLyBmaXJzdCBjb25uZWN0aW9uXHJcbiAgICB2YXIgIHN1YjEgPSB0aGlzLmhvdC5zdWJzY3JpYmUoKGUpID0+IGNvbnNvbGUubG9nKCdzMScsIGUpKTtcclxuICAgIHZhciBzdWIyOiBhbnk7XHJcblxyXG4gICAgLy8gc2Vjb25kIGNvbm5lY3Rpb24gb25lIHNlY29uZCBsYXRlclxyXG4gICAgXHJcbiAgICBcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygndXNpbmcgaG90IG9ic2VydmFibGUuLi4nKTtcclxuICAgICAgc3ViMiA9IHRoaXMuaG90LnN1YnNjcmliZSgoZSkgPT4gY29uc29sZS5sb2coJ3MyJywgZSkpO1xyXG4gICAgfSwgMTAwMCk7XHJcblxyXG5cclxuICAgIC8vIHNpbmNlIHdlJ3JlIHB1bXBpbmcgYWxsIG9mIHRoZSB2YWx1ZXMgdGhyb3VnaCBhIFN1YmplY3QsIHdoaWNoIFxyXG4gICAgLy8gbXV0bGljYXN0cyB0byBhbGwgc3Vic2NyaWJlcnMsIHdlJ3ZlIG1hZGUgb3VyIHNvdXJjZSBcImhvdFwiLlxyXG5cclxuICAgIC8vIEFmdGVyIGEgd2hpbGUsIHdlJ2xsIHVuc3Vic2NyaWJlIGZyb20gYm90aCxcclxuICAgIC8vIGFuZCBub3cgb3VyIHNvY2tldCB3aWxsIGRpc2Nvbm5lY3QuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgc3ViMS51bnN1YnNjcmliZSgpO1xyXG4gICAgICBzdWIyLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9LCA0MDAwKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgLy8gcmV1c2luZyB0aGUgaG90IG9ic2VydmFibGVcclxuICAgICAgY29uc29sZS5sb2coJ3JldXNpbmcgaG90IG9ic2VydmFibGUuLi4nKTtcclxuICAgICAgdGhpcy5ob3Quc3Vic2NyaWJlKChlKSA9PiBjb25zb2xlLmxvZygnczMnLCBlKSk7XHJcbiAgICB9LCA0NTAwKTtcclxuICB9XHJcbiAgXHJcbiBcclxuICAgIFxyXG5cclxufVxyXG5cclxuXHJcbiIsImltcG9ydCB7SHR0cH0gZnJvbSAnYW5ndWxhcjIvaHR0cCc7XHJcbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQgJ3J4anMvUngnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7T2JzZXJ2ZXJ9IGZyb20gJ3J4anMvT2JzZXJ2ZXInO1xyXG5pbXBvcnQge1NlYXJjaFJlc3VsdHNDb21wb25lbnR9IGZyb20gJy4vc2VhcmNoLnJlc3VsdHMuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxyXG5cdGRpcmVjdGl2ZXM6IFtTZWFyY2hSZXN1bHRzQ29tcG9uZW50XSxcclxuXHR0ZW1wbGF0ZTogYFxyXG5cdFx0PG15LXNlYXJjaCAoc2VhcmNoRXZlbnQpPVwib25TZWFyY2goJGV2ZW50KVwiIFtyZXN1bHRzXT1cImRhdGFcIiBbY291bnRlcl09XCJjb3VudGVyXCI+PC9teS1zZWFyY2g+XHJcblx0XHRcclxuXHRgXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ29tcG9uZW50IHtcclxuICBwcml2YXRlIGRhdGE6T2JzZXJ2YWJsZTxhbnk+O1xyXG4gIHByaXZhdGUgZGF0YU9ic2VydmVyOk9ic2VydmVyPGFueT47XHJcblx0cHJpdmF0ZSBjb3VudGVyOk9ic2VydmFibGU8YW55PjtcclxuXHRwcml2YXRlIGNvdW50ZXJPYnNlcnZlcjpPYnNlcnZlcjxhbnk+O1xyXG4gIHByaXZhdGUgY250OiBudW1iZXIgPSAwO1xyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgdGhpcy5kYXRhID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4gdGhpcy5kYXRhT2JzZXJ2ZXIgPSBvYnNlcnZlcik7XHJcblx0XHR0aGlzLmNvdW50ZXIgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB0aGlzLmNvdW50ZXJPYnNlcnZlciA9IG9ic2VydmVyKTtcclxuXHR9XHJcblx0XHJcblx0b25TZWFyY2goZXZlbnQpIHtcclxuXHQgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9ib29rcy92MS92b2x1bWVzP3E9JyArIGV2ZW50KS5tYXAoKHJlc3BvbnNlKSA9PiB7XHJcblx0ICAgIHZhciBib29rcyA9IHJlc3BvbnNlLmpzb24oKTtcclxuXHQgICAgcmV0dXJuIGJvb2tzLml0ZW1zO1xyXG5cdCB9KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuXHQgICB0aGlzLmRhdGFPYnNlcnZlci5uZXh0KHJlc3VsdCk7XHJcblx0XHQgdGhpcy5jb3VudGVyT2JzZXJ2ZXIubmV4dCgrK3RoaXMuY250KTtcclxuXHRcdCBjb25zb2xlLmxvZyhcIkNvdW50ZXIgaW4gc2VydmljZTogXCIsIHRoaXMuY250KTtcclxuXHQgfSwgZXJyb3IgPT4gY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2FkIGFydGlzdHMnKSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIEFjdGl2aXR5IHtcclxuICAgIFxyXG4gICAgdmFsdWU6IHN0cmluZztcclxuICAgIGNyZWF0ZWRBdDogRGF0ZTtcclxuICAgIHByaW9yaXR5OiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yICh2YWx1ZTogc3RyaW5nLCBwcmlvcml0eTogbnVtYmVyLCBjcmVhdGVkQXQ/OiBEYXRlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlZEF0ID0gY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5IHx8IDU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMgfSBmcm9tICdhbmd1bGFyMi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzL1N1YmplY3QnO1xyXG5pbXBvcnQge0FjdGl2aXR5fSBmcm9tICcuL2FjdGl2aXR5JztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEFjdGl2aXR5U2VydmljZSB7XHJcbiAgcHJpdmF0ZSBfQWN0aXZpdGllcyQ6IFN1YmplY3Q8QWN0aXZpdHlbXT47XHJcbiAgcHJpdmF0ZSBiYXNlVXJsOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBkYXRhU3RvcmU6IHtcclxuICAgIEFjdGl2aXRpZXM6IEFjdGl2aXR5W11cclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcclxuICAgIHRoaXMuYmFzZVVybCAgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwJztcclxuICAgIHRoaXMuZGF0YVN0b3JlID0geyBBY3Rpdml0aWVzOiBbXSB9O1xyXG4gICAgdGhpcy5fQWN0aXZpdGllcyQgPSA8U3ViamVjdDxBY3Rpdml0eVtdPj5uZXcgU3ViamVjdCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IEFjdGl2aXRpZXMkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX0FjdGl2aXRpZXMkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgbG9hZEFsbCgpIHtcclxuICAgIHRoaXMuaHR0cC5nZXQoYCR7dGhpcy5iYXNlVXJsfS9hY3Rpdml0aWVzYCkubWFwKHJlc3BvbnNlID0+ICByZXNwb25zZS5qc29uKCkpXHJcbiAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzID0gZGF0YS5vYmo7XHJcbiAgICAgIHRoaXMuX0FjdGl2aXRpZXMkLm5leHQodGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcyk7XHJcbiAgICB9LCBlcnJvciA9PiBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvYWQgQWN0aXZpdGllcy4nKSk7XHJcbiAgfVxyXG5cclxuICBcclxuICBjcmVhdGUoYWN0aXZpdHk6IEFjdGl2aXR5KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkFjdGl2aXR5IHRvIHNhdmUgYXQgVUk6IFwiLCBhY3Rpdml0eSk7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcclxuICAgIGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShhY3Rpdml0eSk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoYCR7dGhpcy5iYXNlVXJsfS9hY3Rpdml0aWVzYCxib2R5ICwge2hlYWRlcnM6IGhlYWRlcnN9KVxyXG4gICAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXMucHVzaChkYXRhLm9iaik7XHJcbiAgICAgICAgdGhpcy5fQWN0aXZpdGllcyQubmV4dCh0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzKTtcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5sb2coJ0NvdWxkIG5vdCBjcmVhdGUgQWN0aXZpdHkuJykpO1xyXG4gIH1cclxufVxyXG4gIC8qXHJcbiAgLypsb2FkKGlkOiBhbnkpIHtcclxuICAgIHRoaXMuaHR0cC5nZXQoYCR7dGhpcy5iYXNlVXJsfS9hY3Rpdml0aWVzLyR7aWR9YCkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICBsZXQgbm90Rm91bmQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmIChpdGVtLmlkID09PSBkYXRhLmlkKSB7XHJcbiAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzW2luZGV4XSA9IGRhdGE7XHJcbiAgICAgICAgICBub3RGb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAobm90Rm91bmQpIHtcclxuICAgICAgICB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzLnB1c2goZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX0FjdGl2aXRpZXMkLm5leHQodGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcyk7XHJcbiAgICB9LCBlcnJvciA9PiBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvYWQgQWN0aXZpdHkuJykpO1xyXG4gIH1cclxuICB1cGRhdGUoQWN0aXZpdHk6IEFjdGl2aXR5KSB7XHJcbiAgICB0aGlzLmh0dHAucHV0KGAke3RoaXMuYmFzZVVybH0vYWN0aXZpdGllcy8ke0FjdGl2aXR5LmlkfWAsIEpTT04uc3RyaW5naWZ5KEFjdGl2aXR5KSlcclxuICAgICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzLmZvckVhY2goKEFjdGl2aXR5LCBpKSA9PiB7XHJcbiAgICAgICAgICBpZiAoQWN0aXZpdHkuX2lkID09PSBkYXRhLl9pZCkgeyB0aGlzLmRhdGFTdG9yZS5BY3Rpdml0aWVzW2ldID0gZGF0YTsgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9BY3Rpdml0aWVzJC5uZXh0KHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXMpO1xyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmxvZygnQ291bGQgbm90IHVwZGF0ZSBBY3Rpdml0eS4nKSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoQWN0aXZpdHlJZDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmh0dHAuZGVsZXRlKGAke3RoaXMuYmFzZVVybH0vQWN0aXZpdGllcy8ke0FjdGl2aXR5SWR9YCkuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHtcclxuICAgICAgdGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcy5mb3JFYWNoKCh0LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHQuaWQgPT09IEFjdGl2aXR5SWQpIHsgdGhpcy5kYXRhU3RvcmUuQWN0aXZpdGllcy5zcGxpY2UoaSwgMSk7IH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLl9BY3Rpdml0aWVzJC5uZXh0KHRoaXMuZGF0YVN0b3JlLkFjdGl2aXRpZXMpO1xyXG4gICAgfSwgZXJyb3IgPT4gY29uc29sZS5sb2coJ0NvdWxkIG5vdCBkZWxldGUgQWN0aXZpdHkuJykpO1xyXG4gIH0qL1xyXG5cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7QWN0aXZpdHlTZXJ2aWNlfSBmcm9tICcuL3dvcmtsaXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0FjdGl2aXR5fSBmcm9tICcuL2FjdGl2aXR5JztcclxuaW1wb3J0ICdyeGpzL1J4JztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhbm90aGVyLW15LXdvcmtsaXN0JyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgICAgICA8aDQ+Tm9ybWFsIFByaW9yaXR5IFRhc2tzIC0ge3tub3JtYWxQcmlvUXVldWV9fTwvaDQ+XHJcbiAgICAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHQgIGFjdGl2aXR5LWJveFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHkgbm9ybWFsLXByaW9yaXR5XCIgICpuZ0Zvcj1cIiNhY3Rpdml0eSBvZiBhbm90aGVyQWN0aXZpdGllcyQgfCBhc3luY1wiID5cclxuICAgICAgICAgICAgICAgIHt7YWN0aXZpdHkudmFsdWV9fVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgIGBcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBBbm90aGVyV29ya2xpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XHJcbiAgICAgXHJcbiAgICAgYW5vdGhlckFjdGl2aXRpZXMkOiBPYnNlcnZhYmxlPGFueT47XHJcbiAgICBcclxuICAgICBub3JtYWxQcmlvUXVldWU6IG51bWJlcjtcclxuICAgICBoZWlnaHQgPSAyMzA7XHJcbiAgICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9hY3Rpdml0eVNlcnZpY2U6IEFjdGl2aXR5U2VydmljZSkge31cclxuICAgIFxyXG4gICAgbmdPbkluaXQoKXtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuYW5vdGhlckFjdGl2aXRpZXMkID0gdGhpcy5fYWN0aXZpdHlTZXJ2aWNlLkFjdGl2aXRpZXMkXHJcbiAgICAgICAgLm1hcCh0b2RvcyA9PiB0b2Rvcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnByaW9yaXR5ID4gNSkpOyAvLyBzdWJzY3JpYmUgdG8gZW50aXJlIGNvbGxlY3Rpb25cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9hY3Rpdml0eVNlcnZpY2UubG9hZEFsbCgpOyAgICAvLyBsb2FkIGFsbCB0b2Rvc1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYW5vdGhlckFjdGl2aXRpZXMkLnN1YnNjcmliZShkYXRhID0+IHRoaXMubm9ybWFsUHJpb1F1ZXVlID0gZGF0YS5sZW5ndGgpO1xyXG4gICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0FjdGl2aXR5U2VydmljZX0gZnJvbSAnLi93b3JrbGlzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtBY3Rpdml0eX0gZnJvbSAnLi9hY3Rpdml0eSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktd29ya2xpc3QtYWRkJyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICBcclxuICAgICAgICAgICAgPGZvcm0gKG5nU3VibWl0KT1cIm9uU3VibWl0KGYudmFsdWUpXCIgI2Y9XCJuZ0Zvcm1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidmFsdWVcIj5BY3Rpdml0eTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZ0NvbnRyb2w9XCJ2YWx1ZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZD1cInZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwcmlvcml0eVwiPlByaW9yaXR5PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5nQ29udHJvbD1cInByaW9yaXR5XCIgdHlwZT1cIm51bWJlclwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJwcmlvcml0eVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IHNwYWNpbmdcIj5BZGQgQWN0aXZpdHk8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICBcclxuICAgIGBcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JrbGlzdEFkZENvbXBvbmVudCB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2FjdGl2aXR5U2VydmljZTogQWN0aXZpdHlTZXJ2aWNlKSB7fVxyXG4gICAgb25TdWJtaXQoZm9ybTphbnkpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdHk6QWN0aXZpdHkgPSBuZXcgQWN0aXZpdHkoZm9ybS52YWx1ZSwgZm9ybS5wcmlvcml0eSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9hY3Rpdml0eVNlcnZpY2UuY3JlYXRlKGFjdGl2aXR5KTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5pbXBvcnQge0NoYW5nZURldGVjdG9yUmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtBY3Rpdml0eVNlcnZpY2V9IGZyb20gJy4vd29ya2xpc3Quc2VydmljZSc7XHJcbmltcG9ydCB7QWN0aXZpdHl9IGZyb20gJy4vYWN0aXZpdHknO1xyXG5pbXBvcnQgJ3J4anMvUngnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcclxuaW1wb3J0IHtBbm90aGVyV29ya2xpc3RDb21wb25lbnR9IGZyb20gJy4vYW5vdGhlci53b3JrbGlzdC5jb21wb25lbnQnO1xyXG5pbXBvcnQge1dvcmtsaXN0QWRkQ29tcG9uZW50fSBmcm9tICcuL3dvcmtsaXN0LmFkZC5jb21wb25lbnQnO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbXktd29ya2xpc3QnLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtMlwiPlxyXG4gICAgICAgICAgICA8bXktd29ya2xpc3QtYWRkPjwvbXktd29ya2xpc3QtYWRkPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGg0PkhpZ2ggUHJpb3JpdHkgVGFza3MgLSB7e2hpZ2hQcmlvUXVldWV9fTwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdCAgYWN0aXZpdHktYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHkgaGlnaC1wcmlvcml0eVwiICAqbmdGb3I9XCIjYWN0aXZpdHkgb2YgYWN0aXZpdGllcyQgfCBhc3luY1wiID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2FjdGl2aXR5LnZhbHVlfX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hcnRpY2xlPiBcclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgY29sLW1kLW9mZnNldC00XCI+ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YW5vdGhlci1teS13b3JrbGlzdD48L2Fub3RoZXItbXktd29ya2xpc3Q+XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgYCxcclxuICAgIGRpcmVjdGl2ZXM6IFtBbm90aGVyV29ya2xpc3RDb21wb25lbnQsIFdvcmtsaXN0QWRkQ29tcG9uZW50XVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmtsaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xyXG4gICAgYWN0aXZpdGllcyQ6IE9ic2VydmFibGU8YW55PjtcclxuICAgIGhpZ2hQcmlvUXVldWU6IG51bWJlcjtcclxuICAgIGhlaWdodCA9IDIzMDtcclxuICAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2FjdGl2aXR5U2VydmljZTogQWN0aXZpdHlTZXJ2aWNlKSB7fVxyXG4gICAgb25TdWJtaXQoZm9ybTphbnkpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aXZpdHk6QWN0aXZpdHkgPSBuZXcgQWN0aXZpdHkoZm9ybS52YWx1ZSwgZm9ybS5wcmlvcml0eSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9hY3Rpdml0eVNlcnZpY2UuY3JlYXRlKGFjdGl2aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpe1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdGllcyQgPSB0aGlzLl9hY3Rpdml0eVNlcnZpY2UuQWN0aXZpdGllcyRcclxuICAgICAgICAgLm1hcCh0b2RvcyA9PiB0b2Rvcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnByaW9yaXR5IDw9IDUpKTsgLy8gc3Vic2NyaWJlIHRvIGVudGlyZSBjb2xsZWN0aW9uXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fYWN0aXZpdHlTZXJ2aWNlLmxvYWRBbGwoKTsgICAgLy8gbG9hZCBhbGwgdG9kb3NcclxuICAgICAgICBcclxuICAgICAgIHRoaXMuYWN0aXZpdGllcyQuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5oaWdoUHJpb1F1ZXVlID0gZGF0YS5sZW5ndGgpO1xyXG4gICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmV4cG9ydCBjbGFzcyBNYXN0ZXJDb21wb25lbnR7XHJcbiAgICBcclxuICAgIHVwZGF0ZU1lKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBsYXN0VXBkYXRlZCgpe1xyXG4gICAgICAgIHJldHVybiBEYXRlKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPdXRwdXQsIElucHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7TWFzdGVyQ29tcG9uZW50fSBmcm9tICcuL21hc3Rlci5jb21tZW50JztcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdteS1jYXJ0LWJhZGdlJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgc3R5bGU9XCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztwYWRkaW5nOiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWluZm9cIj5cclxuICAgICAgICAgICAge3ttZXNzYWdlfX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2PjxzdHJvbmc+e3tsYXN0VXBkYXRlZCgpfX08L3N0cm9uZz48L2Rpdj5cclxuICAgICAgICA8aDM+VGhlIENhcnQgQmFkZ2U8L2gzPlxyXG4gICAgICAgIDxoND5JdGVtcyBpbiB5b3VyIGNhcnQgOiB7e2NvdW50ZXJ9fTwvaDQ+XHJcbiAgICBcclxuICAgIDwvZGl2PlxyXG4gICAgIFxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIENhcnRCYWRnZUNvbXBvbmVudCBleHRlbmRzIE1hc3RlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIEBJbnB1dCgpIGl0ZW1BZGRTdHJlYW06T2JzZXJ2YWJsZTxhbnk+O1xyXG4gIGNvdW50ZXIgPSAwO1xyXG4gIG1lc3NhZ2UgPSAnVXNpbmcgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kub25QdXNoLCBpIGRlY2lkZSB3aGVuIHRvIHVwZGF0ZSBteXNlbGYsIGN1cnJlbnRseSBhdCBhbiBpbnRlcnZhbCBvZiA1IHNlY3MnO1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICB9LCA1MDAwKTtcclxuICB9O1xyXG4gIC8vcHJpdmF0ZSBjbnQ6IG51bWJlciA9IDA7XHJcbiAgXHJcblxyXG4gIFxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5pdGVtQWRkU3RyZWFtLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY291bnRlcisrOyAvLyBhcHBsaWNhdGlvbiBzdGF0ZSBjaGFuZ2VkXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiSXRlbSBpcyBDYXJ0OiBcIiwgdGhpcy5jb3VudGVyKTtcclxuICAgICB9KTtcclxuIFxyXG4gIH1cclxufSIsIi8vUHVzaCBTdHJhdGVneVxyXG5pbXBvcnQge0NvbXBvbmVudCxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7TWFzdGVyQ29tcG9uZW50fSBmcm9tICcuL21hc3Rlci5jb21tZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgLy9tb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgc3R5bGU9XCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztwYWRkaW5nOiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAge3ttZXNzYWdlfX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2PjxzdHJvbmc+e3tsYXN0VXBkYXRlZCgpfX08L3N0cm9uZz48L2Rpdj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgKGNsaWNrKT1cInVwZGF0ZU1lKClcIj5VcGRhdGUgTWU8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICBcclxuICAgIDwvZGl2PlxyXG5gLFxyXG4gICAgc2VsZWN0b3I6J2NoaWxkLXNlY3Rpb24tMScsXHJcbiAgICBjaGFuZ2VEZXRlY3Rpb246Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDaGlsZENvbXBvbmVudFNlY3Rpb24xIGV4dGVuZHMgTWFzdGVyQ29tcG9uZW50e1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9ICdVc2luZyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIG9ubHkgdXBkYXRlIG15c2VsZiBmb3IgY2hhbmdlcyBpbml0aWF0ZWQgZnJvbSB3aXRoaW4gbWUuIEkgYW0gYWxvb2YgdG8gdGhlIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUgaW5pdGlhdGVkIGJ5IGFueSBvdGhlciBjb21wb25lbnQuJztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgLy9tb2R1bGVJZDogX19tb2R1bGVOYW1lLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgc3R5bGU9XCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztwYWRkaW5nOiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAge3ttZXNzYWdlfX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2PjxzdHJvbmc+e3tsYXN0VXBkYXRlZCgpfX08L3N0cm9uZz48L2Rpdj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgKGNsaWNrKT1cInVwZGF0ZU1lKClcIj5VcGRhdGUgTWU8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICBcclxuICAgIDwvZGl2PlxyXG5gLFxyXG4gICAgc2VsZWN0b3I6J2NoaWxkLXNlY3Rpb24tMicsXHJcbiAgICBjaGFuZ2VEZXRlY3Rpb246Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2hpbGRDb21wb25lbnRTZWN0aW9uMiBleHRlbmRzIE1hc3RlckNvbXBvbmVudHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnVXNpbmcgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCwgZ2V0dGluZyB1cGRhdGUgZm9yIGFueSBjaGFuZ2UgdG8gYW55IGNvbXBvbmVudCBvbiB0aGUgcGFnZSwgaSBwYXJ0aWNpcGF0ZSBpbiBlYWNoIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUgcmVnYXJkbGVzcyBvZiB3aG8gaW5pdGlhdGVkIGl0Lic7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgT3V0cHV0LCBJbnB1dCwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQge09ic2VydmVyfSBmcm9tICdyeGpzL09ic2VydmVyJztcclxuaW1wb3J0IHtDYXJ0QmFkZ2VDb21wb25lbnR9IGZyb20gJy4vY2FydC5iYWRnZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge0NoaWxkQ29tcG9uZW50U2VjdGlvbjEsIENoaWxkQ29tcG9uZW50U2VjdGlvbjJ9IGZyb20gJy4vY2hpbGQuY29tcG9uZW50LnNlY3Rpb24nO1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ215LWNhcnQnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz5QaWNrIEl0ZW1zIGZyb20gaGVyZS4uLjwvaDM+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgKGNsaWNrKT1cIm9uQWRkVG9DYXJ0KClcIj5BZGQgdG8gQ2FydDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8bXktY2FydC1iYWRnZSBbaXRlbUFkZFN0cmVhbV09XCJjb3VudGVyXCI+PC9teS1jYXJ0LWJhZGdlPlxyXG4gICAgICAgICAgICA8Y2hpbGQtc2VjdGlvbi0xPjwvY2hpbGQtc2VjdGlvbi0xPlxyXG4gICAgICAgICAgICA8Y2hpbGQtc2VjdGlvbi0yPjwvY2hpbGQtc2VjdGlvbi0yPlxyXG4gIGAsXHJcbiAgZGlyZWN0aXZlczogW0NhcnRCYWRnZUNvbXBvbmVudCwgQ2hpbGRDb21wb25lbnRTZWN0aW9uMSwgQ2hpbGRDb21wb25lbnRTZWN0aW9uMl0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYXJ0Q29tcG9uZW50IHtcclxuXHJcbiAgcHJpdmF0ZSBjb3VudGVyOk9ic2VydmFibGU8YW55PjtcclxuICBwcml2YXRlIGNvdW50ZXJPYnNlcnZlcjpPYnNlcnZlcjxhbnk+O1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb3VudGVyID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4gdGhpcy5jb3VudGVyT2JzZXJ2ZXIgPSBvYnNlcnZlcik7XHJcbiAgfVxyXG4gIG9uQWRkVG9DYXJ0KCl7XHJcbiAgICB0aGlzLmNvdW50ZXJPYnNlcnZlci5uZXh0KDEpO1xyXG4gIH1cclxuICBcclxufSIsImltcG9ydCB7Q29tcG9uZW50LCBPbkNoYW5nZXMsIElucHV0LCBEb0NoZWNrLCBLZXlWYWx1ZURpZmZlcnN9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICdteS1jaGlsZCcsXHJcblx0dGVtcGxhdGU6IGBcclxuXHRcdDxoMj5DaGlsZCBjb21wb25lbnQ8L2gyPlxyXG5cdFx0e3sgcGVyc29uLm5hbWUgfX1cclxuXHRgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDaGlsZENvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2sge1xyXG5cdEBJbnB1dCgpIHBlcnNvbjogYW55O1xyXG5cdGRpZmZlcjogYW55O1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycykge1xyXG5cdFx0dGhpcy5kaWZmZXIgPSBkaWZmZXJzLmZpbmQoe30pLmNyZWF0ZShudWxsKTtcclxuXHR9XHJcblxyXG5cdG5nRG9DaGVjaygpIHtcclxuXHRcdHZhciBjaGFuZ2VzID0gdGhpcy5kaWZmZXIuZGlmZih0aGlzLnBlcnNvbik7XHJcblxyXG5cdFx0aWYoY2hhbmdlcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnY2hhbmdlcyBkZXRlY3RlZCcpO1xyXG5cdFx0XHRjaGFuZ2VzLmZvckVhY2hDaGFuZ2VkSXRlbShyID0+IGNvbnNvbGUubG9nKCdjaGFuZ2VkICcsIHIuY3VycmVudFZhbHVlKSk7XHJcblx0XHRcdGNoYW5nZXMuZm9yRWFjaEFkZGVkSXRlbShyID0+IGNvbnNvbGUubG9nKCdhZGRlZCAnICsgci5jdXJyZW50VmFsdWUpKTtcclxuXHRcdFx0Y2hhbmdlcy5mb3JFYWNoUmVtb3ZlZEl0ZW0ociA9PiBjb25zb2xlLmxvZygncmVtb3ZlZCAnICsgci5jdXJyZW50VmFsdWUpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdub3RoaW5nIGNoYW5nZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG4vL2ltcG9ydCB7Unh9IGZyb20gJ3J4anMvUngnO1xyXG5pbXBvcnQge0NoaWxkQ29tcG9uZW50fSBmcm9tICcuL2NoaWxkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7SHR0cH0gZnJvbSBcImFuZ3VsYXIyL2h0dHBcIjtcclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICdteS1wYXJlbnQnLFxyXG5cdHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIChjbGljayk9XCJjaGFuZ2VQZXJzb24oKVwiPkNoYW5nZSBQZXJzb248L2J1dHRvbj5cclxuXHRcdDxteS1jaGlsZCBbcGVyc29uXT1cInBlcnNvblwiPjwvbXktY2hpbGQ+XHJcbiAgICAgICA8aDM+MXN0IExpc3Q8L2gzPiBcclxuICAgICAgICA8dWw+XHJcbiAgICAgIDxsaSAqbmdGb3I9XCIjYWN0aXZpdHkgb2YgYWN0aXZpdGllcyB8IGFzeW5jXCI+e3thY3Rpdml0eS5uYW1lfX08L2xpPlxyXG4gICAgPC91bD5cclxuICAgIDxoMz4ybmQgTGlzdDwvaDM+XHJcbiAgICAgICAgPHVsPlxyXG4gICAgICA8bGkgKm5nRm9yPVwiI2FjdGl2aXR5IG9mIGFjdGl2aXRpZXMyIHwgYXN5bmNcIj57e2FjdGl2aXR5Lm5hbWV9fTwvbGk+XHJcbiAgICA8L3VsPlxyXG5cdGAsXHJcbiAgICBkaXJlY3RpdmVzOiBbQ2hpbGRDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQYXJlbnRDb21wb25lbnQge1xyXG5cdHBlcnNvbjogYW55O1xyXG4gICAgLy9wcm9mZXNzaW9uOiBzdHJpbmc7XHJcbiAgICBhY3Rpdml0aWVzOiBPYnNlcnZhYmxlPEFycmF5PGFueT4+O1xyXG4gICAgYWN0aXZpdGllczI6IE9ic2VydmFibGU8QXJyYXk8YW55Pj47XHJcblx0Y29uc3RydWN0b3IoaHR0cDogSHR0cCkge1xyXG5cdFx0dGhpcy5wZXJzb24gPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdKdXJpJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0aWVzID0gaHR0cC5nZXQoJ2FjdGl2aXRpZXMuanNvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkuYWN0aXZpdHlJdGVtcylcclxuICAgICAgICAgICAgICAgICAgICAuc2hhcmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLy5wdWJsaXNoTGFzdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8ucmVmQ291bnQoKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuYWN0aXZpdGllczIgPSB0aGlzLmFjdGl2aXRpZXMsIDUwMCk7XHJcbiAgICAgICAgLy90aGlzLnByb2Zlc3Npb24gPSAnRW5naW5lZXInO1xyXG4gICAgICAgIC8vaHR0cDovL2Jsb2cudGhvdWdodHJhbS5pby9hbmd1bGFyLzIwMTYvMDYvMTYvY29sZC12cy1ob3Qtb2JzZXJ2YWJsZXMuaHRtbFxyXG5cdH1cclxuICAgIGNoYW5nZVBlcnNvbigpIHtcclxuICAgICAgICB0aGlzLnBlcnNvbi5uYW1lID0gXCJUaG9tYXNcIjtcclxuICAgIH1cclxuICAgIC8qbGV0IG9icyA9IFxyXG4gICAgT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuaW50ZXJ2YWwoMTAwMClcclxuICAgICAgICAgICAgLnB1Ymxpc2goKTtcclxuICAgIG9icy5jb25uZWN0KCk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBvYnMuc3Vic2NyaWJlKHYgPT4gY29uc29sZS5sb2coXCJTdWJzY3JpYmVyIyAxOiBcIiArIHYpKTtcclxuICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgKCkgPT4gb2JzLnN1YnNjcmliZSh2ID0+IGNvbnNvbGUubG9nKFwiU3Vic2NyaWJlciMgMjogXCIgKyB2KSksIDEwMDApO1xyXG5cclxuICAgIH0sMjEwMCk7Ki9cclxuXHJcblxyXG4vKmxldCBvYnMgPSBPYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiBvYnNlcnZlci5uZXh0KERhdGUubm93KCkpKTtcclxub2JzLnN1YnNjcmliZSh2ID0+IGNvbnNvbGUubG9nKFwiU3Vic2NyaWJlciMgMTogXCIgKyB2KSk7XHJcbm9icy5zdWJzY3JpYmUodiA9PiBjb25zb2xlLmxvZyhcIlN1YnNjcmliZXIjIDI6IFwiICsgdikpO1xyXG4vL29icy5jb25uZWN0KCk7Ki9cclxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Um91dGVDb25maWcsIFJPVVRFUl9ESVJFQ1RJVkVTfSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuaW1wb3J0IHtNZXNzYWdlc0NvbXBvbmVudH0gZnJvbSAnLi9tZXNzYWdlcy9tZXNzYWdlcy5jb21wb25lbnQnO1xuaW1wb3J0IHtIZWFkZXJDb21wb25lbnR9IGZyb20gJy4vaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQge0F1dGhlbnRpY2F0aW9uQ29tcG9uZW50fSBmcm9tICcuL2F1dGgvYXV0aGVudGljYXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7U2VhcmNoQ29tcG9uZW50fSBmcm9tICcuL3NlYXJjaC9zZWFyY2guY29tcG9uZW50JztcbmltcG9ydCB7V29ya2xpc3RDb21wb25lbnR9IGZyb20gJy4vd29ya2xpc3Qvd29ya2xpc3QuY29tcG9uZW50JztcbmltcG9ydCB7Q2FydENvbXBvbmVudH0gZnJvbSAnLi9jYXJ0YmFkZ2UvY2FydC5jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJlbnRDb21wb25lbnR9IGZyb20gJy4vY2hhbmdlZGV0ZWN0L3BhcmVudC5jb21wb25lbnQnO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdteS1hcHAnLFxuICAgIHRlbXBsYXRlOiBgICBcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPG15LWhlYWRlcj48L215LWhlYWRlcj5cbiAgICAgICAgICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBkaXJlY3RpdmVzOiBbTWVzc2FnZXNDb21wb25lbnQsIFJPVVRFUl9ESVJFQ1RJVkVTLCBIZWFkZXJDb21wb25lbnRdXG59KVxuQFJvdXRlQ29uZmlnKFtcbiAgICB7cGF0aDogJy8nLCBuYW1lOiAnTWVzc2FnZXMnLCBjb21wb25lbnQ6IE1lc3NhZ2VzQ29tcG9uZW50LCB1c2VBc0RlZmF1bHQ6IHRydWV9LFxuICAgIHtwYXRoOiAnL2F1dGgvLi4uJywgbmFtZTogJ0F1dGgnLCBjb21wb25lbnQ6IEF1dGhlbnRpY2F0aW9uQ29tcG9uZW50fSxcbiAgICB7cGF0aDogJy9zZWFyY2gnLCBuYW1lOiAnU2VhcmNoJywgY29tcG9uZW50OiBTZWFyY2hDb21wb25lbnR9LFxuICAgIHtwYXRoOiAnL2FjdGl2aXR5JywgbmFtZTogJ1dvcmtsaXN0JywgY29tcG9uZW50OiBXb3JrbGlzdENvbXBvbmVudH0sXG4gICAge3BhdGg6ICcvY2FydCcsIG5hbWU6ICdDYXJ0JywgY29tcG9uZW50OiBDYXJ0Q29tcG9uZW50fSxcbiAgICB7cGF0aDogJy9jaGFuZ2UnLCBuYW1lOiAnQ2hhbmdlJywgY29tcG9uZW50OiBQYXJlbnRDb21wb25lbnR9XG5dKVxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgXG4gICAgbWVzc2FnZSA9IFwiQSBtZXNzYWdlXCI7XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhcjIvdHlwaW5ncy9icm93c2VyLmQudHNcIi8+XG5pbXBvcnQge2Jvb3RzdHJhcH0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vYnJvd3Nlcic7XG5pbXBvcnQge0FwcENvbXBvbmVudH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi9tZXNzYWdlcy9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi9hdXRoL2F1dGguc2VydmljZSc7XG5pbXBvcnQge0FjdGl2aXR5U2VydmljZX0gZnJvbSAnLi93b3JrbGlzdC93b3JrbGlzdC5zZXJ2aWNlJztcbmltcG9ydCB7Uk9VVEVSX1BST1ZJREVSUywgTG9jYXRpb25TdHJhdGVneSwgSGFzaExvY2F0aW9uU3RyYXRlZ3l9IGZyb20gXCJhbmd1bGFyMi9yb3V0ZXJcIjtcbmltcG9ydCB7SFRUUF9QUk9WSURFUlN9IGZyb20gJ2FuZ3VsYXIyL2h0dHAnO1xuaW1wb3J0IHtwcm92aWRlfSBmcm9tIFwiYW5ndWxhcjIvY29yZVwiO1xuaW1wb3J0IHtFcnJvclNlcnZpY2V9IGZyb20gXCIuL2Vycm9ycy9lcnJvci5zZXJ2aWNlXCI7XG5cbmJvb3RzdHJhcChBcHBDb21wb25lbnQsIFtBY3Rpdml0eVNlcnZpY2UsIEF1dGhTZXJ2aWNlLCBFcnJvclNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlLCBIVFRQX1BST1ZJREVSUywgUk9VVEVSX1BST1ZJREVSUywgXG5wcm92aWRlKExvY2F0aW9uU3RyYXRlZ3ksIHt1c2VDbGFzczogSGFzaExvY2F0aW9uU3RyYXRlZ3l9KV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
