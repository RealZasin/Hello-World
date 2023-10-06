data.employee = require("../../data/employees.json");

const getAllEmployees = (req,res) => 
{
    res.json(data.employees)
}

const createEmployee = (req,res) =>
{
    res.json
    (
        {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "id": req.body.id
        }
        
    )
}

const updateEmployee = (req,res) =>
{
    res.json
    (
        {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "id": req.body.id
        }
        
    )
}

const terminateEmployee = (req,res) =>
{
    res.json 
(
    {
        "id": req.body.id
    }   
)
}

const getSingleEmployee = (req,res) =>
{
    res.json({"id": req.params.id})
}

module.exports = 
{
    getAllEmployees,
    createEmployee,
    updateEmployee,
    terminateEmployee,
    getSingleEmployee
}