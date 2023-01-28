export class User {
    readonly id: number;
    readonly username: string;
    readonly password: string;
    readonly email?: string;
    readonly pushNotifications: boolean;

    constructor(from: any) {
        // TODO: Input validation
        this.id = from.id;
        this.username = from.username;
        this.password = from.password;
        this.email = from.email;
        this.pushNotifications = from.pushNotifications;
    }
}
