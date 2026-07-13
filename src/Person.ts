export class Person {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;

    constructor(
        firstName: string,
        lastName: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        phone: string,
        email: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phone = phone;
        this.email = email;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    equals(other: Person): boolean {
        if (!other) return false;
        return this.getFullName().toLowerCase() === other.getFullName().toLowerCase();
    }

    // UC11 - override toString
    toString(): string {
        return (
            `${this.getFullName()}\n` +
            `  Address : ${this.address}\n` +
            `  City    : ${this.city}\n` +
            `  State   : ${this.state}\n` +
            `  Zip     : ${this.zip}\n` +
            `  Phone   : ${this.phone}\n` +
            `  Email   : ${this.email}`
        );
    }
}
