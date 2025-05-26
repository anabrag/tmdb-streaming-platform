const User = require("../models/User.model");

async function createUser({ name, email }) {
  const exists = await User.findOne({ email });

  if (exists) return exists;
  const user = new User({ name, email });
  
  return await user.save();
}

async function getMockUser() {
  const email = "mock@usuario.com";
  return await createUser({ name: "Usuário Mockado", email });
}

module.exports = { createUser, getMockUser };
