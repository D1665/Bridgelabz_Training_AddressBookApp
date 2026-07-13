import * as readlineSync from "readline-sync";
import { Person } from "./Person";
import { AddressBook } from "./AddressBook";

const addressBook = new AddressBook();

function printWelcome() {
    console.log("====================================");
    console.log(" Welcome to Address Book Program");
    console.log("====================================");
}

function printMenu() {
    console.log("\n--- MENU ---");
    console.log("1. Add a Contact");
    console.log("2. View All Contacts");
    console.log("3. Edit a Contact");
    console.log("4. Delete a Contact");
    console.log("5. Add Multiple Contacts");
    console.log("0. Exit");
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
    const person = promptForPerson();
    addressBook.addPerson(person);
    console.log("Contact added.");
}

function addMultipleContacts() {
    let addMore = true;
    let added = 0;
    while (addMore) {
        console.log(`\nEnter details for contact #${added + 1}:`);
        const person = promptForPerson();
        if (addressBook.addPerson(person)) {
            added++;
        }
        addMore = readlineSync.keyInYNStrict("Add another contact?");
    }
    console.log(`\nDone. Added ${added} contact(s).`);
}

function viewAllContacts() {
    const contacts = addressBook.getAll();
    if (contacts.length === 0) {
        console.log("Address book is empty.");
        return;
    }
    contacts.forEach((p, i) => {
        console.log(`\n#${i + 1}`);
        console.log(`Name: ${p.firstName} ${p.lastName}`);
        console.log(`Address: ${p.address}, ${p.city}, ${p.state} - ${p.zip}`);
        console.log(`Phone: ${p.phone}, Email: ${p.email}`);
    });
}

function editContact() {
    const name = readlineSync.question("Enter the full name of the contact to edit: ").trim();
    const person = addressBook.findByName(name);
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

    addressBook.editPerson(name, {
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
    const name = readlineSync.question("Enter the full name of the contact to delete: ").trim();
    const deleted = addressBook.deletePerson(name);
    console.log(deleted ? "Deleted." : "Couldn't find that contact.");
}

function main() {
    printWelcome();
    let running = true;
    while (running) {
        printMenu();
        const choice = readlineSync.question("\nChoose an option: ").trim();
        switch (choice) {
            case "1": addContact(); break;
            case "2": viewAllContacts(); break;
            case "3": editContact(); break;
            case "4": deleteContact(); break;
            case "5": addMultipleContacts(); break;
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
