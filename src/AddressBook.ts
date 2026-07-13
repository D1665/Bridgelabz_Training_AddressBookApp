import { Person } from "./Person";

export class AddressBook {
    name: string;
    private contacts: Person[];

    constructor(name: string) {
        this.name = name;
        this.contacts = [];
    }

    addPerson(person: Person): boolean {
        if (this.isDuplicate(person)) {
            return false;
        }
        this.contacts.push(person);
        return true;
    }

    isDuplicate(person: Person): boolean {
        return this.contacts.some(c => c.equals(person));
    }

    findByName(name: string): Person | undefined {
        return this.contacts.find(
            c => c.getFullName().toLowerCase() === name.toLowerCase()
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

    deletePerson(name: string): boolean {
        const idx = this.contacts.findIndex(
            c => c.getFullName().toLowerCase() === name.toLowerCase()
        );
        if (idx === -1) return false;
        this.contacts.splice(idx, 1);
        return true;
    }

    getAll(): Person[] {
        return [...this.contacts];
    }
}
