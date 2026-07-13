// AddressBookMain.ts
// Entry point. Just a console menu wired up to AddressBook / FileHandler.
// Kept most of the logic in AddressBook.ts, this file is mostly IO + glue.

import * as readlineSync from "readline-sync";
import * as path from "path";
import { Person } from "./Person";
import { AddressBook } from "./AddressBook";
import { FileHandler } from "./FileHandler";

// NOTE: don't just use "addressbook_data.txt" here - that resolves against
// process.cwd(), which changes depending on where you run "node" from.
// Anchoring it to __dirname (dist/ after compile) and stepping up one level
// means the file always lands in the project root no matter how you launch it.
const DATA_FILE = path.join(__dirname, "..", "addressbook_data.txt");

// UC6 - dictionary of address book name -> AddressBook
const addressBooks: Map<string, AddressBook> = new Map();
let currentBook: AddressBook | null = null;

function printWelcome() {
    console.log("====================================");
    console.log(" Welcome to Address Book Program");
    console.log("====================================");
}

function printMenu() {
    console.log("\n--- MENU ---");
    console.log("1.  Create a new Address Book");
    console.log("2.  Select an Address Book");
    console.log("3.  Add a Contact");
    console.log("4.  Add Multiple Contacts");
    console.log("5.  Edit a Contact");
    console.log("6.  Delete a Contact");
    console.log("7.  View All Contacts");
    console.log("8.  Search by City / State");
    console.log("9.  View Persons Grouped by City / State");
    console.log("10. Count Persons by City / State");
    console.log("11. Sort by Name");
    console.log("12. Sort by City / State / Zip");
    console.log("13. Save to File");
    console.log("14. Load from File");
    console.log("0.  Exit");
}

function requireCurrentBook(): boolean {
    if (!currentBook) {
        console.log("No address book selected yet. Create or select one first (option 1 or 2).");
        return false;
    }
    return true;
}

function createAddressBook() {
    const name = readlineSync.question("Enter a name for the new Address Book: ").trim();
    if (!name) {
        console.log("Name can't be empty.");
        return;
    }
    if (addressBooks.has(name)) {
        console.log("An address book with that name already exists, pick another name.");
        return;
    }
    const book = new AddressBook(name);
    addressBooks.set(name, book);
    currentBook = book;
    console.log(`Created and selected Address Book "${name}"`);
}

function selectAddressBook() {
    if (addressBooks.size === 0) {
        console.log("There are no address books yet. Create one first.");
        return;
    }
    console.log("Available Address Books:");
    for (const bookName of addressBooks.keys()) {
        console.log(" - " + bookName);
    }
    const name = readlineSync.question("Which one do you want to select? ").trim();
    const book = addressBooks.get(name);
    if (!book) {
        console.log("Couldn't find an address book with that name.");
        return;
    }
    currentBook = book;
    console.log(`Selected "${name}"`);
}

function promptForPerson(): Person {
    const firstName = readlineSync.question("First Name: ").trim();
    const lastName = readlineSync.question("Last Name: ").trim();
    const address = readlineSync.question("Address: ").trim();
    const city = readlineSync.question("City: ").trim();
    const state = readlineSync.question("State: ").trim();
    const zip = readlineSync.question("Zip: ").trim();
    const phone = readlineSync.question("Phone: ").trim();
    const email = readlineSync.question("Email: ").trim();
    return new Person(firstName, lastName, address, city, state, zip, phone, email);
}

function addContact() {
    if (!requireCurrentBook()) return;
    const person = promptForPerson();
    const added = currentBook!.addPerson(person);
    if (added) {
        console.log("Contact added.");
    } else {
        console.log(`A contact named "${person.getFullName()}" already exists, skipping (no duplicates allowed).`);
    }
}

function addMultipleContacts() {
    if (!requireCurrentBook()) return;
    let addMore = true;
    let added = 0;
    while (addMore) {
        const person = promptForPerson();
        if (currentBook!.addPerson(person)) {
            added++;
        } else {
            console.log(`Skipped duplicate: ${person.getFullName()}`);
        }
        addMore = readlineSync.keyInYNStrict("Add another contact?");
    }
    console.log(`Done. Added ${added} contact(s).`);
}

function editContact() {
    if (!requireCurrentBook()) return;
    const name = readlineSync.question("Enter the full name of the contact to edit: ").trim();
    const person = currentBook!.findByName(name);
    if (!person) {
        console.log("No contact found with that name.");
        return;
    }
    console.log("Leave a field blank to keep it unchanged.");
    const address = readlineSync.question(`Address [${person.address}]: `).trim();
    const city = readlineSync.question(`City [${person.city}]: `).trim();
    const state = readlineSync.question(`State [${person.state}]: `).trim();
    const zip = readlineSync.question(`Zip [${person.zip}]: `).trim();
    const phone = readlineSync.question(`Phone [${person.phone}]: `).trim();
    const email = readlineSync.question(`Email [${person.email}]: `).trim();

    currentBook!.editPerson(name, {
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zip: zip || undefined,
        phone: phone || undefined,
        email: email || undefined
    });
    console.log("Contact updated.");
}

function deleteContact() {
    if (!requireCurrentBook()) return;
    const name = readlineSync.question("Enter the full name of the contact to delete: ").trim();
    const deleted = currentBook!.deletePerson(name);
    console.log(deleted ? "Deleted." : "Couldn't find that contact.");
}

function viewAllContacts() {
    if (!requireCurrentBook()) return;
    const contacts = currentBook!.getAll();
    if (contacts.length === 0) {
        console.log("Address book is empty.");
        return;
    }
    console.log(`\n${currentBook!.name} - ${contacts.length} contact(s)`);
    contacts.forEach((p, i) => {
        console.log(`\n#${i + 1}`);
        console.log(p.toString());
    });
}

function searchByCityOrState() {
    if (!requireCurrentBook()) return;
    const type = readlineSync.question("Search by (city/state)? ").trim().toLowerCase();
    const value = readlineSync.question("Enter value: ").trim();

    const results =
        type === "state"
            ? currentBook!.searchByState(value)
            : currentBook!.searchByCity(value);

    if (results.length === 0) {
        console.log("No matches found.");
        return;
    }
    results.forEach(p => console.log("\n" + p.toString()));
}

// UC8 note: search can also go across ALL address books, not just the current
// one. doing that here since it's basically the same code, just looping books
function searchAcrossAllBooks() {
    const type = readlineSync.question("Search ACROSS ALL books by (city/state)? ").trim().toLowerCase();
    const value = readlineSync.question("Enter value: ").trim();

    let found = false;
    for (const [name, book] of addressBooks) {
        const results = type === "state" ? book.searchByState(value) : book.searchByCity(value);
        if (results.length > 0) {
            found = true;
            console.log(`\nIn "${name}":`);
            results.forEach(p => console.log(p.toString()));
        }
    }
    if (!found) console.log("No matches in any address book.");
}

function viewGrouped() {
    if (!requireCurrentBook()) return;
    const type = readlineSync.question("Group by (city/state)? ").trim().toLowerCase();
    const map = type === "state" ? currentBook!.groupByState() : currentBook!.groupByCity();

    for (const [key, people] of map) {
        console.log(`\n${key} (${people.length}):`);
        people.forEach(p => console.log("  - " + p.getFullName()));
    }
}

function countByCityOrState() {
    if (!requireCurrentBook()) return;
    const type = readlineSync.question("Count by (city/state)? ").trim().toLowerCase();
    const value = readlineSync.question("Enter value: ").trim();
    const count =
        type === "state" ? currentBook!.countByState(value) : currentBook!.countByCity(value);
    console.log(`Count: ${count}`);
}

function sortByName() {
    if (!requireCurrentBook()) return;
    currentBook!.sortByName();
    console.log("Sorted by name.");
    viewAllContacts();
}

function sortByField() {
    if (!requireCurrentBook()) return;
    const field = readlineSync.question("Sort by (city/state/zip): ").trim().toLowerCase();
    if (field !== "city" && field !== "state" && field !== "zip") {
        console.log("Not a valid field.");
        return;
    }
    currentBook!.sortBy(field as "city" | "state" | "zip");
    console.log(`Sorted by ${field}.`);
    viewAllContacts();
}

function saveToFile() {
    if (addressBooks.size === 0) {
        console.log("Nothing to save yet.");
        return;
    }
    try {
        FileHandler.saveToFile(DATA_FILE, addressBooks);
        console.log(`Saved to ${DATA_FILE}`);
    } catch (err) {
        console.log("Something went wrong while saving: " + err);
    }
}

function loadFromFile() {
    try {
        const loaded = FileHandler.loadFromFile(DATA_FILE);
        if (loaded.size === 0) {
            console.log("Nothing loaded (file missing or empty).");
            return;
        }
        addressBooks.clear();
        for (const [name, book] of loaded) {
            addressBooks.set(name, book);
        }
        // just select the first one that comes back so the user can start
        // working right away
        currentBook = loaded.values().next().value ?? null;
        console.log(`Loaded ${loaded.size} address book(s) from ${DATA_FILE}`);
        if (currentBook) console.log(`Selected "${currentBook.name}"`);
    } catch (err) {
        console.log("Something went wrong while loading: " + err);
    }
}

function main() {
    printWelcome();

    let running = true;
    while (running) {
        printMenu();
        const choice = readlineSync.question("\nChoose an option: ").trim();

        switch (choice) {
            case "1": createAddressBook(); break;
            case "2": selectAddressBook(); break;
            case "3": addContact(); break;
            case "4": addMultipleContacts(); break;
            case "5": editContact(); break;
            case "6": deleteContact(); break;
            case "7": viewAllContacts(); break;
            case "8": {
                const scope = readlineSync.question("Search current book only or all books? (current/all): ").trim().toLowerCase();
                if (scope === "all") searchAcrossAllBooks();
                else searchByCityOrState();
                break;
            }
            case "9": viewGrouped(); break;
            case "10": countByCityOrState(); break;
            case "11": sortByName(); break;
            case "12": sortByField(); break;
            case "13": saveToFile(); break;
            case "14": loadFromFile(); break;
            case "0":
                running = false;
                console.log("Bye!");
                break;
            default:
                console.log("Not a valid option, try again.");
        }
    }
}

main();
