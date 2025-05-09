// controllers/vagasController.js
let vagas = []; // Aqui você pode substituir por um banco de dados mais tarde

exports.getVagas = (req, res) => {
    res.json(vagas);
};

exports.addVaga = (req, res) => {
    const { titulo, descricao, beneficio, vinculo, salario, local } = req.body;
    const novaVaga = { id: Date.now(), titulo, descricao, beneficio, vinculo, salario, local };  // Criando ID com base no timestamp
    vagas.push(novaVaga);
    res.json({ success: true, vaga: novaVaga });
};

exports.updateVaga = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, beneficio, vinculo, salario, local } = req.body;
    
    let vagaEncontrada = vagas.find(vaga => vaga.id == id);
    if (!vagaEncontrada) {
        return res.status(404).json({ success: false, message: 'Vaga não encontrada!' });
    }

    vagaEncontrada = { id, titulo, descricao, beneficio, vinculo, salario, local };
    vagas = vagas.map(vaga => vaga.id == id ? vagaEncontrada : vaga);
    res.json({ success: true, vaga: vagaEncontrada });
};

exports.deleteVaga = (req, res) => {
    const { id } = req.params;
    vagas = vagas.filter(vaga => vaga.id != id);
    res.json({ success: true, message: "Vaga excluída com sucesso!" });
};
