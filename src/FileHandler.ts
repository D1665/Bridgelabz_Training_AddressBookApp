// FileHandler.ts
// UC13 - Ability to Read or Write the Address Book with Persons Contact into a
// File using File IO.
//
// Not using CSV/JSON libs here on purpose (that's UC14/UC15), just plain old
// fs read/write with a simple text format:
//
//   #AddressBook: <name>
//   firstName|lastName|address|city|state|zip|phone|email
//   ...
//   #AddressBook: <next name>
//   ...

import * as fs from "fs";
import { Person } from "./Person";
import { AddressBook } from "./AddressBook";

const HEADER_PREFIX = "#AddressBook:";

export class FileHandler {
    // writes ALL address books (the whole dictionary) to one file
    static saveToFile(filePath: string, books: Map<string, AddressBook>): void {
        let output = "";

        for (const [bookName, book] of books) {
            output += `${HEADER_PREFIX} ${bookName}\n`;
            for (const person of book.getAll()) {
                output += person.toFileLine() + "\n";
            }
        }

        // sync write is fine for a small console tool like this
        fs.writeFileSync(filePath, output, "utf-8");
    }

    static loadFromFile(filePath: string): Map<string, AddressBook> {
        const books = new Map<string, AddressBook>();

        if (!fs.existsSync(filePath)) {
            console.log(`No file found at ${filePath}, starting fresh.`);
            return books;
        }

        const raw = fs.readFileSync(filePath, "utf-8");
        const lines = raw.split(/\r?\n/);

        let currentBook: AddressBook | null = null;
        let currentContacts: Person[] = [];

        for (const line of lines) {
            if (!line.trim()) continue;

            if (line.startsWith(HEADER_PREFIX)) {
                // flush previous book before starting a new one
                if (currentBook) {
                    currentBook.loadContacts(currentContacts);
                    books.set(currentBook.name, currentBook);
                }
                const bookName = line.substring(HEADER_PREFIX.length).trim();
                currentBook = new AddressBook(bookName);
                currentContacts = [];
            } else if (currentBook) {
                currentContacts.push(Person.fromFileLine(line));
            }
            // if we hit a contact line before any header, just ignore it -
            // shouldn't really happen with files we wrote ourselves
        }

        if (currentBook) {
            currentBook.loadContacts(currentContacts);
            books.set(currentBook.name, currentBook);
        }

        return books;
    }
}
