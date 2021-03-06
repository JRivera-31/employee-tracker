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
                "View All Roles", "Add Role", "Remove Role", "Update Employee Role", "Exit"]
            }
        ])
        .then(answer => {
            switch (answer.choice) {
                case "View All Employees":
                    viewAllEmp()
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
                case "View All Departments":
                    viewDepartments()
                    break
                case "Add Department":
                    addDepartment()
                    break
                case "Remove Department":
                    removeDepartment()
                    break
                case "View All Roles":
                    viewRoles()
                    break
                case "Add Role":
                    addRole()
                    break
                case "Remove Role":
                    removeRole()
                    break
                case "Update Employee Role":
                    updateRole()
                    break
            }
        })

}


const viewAllEmp = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err
        
        // Displays the employees
        console.table(res)
        mainMenu()
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

// To add an employee
const addEmployee = () => {
    // Assign getRoles function to a variable
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

// To remove employee
const removeEmployee = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err
        console.table(res)
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which employee would you like to remove?",
                    choices: () => {
                        let employeeArr = [] // Declare empty array to store current employees in

                        // Push employees to array
                        for (let i = 0; i < res.length; i++) {
                            employeeArr.push(`${res[i].id} ${res[i].first_name} ${res[i].last_name}`)
                        }

                        return employeeArr
                    },
                    name: "employee"
                }
            ])
            .then(answer => {
                let employeeID = parseInt(answer.employee.split(' ')[0]) // parse int response and split at spaces then return first index
                
                connection.query("DELETE FROM employee WHERE id = ?", [employeeID], (err, res) => {
                    if (err) throw err
                    console.log("Employee successfully deleted from database")
                    mainMenu()
                })
            })

    })
}

// View departments
const viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
        
        // Displays the employees
        console.table(res)
        mainMenu()
    })
}

// Add departments 
const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department you would like to add?",
                name: "department"
            }
        ])
        .then(answer => {
            let department = answer.department.charAt(0).toUpperCase() + answer.department.slice(1).trim()
            
            connection.query("INSERT INTO department SET ?", {
                name: department
            }, err => {
                if (err) throw err
                    console.log("Successfully added department")
                mainMenu()    
            })
        })
}

// To remove departments
const removeDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
        console.table(res)
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which department would you like to remove?",
                    choices: () => {
                        let departmentArr = [] // Declare empty array to store current departments in

                        // Push departments to array
                        for (let i = 0; i < res.length; i++) {
                            departmentArr.push(`${res[i].id} ${res[i].name}`)
                        }

                        return departmentArr
                    },
                    name: "department"
                }
            ])
            .then(answer => {
                let departmentID = parseInt(answer.department.split(' ')[0]) // parse int response and split at spaces then return first index
                
                connection.query("DELETE FROM department WHERE id = ?", [departmentID], (err, res) => {
                    if (err) throw err
                    console.log("Department successfully deleted from database")
                    mainMenu()
                })
            })

    })
}

const viewRoles = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err
        
        // Displays the employees
        console.table(res)
        mainMenu()
    })
}

const addRole = () => {   
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What role would you like to add?",
                    name: "role"
                },
                {
                    type: "input",
                    message: "What is the salary for this role?",
                    name: "salary",
                    validate: value => {
                        if (isNaN(value) === true) {
                            return false
                        } else {
                            return true
                        }
                    }
                },
                {
                    type: "list",
                    message: "What is the department for this role?",
                    name: "department",
                    choices: () => {
                        let departmentArr = [] // Declare empty array to store current departments in
                        
                        // Push departments to array
                        for (let i = 0; i < res.length; i++) {
                            departmentArr.push(`${res[i].id} ${res[i].name}`)
                        }

                        return departmentArr
                    }
                }
            ])
            .then(answers => {
                let departmentID = parseInt(answers.department.split(' ')[0]) // parse int response and split at spaces then return first index

                connection.query("INSERT INTO role SET ?", {
                    title: answers.role.charAt(0).toUpperCase() + answers.role.slice(1).trim(),
                    salary: answers.salary,
                    department_id: departmentID
                }, err => {
                    if (err) throw err
                    console.log("Successfully added role")
                    mainMenu()
                })
            })
    })
}

const removeRole = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err
        console.table(res)
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which role would you like to remove?",
                    choices: () => {
                        let roleArr = [] // Declare empty array to store current departments in

                        // Push departments to array
                        for (let i = 0; i < res.length; i++) {
                            roleArr.push(`${res[i].id} ${res[i].title}`)
                        }

                        return roleArr
                    },
                    name: "role"
                }
            ])
            .then(answer => {
                let roleID = parseInt(answer.role.split(' ')[0]) // parse int response and split at spaces then return first index
                
                connection.query("DELETE FROM role WHERE id = ?", [roleID], (err, res) => {
                    if (err) throw err
                    console.log("Role successfully deleted from database")
                    mainMenu()
                })
            })

    })
}

const updateRole = () => {
    let positions = getRoles()
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err
        console.table(res)
        
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which employees role do you want to update?",
                    choices: () => {
                        let employeeArr = [] // Declare empty array to store current employees in

                        // Push employees to array
                        for (let i = 0; i < res.length; i++) {
                            employeeArr.push(`${res[i].id} ${res[i].first_name} ${res[i].last_name}`)
                        }

                        return employeeArr
                    },
                    name: "employee"
                },
                {
                    type: "list",
                    message: "What role would we be updating this role to?",
                    choices: positions,
                    name: "role"
                },
            ])
            .then(answers => {
                let employeeID = parseInt(answers.employee.split(' ')[0]) // parse int response and split at spaces then return first index

                let roleID = positions.indexOf(answers.role) + 1 // get the role id like the add function

                connection.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, employeeID], err => {
                    if (err) throw err
                    console.log("Employee updated successfully")
                    mainMenu()
                })

            })
    })
}