const mysql = require("mysql");
const inquirer  = require("inquirer")

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "employee_tracker_db"
});

connection.connect(err => {
    if (err) throw err;
    mainMenu()
});

const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: ["View All Employees", "Add Employee", "Remove Employee", "View All Departments", "Add Department", "Remove Department",
                "View All Roles", "Add Role", "Remove Role", "Update employee roles", "Exit"]
            }
        ])
        .then(answer => {
            switch (answer.choice) {
                case "View All Employees":
                    viewAll()
                    break
                case "Add Employee":
                    addEmployee()
                    break
                case "Remove Employee":
                    removeEmployee()
                    break
                case "Exit":
                    connection.end()
                    break  
            }
        })

}

// Get the current roles
const getRoles = () => {
    // Declare an empty array to store the roles
    let roleArr = []

    // Query for the role titles and push them to array
    connection.query("SELECT title FROM role", (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title)
        }
    })

    return roleArr
}

const addEmployee = () => {
    let positions = getRoles()
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employees first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employees last name?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What is the employees role?",
                choices: positions,
                name: "role"
            },
            {
                type: "input",
                message: "Does the employee have a manager ID? If so, enter it here:",
                name: "managerID"
            }
        ]).then(answers => {
            // Assign the role id 
            let roleID = positions.indexOf(answers.role) + 1
            
            // Insert the data into the employee table
            connection.query("INSERT INTO employee SET ?", {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: roleID,
                manager_id: answers.managerID
            }, err => {
                if (err) throw err
                console.log("Employee succesfully added!")
                mainMenu()    
            })
        })
}

const removeEmployee = () => {
    let viewAll = viewAll()

    inquirer
        .prompt([
            {
                type: "input",
                message: "Which employee would you like to remove?",

            }
        ])
}

const viewAll = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err
        console.table(res)
        mainMenu()
    })
}