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
}
