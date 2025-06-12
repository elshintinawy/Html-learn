const employeeModel = require("../Models/employee_model");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");

const register = async (req, res) => {
  const { id, name, role, password } = req.body;
  const oldEmployee = await employeeModel.findOne({ id: id });
  if (oldEmployee) {
    return res.status(400).json({ message: "Employee already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 8);
  const newEmployee = new employeeModel({
    id,
    name,
    role,
    password: hashedPassword,
  });
  const token = await generateJWT({
    id: newEmployee.id,
    name: newEmployee.name,
    role: newEmployee.role,
  });
  newEmployee.token = token;
  await newEmployee.save();
  res
    .status(201)
    .json({ message: "Employee created successfully", data: newEmployee });
};

module.exports = {
  register,
};
