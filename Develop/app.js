const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const writeFileAsync = util.promisify(fs.writeFile);

const employeeList = [];

//set-up for question prompts
const Questions = [
    {
        name: "name",
        type: "input",
        message: "Please enter the employee's name"
    },
    {
        name: "id",
        type: "input",
        message: "Please enter the employee's ID number"
    },
    {
        name: "email",
        type: "input",
        message: "Please enter the employee's email"
    },
    {
        name: "role",
        type: "list",
        message: "Please assign this employee a title",
        choices: ["Employee", "Engineer", "Manager", "Intern"]
    },

];

async function nextEmployee() {

    try {

        const employee = await inquirer.prompt(Questions);


//Switch statement to get the unique questions for each role.
        switch (employee.role) {
            case "Manager":
                const officeNumber = await inquirer.prompt({
                    name: "value",
                    type: "input",
                    message: "Please enter the Manager's office number"
                });
                employeeList.push(new Manager(employee.name, employee.id, employee.email, officeNumber.value));
                break;
            case "Engineer":
                const github = await inquirer.prompt({
                    name: "value",
                    type: "input",
                    message: "Please enter the Engineer's github account"
                });
                employeeList.push(new Engineer(employee.name, employee.id, employee.email, github.value));
                break;
            case "Intern":
                const school = await inquirer.prompt({
                    name: "value",
                    type: "input",
                    message: "Please enter the Intern's school"
                });
                employeeList.push(new Intern(employee.name, employee.id, employee.email, school.value));
                break;
            default:
                employeeList.push(new Employee(employee.name, employee.id, employee.email));
                break;
        }

    } catch (error) {
        throw Error(error);
    }

}


async function init() {

    try {
        console.log("Enter employee information");
        let newEmployee = true;
        while (newEmployee) {
            await nextEmployee();
            const continueSelection = await inquirer.prompt({
                name: "selection",
                type: "list",
                message: "Would you like to add an additional employee? ",
                choices: ["Yes", "No"]
            });

            switch (continueSelection.selection) {
                case "No": newEmployee = false;
                    const finalFile = await render(employeeList);
                    await writeFileAsync(outputPath, finalFile);
                    break;
                default:
                    break;
            }
        }

    } catch (error) {
        throw Error(error);
    }

}

init();
