require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const vagasRoutes = require("./routes/vagasRoutes");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado com sucesso"))
  .catch((err) => console.log("Erro ao conectar ao MongoDB:", err));

// Configuração do upload de arquivos
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use("/api", vagasRoutes);

const usuarios = [{ usuario: "admin", senha: "12345" }];

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  const user = usuarios.find((u) => u.usuario === usuario && u.senha === senha);

  if (user) {
    res.json({ success: true, token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false, message: "Usuário ou senha incorretos!" });
  }
});

// Rota para envio de formulário com arquivo
app.post("/api/enviar-formulario", upload.single("documento"), async (req, res) => {
    const { name, email, tel, area, menssage } = req.body;
    const documento = req.file ? req.file.path : null; // Usar o caminho completo do arquivo
  
    // Verificar se o arquivo foi enviado
    if (!documento) {
      return res.status(400).json({ success: false, message: "Nenhum arquivo foi enviado!" });
    }
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Carregar a variável de ambiente para o e-mail
        pass: process.env.GMAIL_PASSWORD, // Carregar a senha de app do Gmail
      }
    });
  
    const mailOptions = {
      from: email,
      to: "marcelo.junior@tcdobrasil.com.br",
      subject: `Novo formulário de interesse em vaga: ${name}`,
      html: `
        <h3>Detalhes do Formulário</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${tel}</p>
        <p><strong>Área de Interesse:</strong> ${area}</p>
        <p><strong>Mensagem:</strong> ${menssage}</p>
      `,
      attachments: [
        {
          filename: req.file.originalname, // Nome do arquivo original
          path: documento,  // Caminho completo do arquivo
          contentType: req.file.mimetype, // Tipo MIME do arquivo
        }
      ]
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Formulário enviado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erro ao enviar o formulário" });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
