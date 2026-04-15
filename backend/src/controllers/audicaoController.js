const joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { createAuditionPDF } = require('../services/pdfService');
const { sendAuditionEmail } = require('../services/emailService');

const prisma = new PrismaClient();

const candidatoSchema = joi.object({
  nome_completo: joi.string().required(),
  estado_civil: joi.string().valid('solteiro', 'casado', 'separado', 'amaziado').required(),
  idade: joi.number().integer().positive().min(12).required(),
  whatsapp: joi.string().required(),
  tempo_igreja: joi.string().required(),
  batizado: joi.boolean().required(),
  veio_outra_igreja: joi.boolean().required(),
  fez_integracao: joi.boolean().required(),
  area_atuacao: joi.string().required(),
  instrumento_funcao: joi.string().allow('', null),
  tempo_experiencia: joi.string().required(),
  ja_serviu_antes: joi.boolean().required(),
  data_audicao: joi.string().required(),
});

const registerAudicao = async (req, res) => {
  const { error, value } = candidatoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Verifica duplicidade
  const existingCandidato = await prisma.candidato.findUnique({
    where: { whatsapp: value.whatsapp }
  });

  if (existingCandidato) {
    return res.status(409).json({ error: 'Já existe uma inscrição com este número de WhatsApp. Por favor, aguarde nosso contato.' });
  }

  // Salvar no BD
  const candidato = await prisma.candidato.create({
    data: {
      ...value,
    }
  });

  // Gerar PDF em buffer
  const pdfBuffer = await createAuditionPDF(candidato);

  // Enviar Email
  try {
    await sendAuditionEmail(candidato, pdfBuffer);
  } catch (emailError) {
    console.error("Falha ao enviar o email", emailError);
    // Not blocking the user response, but we might want to log it to a robust system
  }

  return res.status(201).json({
    message: 'Inscrição realizada com sucesso!',
    candidato
  });
};

module.exports = {
  registerAudicao
};
