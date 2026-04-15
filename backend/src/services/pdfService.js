const PDFDocument = require('pdfkit');

const createAuditionPDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Estilo Base
      doc.font('Helvetica-Bold').fontSize(20).text('Audição – Ministério de Música', { align: 'center' });
      doc.moveDown(2);

      const addSection = (title, fields) => {
        doc.font('Helvetica-Bold').fontSize(14).text(title);
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(12);
        
        fields.forEach(f => {
          doc.text(`${f.label}: `, { continued: true }).font('Helvetica-Bold').text(String(f.value)).font('Helvetica');
        });
        doc.moveDown(1);
      };

      addSection('Dados Pessoais', [
        { label: 'Nome', value: data.nome_completo },
        { label: 'Idade', value: data.idade },
        { label: 'Estado Civil', value: data.estado_civil },
        { label: 'WhatsApp', value: data.whatsapp },
      ]);

      addSection('Vida Cristã', [
        { label: 'Tempo de Igreja', value: data.tempo_igreja },
        { label: 'Batizado', value: data.batizado ? 'Sim' : 'Não' },
        { label: 'Veio de Outra Igreja', value: data.veio_outra_igreja ? 'Sim' : 'Não' },
        { label: 'Integração', value: data.fez_integracao ? 'Sim' : 'Não' },
      ]);

      addSection('Área de Atuação', [
        { label: 'Área/Instrumento', value: data.area_atuacao },
        { label: 'Outros/Especificação', value: data.instrumento_funcao || 'Nulo' },
      ]);

      addSection('Experiência', [
        { label: 'Tempo de Experiência', value: data.tempo_experiencia },
        { label: 'Já Serviu Antes', value: data.ja_serviu_antes ? 'Sim' : 'Não' },
      ]);

      addSection('Agendamento', [
        { label: 'Data da Audição', value: data.data_audicao },
      ]);
      
      doc.moveDown(2);
      doc.fontSize(10).fillColor('gray').text(`Inscrição recebida em: ${new Date(data.data_inscricao || new Date()).toLocaleString('pt-BR')}`, { align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createAuditionPDF
};
