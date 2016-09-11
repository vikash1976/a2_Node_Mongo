export class Activity {

    value: string;
    createdAt: Date;
    priority: number;

    constructor(value: string, priority: number, createdAt?: Date) {
        this.value = value;
        this.createdAt = createdAt || new Date();
        this.priority = priority || 5;
    }
}