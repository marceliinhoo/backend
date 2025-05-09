const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Usuário fixo cadastrado
const users = [{ usuario: "admin", senha: bcrypt.hashSync("12345", 10) }];

exports.login = (req, res) => {
    const { usuario, senha } = req.body;
    const user = users.find(u => u.usuario === usuario);
    
    if (!user) {
        return res.status(401).json({ success: false, message: "Usuário não encontrado!" });
    }

    const isPasswordValid = bcrypt.compareSync(senha, user.senha);
    if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Senha incorreta!" });
    }

    // Gerar token JWT
    const token = jwt.sign({ usuario: user.usuario }, "secreto", { expiresIn: "1h" });

    res.json({ success: true, token });
};
