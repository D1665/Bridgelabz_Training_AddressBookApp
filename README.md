# BridgeLabz Address Book Application (TypeScript)

A TypeScript console-based Address Book application designed with Object-Oriented Programming (OOP) principles. The application supports multiple address books, contact management, validation, searching, sorting, grouping, and File IO persistence.

This project implements the core BridgeLabz Address Book training use cases (UC1 to UC13) incrementally across development branches.

## Project Structure & Architecture

The project is structured logically into components under the `src/` directory:

- **`Person.ts`**: Holds contact details (First Name, Last Name, Address, City, State, Zip, Phone, Email) and defines contact behavior such as duplicates check and text formatting.
- **`AddressBook.ts`**: Coordinates contacts within a named Address Book. Implements search, filter, sorting, grouping, counting, and duplicate validation.
- **`FileHandler.ts`**: Handles File IO persistence to local files (`addressbook_data.txt`), formatting data cleanly for retrieval.
- **`AddressBookMain.ts`**: Entry point for the application. Hosts the interactive console menu for select/create book, contact CRUD, search, count, sort, grouping, and saving/loading data.

---

## Features (Use Cases)

- **UC1**: Contact Entity (first name, last name, address, city, state, zip, phone, email)
- **UC2**: Add Contacts to Address Book
- **UC3**: Edit existing contacts by name
- **UC4**: Delete contacts by name
- **UC5**: Ability to add multiple contacts in one go
- **UC6**: Multiple named Address Books management
- **UC7**: Duplicate checking (checks for existing names case-insensitively)
- **UC8**: Search contacts by City or State across Address Books
- **UC9**: View persons grouped by City or State
- **UC10**: Get count of contact persons by City or State
- **UC11**: Sort contacts alphabetically by Name
- **UC12**: Sort contacts by City, State, or Zip
- **UC13**: File IO persistence (Read/Write contacts to disk)

---

## How to Build & Run

### Prerequisites
- Node.js (v16+)
- npm

### Installation
Clone the repository:
```bash
git clone https://github.com/D1665/Bridgelabz_Training_AddressBookApp.git
cd Bridgelabz_Training_AddressBookApp
```

Install dependencies:
```bash
npm install
```

### Run in Development Mode
Builds and starts the console application:
```bash
npm run dev
```

### Production Build
Build TypeScript to JavaScript:
```bash
npm run build
```
Run the compiled JavaScript:
```bash
npm start
```
