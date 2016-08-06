export class User {
    

    constructor (public email: string, public password: string, public firstName?: string, public lastName?: string) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}