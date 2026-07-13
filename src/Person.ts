// Person.ts
// Basic contact entity for the address book. Kept as a plain class (not interface)
// so we can attach behaviour like equals() and toString() to it, similar to how
// we'd do it in Java/C#.

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

    // full name is used a LOT (duplicate check, edit, delete, sorting) so just
    // put it in one place instead of concatenating everywhere
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    // UC7 - used for duplicate checking. Two persons are considered the "same"
    // contact if the full name matches (case-insensitive, don't want John vs john
    // to be treated as different people)
    equals(other: Person): boolean {
        if (!other) return false;
        return this.getFullName().toLowerCase() === other.getFullName().toLowerCase();
    }

    // UC11 - override toString so console prints something readable instead of
    // [object Object]
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

    // helper for File IO (UC13) - turn a person into one CSV-ish line
    // not using an actual csv library here, just a simple pipe separated line
    toFileLine(): string {
        return [
            this.firstName,
            this.lastName,
            this.address,
            this.city,
            this.state,
            this.zip,
            this.phone,
            this.email
        ].join("|");
    }

    static fromFileLine(line: string): Person {
        const parts = line.split("|");
        // if a line is malformed just fill in blanks instead of crashing the
        // whole load - not ideal but good enough for this project
        while (parts.length < 8) parts.push("");
        return new Person(
            parts[0],
            parts[1],
            parts[2],
            parts[3],
            parts[4],
            parts[5],
            parts[6],
            parts[7]
        );
    }
}
