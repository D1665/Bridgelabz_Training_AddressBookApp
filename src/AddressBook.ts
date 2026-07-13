import { Person } from "./Person";

export class AddressBook {
    private contacts: Person[];

    constructor() {
        this.contacts = [];
    }

    // UC2 - add a person
    addPerson(person: Person): boolean {
        this.contacts.push(person);
        return true;
    }

    getAll(): Person[] {
        return [...this.contacts];
    }
}
