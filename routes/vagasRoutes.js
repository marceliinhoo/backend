const express = require('express');
const Vaga = require('../models/Vaga');
const router = express.Router();

// Criar uma nova vaga
router.post('/vagas', async (req, res) => {
    console.log(req.body); // Verifica se o campo beneficio está presente
    try {
        const novaVaga = new Vaga(req.body);
        await novaVaga.save();
        res.json({ success: true, vaga: novaVaga });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao criar vaga" });
    }
});

// Listar todas as vagas
router.get('/vagas', async (req, res) => {
    try {
        const vagas = await Vaga.find();
        res.json(vagas);
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao buscar vagas" });
    }
});

// Editar uma vaga
router.put('/vagas/:id', async (req, res) => {
    try {
        const vagaAtualizada = await Vaga.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, vaga: vagaAtualizada });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao editar vaga" });
    }
});

// Excluir uma vaga
router.delete('/vagas/:id', async (req, res) => {
    try {
        await Vaga.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Vaga excluída com sucesso" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao excluir vaga" });
    }
});

module.exports = router;
