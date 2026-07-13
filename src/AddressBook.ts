import { Person } from "./Person";

export class AddressBook {
    private contacts: Person[];

    constructor() {
        this.contacts = [];
    }

    addPerson(person: Person): boolean {
        this.contacts.push(person);
        return true;
    }

    findByName(name: string): Person | undefined {
        return this.contacts.find(
            c => `${c.firstName} ${c.lastName}`.toLowerCase() === name.toLowerCase()
        );
    }

    editPerson(name: string, updated: Partial<Person>): boolean {
        const person = this.findByName(name);
        if (!person) return false;

        if (updated.address !== undefined) person.address = updated.address;
        if (updated.city !== undefined) person.city = updated.city;
        if (updated.state !== undefined) person.state = updated.state;
        if (updated.zip !== undefined) person.zip = updated.zip;
        if (updated.phone !== undefined) person.phone = updated.phone;
        if (updated.email !== undefined) person.email = updated.email;

        return true;
    }

    // UC4 - delete contact
    deletePerson(name: string): boolean {
        const idx = this.contacts.findIndex(
            c => `${c.firstName} ${c.lastName}`.toLowerCase() === name.toLowerCase()
        );
        if (idx === -1) return false;
        this.contacts.splice(idx, 1);
        return true;
    }

    getAll(): Person[] {
        return [...this.contacts];
    }
}
