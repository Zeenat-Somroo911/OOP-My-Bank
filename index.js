#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
console.log(chalk.bold.yellowBright("\n\t\tWelcome to ZEENAT SOMROO 'OOP My Bank Project'\n\t\t "));
// Bank Account class
class BankAccount {
    accountNumber;
    balance;
    accountType;
    transactionHistory;
    constructor(accountNumber, balance, accountType = "Checking") {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.accountType = accountType;
        this.transactionHistory = [];
    }
    withdraw(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.transactionHistory.push(`Withdrawal of $${amount}`);
            console.log(`Withdrawal of $${amount} successful. Remaining balance: $${this.balance}`);
        }
        else {
            console.log("Insufficient balance.");
        }
    }
    deposit(amount) {
        if (amount > 100) {
            amount -= 1; // $1 fee charged if more than $100 is deposited
        }
        this.balance += amount;
        this.transactionHistory.push(`Deposit of $${amount}`);
        console.log(`Deposit of $${amount} successful. Remaining balance: $${this.balance}`);
    }
    checkBalance() {
        console.log(`Current balance: $${this.balance}`);
    }
    addInterest() {
        const interestRate = this.accountType === "Savings" ? 0.08 : 0.05; // Example: Higher interest for savings account
        const interestAmount = this.balance * interestRate;
        this.balance += interestAmount;
        this.transactionHistory.push(`Interest added: $${interestAmount}`);
        console.log(`Interest added: $${interestAmount}. New balance: $${this.balance}`);
    }
    getTransactionHistory() {
        return this.transactionHistory;
    }
    closeAccount() {
        this.balance = 0;
        console.log(`Account ${this.accountNumber} closed.`);
    }
    getAccountType() {
        return this.accountType;
    }
    setAccountType(type) {
        this.accountType = type;
    }
    applyOverdraftProtection() {
        if (this.accountType === "Checking") {
            // Example: Implement overdraft protection logic here
            console.log("Overdraft protection applied.");
        }
        else {
            console.log("Overdraft protection is only applicable to Checking accounts.");
        }
    }
}
// Customer class
class Customer {
    firstName;
    lastName;
    gender;
    age;
    mobileNumber;
    account;
    constructor(firstName, lastName, gender, age, mobileNumber, account) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}
// Create bank accounts
const accounts = [
    new BankAccount(1001, 500000, "Savings"),
    new BankAccount(1002, 500000, "Checking"),
    new BankAccount(1003, 500000, "Checking"),
];
// Create customers
const customers = [
    new Customer("ALI", "SOMROO", "MALE", 20, 3148129519, accounts[0]),
    new Customer("HASSAN", "SOMROO", "MALE", 20, 3010122133, accounts[1]),
    new Customer("MUHAMMAD", "BILAL", "MALE", 20, 3147766234, accounts[2]),
];
// Function to interact with bank account
async function service() {
    do {
        const accountNumberInput = await inquirer.prompt({
            name: "accountNumber",
            type: "number",
            message: "Enter your account number:"
        });
        const customer = customers.find(customer => customer.account.accountNumber === accountNumberInput.accountNumber);
        if (customer) {
            await performBankOperations(customer);
        }
        else {
            console.log("Invalid account number. Please try again.");
        }
    } while (true);
}
async function performBankOperations(customer) {
    console.log(`Welcome, ${customer.firstName} ${customer.lastName}!\n`);
    while (true) {
        const ans = await inquirer.prompt({
            name: "select",
            type: "list",
            message: "Select an operation",
            choices: ["Deposit", "Withdraw", "Check Balance", "Add Interest", "Transaction History", "Close Account", "Change Account Type", "Apply Overdraft Protection", "Exit"]
        });
        switch (ans.select) {
            case "Deposit":
                await handleDeposit(customer);
                break;
            case "Withdraw":
                await handleWithdrawal(customer);
                break;
            case "Check Balance":
                customer.account.checkBalance();
                break;
            case "Add Interest":
                customer.account.addInterest();
                break;
            case "Transaction History":
                displayTransactionHistory(customer);
                break;
            case "Close Account":
                customer.account.closeAccount();
                return;
            case "Change Account Type":
                await handleChangeAccountType(customer);
                break;
            case "Apply Overdraft Protection":
                customer.account.applyOverdraftProtection();
                break;
            case "Exit":
                console.log("Exiting Bank Program...");
                console.log("\n Thank you for using our bank services. Have a great day!");
                process.exit(0);
        }
    }
}
async function handleDeposit(customer) {
    const depositAmount = await inquirer.prompt({
        name: "amount",
        type: "number",
        message: "Enter the amount to deposit:"
    });
    customer.account.deposit(depositAmount.amount);
}
async function handleWithdrawal(customer) {
    const withdrawAmount = await inquirer.prompt({
        name: "amount",
        type: "number",
        message: "Enter the amount to withdraw:"
    });
    customer.account.withdraw(withdrawAmount.amount);
}
function displayTransactionHistory(customer) {
    const history = customer.account.getTransactionHistory();
    console.log("Transaction History:");
    history.forEach(transaction => console.log(transaction));
}
async function handleChangeAccountType(customer) {
    const accountTypes = ["Checking", "Savings"];
    const selectedType = await inquirer.prompt({
        name: "accountType",
        type: "list",
        message: "Select new account type:",
        choices: accountTypes
    });
    customer.account.setAccountType(selectedType.accountType);
    console.log(`Account type changed to ${selectedType.accountType}.`);
}
service();
