import * as readlineSync from "readline-sync";
import { Person } from "./Person";

function printWelcome() {
    console.log("====================================");
    console.log(" Welcome to Address Book Program");
    console.log("====================================");
}

function main() {
    printWelcome();
    console.log("Address Book application initialized.");
    console.log("UC1: Created Contact with First Name, Last Name, Address, City, State, Zip, Phone Number, and Email.");
    
    console.log("\nEnter details for a new Contact:");
    const firstName = readlineSync.question("First Name: ").trim();
    const lastName = readlineSync.question("Last Name: ").trim();
    const address = readlineSync.question("Address: ").trim();
    const city = readlineSync.question("City: ").trim();
    const state = readlineSync.question("State: ").trim();
    const zip = readlineSync.question("Zip: ").trim();
    const phone = readlineSync.question("Phone: ").trim();
    const email = readlineSync.question("Email: ").trim();

    const contact = new Person(firstName, lastName, address, city, state, zip, phone, email);
    console.log("\nContact Created Successfully:");
    console.log(`Name: ${contact.firstName} ${contact.lastName}`);
    console.log(`Phone: ${contact.phone}, Email: ${contact.email}`);
}

main();
