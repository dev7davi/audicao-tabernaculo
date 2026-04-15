const nodemailer = require('nodemailer');

const sendAuditionEmail = async (data, pdfBuffer) => {
  // Use config do ambiente ou conta de teste Ethereal
  // Para ambiente real, você passará essas vars no .env
  let transporter;
  
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Conta de teste temporária
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    from: '"Sistema de Audições" <noreply@audicoes.com>',
    to: [
      'davi-silva07@hotmail.com',
      'deboraguerradelmondes@gmail.com',
      'richard.delmondes@gmail.com',
      'pr.ricardodelmondes@outlook.com'
    ].join(', '),
    subject: `Nova Inscrição de Audição - ${data.nome_completo}`,
    text: `
      Nova Inscrição Recebida!
      
      Nome: ${data.nome_completo}
      Idade: ${data.idade}
      Estado Civil: ${data.estado_civil}
      WhatsApp: ${data.whatsapp}
      Tempo de Igreja: ${data.tempo_igreja}
      Batizado: ${data.batizado ? 'Sim' : 'Não'}
      Veio de Outra Igreja: ${data.veio_outra_igreja ? 'Sim' : 'Não'}
      Integração: ${data.fez_integracao ? 'Sim' : 'Não'}
      
      Área de Atuação: ${data.area_atuacao}
      Especificação: ${data.instrumento_funcao || 'N/A'}
      Tempo de Experiência: ${data.tempo_experiencia}
      Já Serviu Antes: ${data.ja_serviu_antes ? 'Sim' : 'Não'}
      
      Data da Audição: ${data.data_audicao}
    `,
    attachments: [
      {
        filename: `audicao-${data.nome_completo.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (!process.env.SMTP_HOST) {
    console.log("Preview URL do E-mail de Teste: %s", nodemailer.getTestMessageUrl(info));
  }
};

module.exports = {
  sendAuditionEmail
};
