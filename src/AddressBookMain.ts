import * as readlineSync from "readline-sync";
import { Person } from "./Person";
import { AddressBook } from "./AddressBook";

const addressBooks: Map<string, AddressBook> = new Map();
let currentBook: AddressBook | null = null;

function printWelcome() {
    console.log("====================================");
    console.log(" Welcome to Address Book Program");
    console.log("====================================");
}

function printMenu() {
    console.log("\n--- MENU ---");
    console.log("1. Create a new Address Book");
    console.log("2. Select an Address Book");
    console.log("3. Add a Contact");
    console.log("4. Add Multiple Contacts");
    console.log("5. Edit a Contact");
    console.log("6. Delete a Contact");
    console.log("7. View All Contacts");
    console.log("8. Search by City / State");
    console.log("0. Exit");
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
        console.log(`Name: ${p.getFullName()}`);
        console.log(`Address: ${p.address}, ${p.city}, ${p.state} - ${p.zip}`);
        console.log(`Phone: ${p.phone}, Email: ${p.email}`);
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
    results.forEach(p => {
        console.log(`\nName: ${p.getFullName()}`);
        console.log(`Address: ${p.address}, ${p.city}, ${p.state} - ${p.zip}`);
        console.log(`Phone: ${p.phone}, Email: ${p.email}`);
    });
}

function searchAcrossAllBooks() {
    const type = readlineSync.question("Search ACROSS ALL books by (city/state)? ").trim().toLowerCase();
    const value = readlineSync.question("Enter value: ").trim();

    let found = false;
    for (const [name, book] of addressBooks) {
        const results = type === "state" ? book.searchByState(value) : book.searchByCity(value);
        if (results.length > 0) {
            found = true;
            console.log(`\nIn "${name}":`);
            results.forEach(p => {
                console.log(`  - ${p.getFullName()} (${p.city}, ${p.state})`);
            });
        }
    }
    if (!found) console.log("No matches in any address book.");
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
