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

    sortByName(): void {
        this.contacts.sort((a, b) =>
            a.getFullName().localeCompare(b.getFullName())
        );
    }

    // UC12 - sort by city / state / zip
    sortBy(field: "city" | "state" | "zip"): void {
        this.contacts.sort((a, b) => {
            const valA = a[field].toLowerCase();
            const valB = b[field].toLowerCase();
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
    }
}
