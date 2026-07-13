// AddressBook.ts
// One AddressBook = one named collection of Person contacts.
// UC6 lets the main program keep several of these around at once.

import { Person } from "./Person";

export class AddressBook {
    name: string;
    private contacts: Person[];

    constructor(name: string) {
        this.name = name;
        this.contacts = [];
    }

    // UC2 / UC5 - add a person, but don't allow duplicates (UC7)
    // returns true if added, false if it was a duplicate
    addPerson(person: Person): boolean {
        if (this.isDuplicate(person)) {
            return false;
        }
        this.contacts.push(person);
        return true;
    }

    // UC7 - duplicate check by name, uses Person.equals under the hood
    isDuplicate(person: Person): boolean {
        return this.contacts.some(c => c.equals(person));
    }

    findByName(name: string): Person | undefined {
        return this.contacts.find(
            c => c.getFullName().toLowerCase() === name.toLowerCase()
        );
    }

    // UC3 - edit an existing contact. just overwrite whatever fields are passed
    editPerson(name: string, updated: Partial<Person>): boolean {
        const person = this.findByName(name);
        if (!person) return false;

        // only touch fields that were actually given, ignore first/last name
        // here since that's basically the key we searched on (keeping it simple)
        if (updated.address !== undefined) person.address = updated.address;
        if (updated.city !== undefined) person.city = updated.city;
        if (updated.state !== undefined) person.state = updated.state;
        if (updated.zip !== undefined) person.zip = updated.zip;
        if (updated.phone !== undefined) person.phone = updated.phone;
        if (updated.email !== undefined) person.email = updated.email;

        return true;
    }

    // UC4
    deletePerson(name: string): boolean {
        const idx = this.contacts.findIndex(
            c => c.getFullName().toLowerCase() === name.toLowerCase()
        );
        if (idx === -1) return false;
        this.contacts.splice(idx, 1);
        return true;
    }

    getAll(): Person[] {
        // return a copy so callers can't mutate our internal array directly
        return [...this.contacts];
    }

    get count(): number {
        return this.contacts.length;
    }

    // UC8 - search across city or state
    searchByCity(city: string): Person[] {
        return this.contacts.filter(
            c => c.city.toLowerCase() === city.toLowerCase()
        );
    }

    searchByState(state: string): Person[] {
        return this.contacts.filter(
            c => c.state.toLowerCase() === state.toLowerCase()
        );
    }

    // UC10 - counts, could just do searchByCity(...).length but writing it out
    // separately is a little faster and reads clearer at the call site
    countByCity(city: string): number {
        return this.contacts.filter(
            c => c.city.toLowerCase() === city.toLowerCase()
        ).length;
    }

    countByState(state: string): number {
        return this.contacts.filter(
            c => c.state.toLowerCase() === state.toLowerCase()
        ).length;
    }

    // UC11 - sort alphabetically by name. Mutates the internal list, that's fine
    // for a console app like this.
    sortByName(): void {
        this.contacts.sort((a, b) =>
            a.getFullName().localeCompare(b.getFullName())
        );
    }

    // UC12 - sort by city / state / zip, pass the field name in
    sortBy(field: "city" | "state" | "zip"): void {
        this.contacts.sort((a, b) => {
            const valA = a[field].toLowerCase();
            const valB = b[field].toLowerCase();
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
    }

    // UC9 - group contacts by city (or state), returns a Map so caller can
    // print however they like
    groupByCity(): Map<string, Person[]> {
        const map = new Map<string, Person[]>();
        for (const c of this.contacts) {
            const key = c.city || "(unknown)";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(c);
        }
        return map;
    }

    groupByState(): Map<string, Person[]> {
        const map = new Map<string, Person[]>();
        for (const c of this.contacts) {
            const key = c.state || "(unknown)";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(c);
        }
        return map;
    }

    // used by FileHandler to bulk load without going through the duplicate
    // check one at a time (loading from a file we trust to already be clean)
    loadContacts(persons: Person[]): void {
        this.contacts = persons;
    }
}
