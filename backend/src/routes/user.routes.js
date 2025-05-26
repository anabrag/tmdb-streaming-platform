const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

router.post("/users", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

router.get("/users/mock", async (req, res) => {
  try {
    const user = await userService.getMockUser();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
});

module.exports = router;
