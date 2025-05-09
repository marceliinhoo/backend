const mongoose = require('mongoose');

const vagaSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    beneficio: String,
    vinculo: String,
    salario: String,
    local: String
});

const Vaga = mongoose.model("Vaga", vagaSchema);
module.exports = Vaga;
