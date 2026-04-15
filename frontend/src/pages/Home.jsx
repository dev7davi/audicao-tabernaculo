import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

// Máscara simples para WhatsApp (XX) XXXXX-XXXX
const maskWhatsApp = (value) => {
  if (!value) return "";
  const v = value.replace(/\D/g, "");
  const m = v.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  if (!m) return "";
  return !m[2] ? m[1] : `(${m[1]}) ${m[2]}` + (m[3] ? `-${m[3]}` : "");
};

export const Home = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const area_atuacao = watch("area_atuacao");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError('');
      // Convert string params to boolean appropriately
      const payload = {
        ...data,
        idade: Number(data.idade),
        batizado: data.batizado === 'sim',
        veio_outra_igreja: data.veio_outra_igreja === 'sim',
        fez_integracao: data.fez_integracao === 'sim',
        ja_serviu_antes: data.ja_serviu_antes === 'sim',
      };

      await api.post('/audicoes', payload);
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Ocorreu um erro ao enviar a inscrição.');
    } finally {
      setLoading(false);
    }
  };

  const phoneValue = watch("whatsapp");

  const handlePhoneChange = (e) => {
    setValue("whatsapp", maskWhatsApp(e.target.value));
  };

  if (success) {
    return (
      <div className="container animate-enter">
        <div className="glass-panel success-card">
          <CheckCircle size={64} className="success-icon" />
          <div className="header-title">
            <h1>Inscrição Recebida!</h1>
            <p>Seus dados foram enviados com sucesso. Nossa liderança entrará em contato em breve.</p>
          </div>
          <button 
            className="btn-submit" 
            style={{ maxWidth: '200px', margin: '2rem auto 0' }}
            onClick={() => window.location.reload()}
          >
            Fazer Nova Inscrição
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="container animate-enter">
      <div className="header-title">
        <h1>Audição Musical</h1>
        <p>Tabernáculo Music</p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2.5rem' }}>
        <span className="music-note" style={{ top: '-40px', right: '10%' }}>♪</span>
        <h2>Seja bem-vindo ao processo de audição</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          Este não é apenas um processo musical, mas espiritual. Servir no altar exige mais do que talento — exige compromisso, caráter e alinhamento com os princípios do Reino.
        </p>
        <div className="info-alert">
          <strong>📌 Atenção:</strong> Pedimos que você leia atentamente todas as informações antes de prosseguir com sua inscrição.
        </div>

        <h3 style={{ marginTop: '2.5rem' }}>📅 Datas das Audições</h3>
        <ul className="rules-list">
          <li><strong>Vocal:</strong> 15/05 (sábado) a partir das 16h00</li>
          <li><strong>Instrumentos:</strong> 17/05 ou 24/05 a partir das 10h30</li>
        </ul>

        <h3 style={{ marginTop: '2.5rem' }}>✅ Pré-requisitos para Integração</h3>
        <ul className="rules-list">
          <li>Ter no mínimo 6 meses de frequência ativa na igreja local</li>
          <li>Ser batizado e viver uma vida cristã coerente</li>
          <li>Demonstrar compromisso com a igreja e liderança</li>
        </ul>

        <p style={{ marginTop: '2rem', fontStyle: 'italic', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          “Tudo quanto fizerdes, fazei-o de todo o coração, como para o Senhor.” (Colossenses 3:23)
        </p>
      </div>

      <div className="glass-panel">
        {serverError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
            <AlertCircle size={20} />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            
            {/* Nome */}
            <div className="form-group full-width">
              <label>Nome Completo</label>
              <input 
                {...register("nome_completo", { required: "Nome é obrigatório" })}
                className="form-control"
                placeholder="Ex: João da Silva"
              />
              {errors.nome_completo && <span className="error-message"><AlertCircle size={14}/> {errors.nome_completo.message}</span>}
            </div>

            {/* WhatsApp */}
            <div className="form-group">
              <label>WhatsApp</label>
              <input 
                {...register("whatsapp", { 
                  required: "WhatsApp é obrigatório",
                  minLength: { value: 14, message: "Insira um número válido" }
                })}
                onChange={handlePhoneChange}
                className="form-control"
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
              />
              {errors.whatsapp && <span className="error-message"><AlertCircle size={14}/> {errors.whatsapp.message}</span>}
            </div>

            {/* Idade */}
            <div className="form-group">
              <label>Idade</label>
              <input 
                type="number"
                {...register("idade", { 
                  required: "Idade é obrigatória",
                  min: { value: 12, message: "Idade mínima de 12 anos" }
                })}
                className="form-control"
                placeholder="Sua idade"
              />
              {errors.idade && <span className="error-message"><AlertCircle size={14}/> {errors.idade.message}</span>}
            </div>

            {/* Estado Civil */}
            <div className="form-group">
              <label>Estado Civil</label>
              <select {...register("estado_civil", { required: "Selecione" })} className="form-control">
                <option value="">Selecione...</option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="separado">Separado(a)</option>
                <option value="amaziado">Amaziado(a)</option>
              </select>
              {errors.estado_civil && <span className="error-message"><AlertCircle size={14}/> {errors.estado_civil.message}</span>}
            </div>

            {/* Tempo de Igreja */}
            <div className="form-group">
              <label>Tempo de Igreja</label>
              <select {...register("tempo_igreja", { required: "Selecione" })} className="form-control">
                <option value="">Selecione...</option>
                <option value="Menos de 1 ano">Menos de 1 ano</option>
                <option value="1-3 anos">1 a 3 anos</option>
                <option value="3-5 anos">3 a 5 anos</option>
                <option value="Mais de 5 anos">Mais de 5 anos</option>
              </select>
              {errors.tempo_igreja && <span className="error-message"><AlertCircle size={14}/> {errors.tempo_igreja.message}</span>}
            </div>

            {/* Batizado */}
            <div className="form-group">
              <label>É Batizado?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" value="sim" {...register("batizado", { required: "Obrigatório" })} /> Sim
                </label>
                <label className="radio-label">
                  <input type="radio" value="nao" {...register("batizado", { required: "Obrigatório" })} /> Não
                </label>
              </div>
              {errors.batizado && <span className="error-message"><AlertCircle size={14}/> {errors.batizado.message}</span>}
            </div>

             {/* Outra Igreja */}
             <div className="form-group full-width">
              <label>Veio de outra igreja?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" value="sim" {...register("veio_outra_igreja", { required: "Obrigatório" })} /> Sim
                </label>
                <label className="radio-label">
                  <input type="radio" value="nao" {...register("veio_outra_igreja", { required: "Obrigatório" })} /> Não
                </label>
              </div>
              {errors.veio_outra_igreja && <span className="error-message"><AlertCircle size={14}/> {errors.veio_outra_igreja.message}</span>}
            </div>

            {/* Integração - Condicional */}
            {watch("veio_outra_igreja") === 'sim' && (
              <div className="form-group full-width animate-enter" style={{ marginLeft: '1rem', borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                <label>Já fez integração?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" value="sim" {...register("fez_integracao", { required: "Obrigatório" })} /> Sim
                  </label>
                  <label className="radio-label">
                    <input type="radio" value="nao" {...register("fez_integracao", { required: "Obrigatório" })} /> Não
                  </label>
                </div>
                {errors.fez_integracao && <span className="error-message"><AlertCircle size={14}/> {errors.fez_integracao.message}</span>}
              </div>
            )}

            {/* Area de Atuacao */}
            <div className="form-group full-width">
              <label>Área da audição</label>
              <select {...register("area_atuacao", { required: "Selecione a área" })} className="form-control">
                <option value="">Selecione...</option>
                <option value="Vocal">Vocal</option>
                <option value="Violão">Violão</option>
                <option value="Guitarra">Guitarra</option>
                <option value="Baixo">Baixo</option>
                <option value="Teclado">Teclado</option>
                <option value="Bateria">Bateria</option>
                <option value="Outros">Outros - especifique...</option>
              </select>
              {errors.area_atuacao && <span className="error-message"><AlertCircle size={14}/> {errors.area_atuacao.message}</span>}
            </div>

            {/* Especificacao de outro */}
            {area_atuacao === 'Outros' && (
              <div className="form-group full-width animate-enter">
                <label>Especifique sua área / instrumento</label>
                <input 
                  {...register("instrumento_funcao", { required: "Por favor, especifique" })}
                  className="form-control"
                  placeholder="Qual instrumento?"
                />
                {errors.instrumento_funcao && <span className="error-message"><AlertCircle size={14}/> {errors.instrumento_funcao.message}</span>}
              </div>
            )}

            {/* Tempo de Experiencia */}
            <div className="form-group">
              <label>Tempo de Experiência</label>
              <select {...register("tempo_experiencia", { required: "Selecione" })} className="form-control">
                <option value="">Selecione...</option>
                <option value="Iniciante">Iniciante</option>
                <option value="1-3 anos">1 a 3 anos</option>
                <option value="3-5 anos">3 a 5 anos</option>
                <option value="Mais de 5 anos">Mais de 5 anos</option>
              </select>
              {errors.tempo_experiencia && <span className="error-message"><AlertCircle size={14}/> {errors.tempo_experiencia.message}</span>}
            </div>

             {/* Já Serviu */}
             <div className="form-group">
              <label>Já serviu antes?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" value="sim" {...register("ja_serviu_antes", { required: "Obrigatório" })} /> Sim
                </label>
                <label className="radio-label">
                  <input type="radio" value="nao" {...register("ja_serviu_antes", { required: "Obrigatório" })} /> Não
                </label>
              </div>
              {errors.ja_serviu_antes && <span className="error-message"><AlertCircle size={14}/> {errors.ja_serviu_antes.message}</span>}
            </div>

            {/* Data Audição condicionada a area de atuacao */}
            <div className="form-group full-width">
              <label>Escolha da Data e Horário</label>
              <select {...register("data_audicao", { required: "Obrigatório escolher uma data" })} className="form-control">
                <option value="">Selecione um horário disponível...</option>
                {area_atuacao === 'Vocal' ? (
                   <option value="15/05 das 16h as 19h">15/05 das 16h as 19h (Vocal)</option>
                ) : area_atuacao && area_atuacao !== 'Vocal' ? (
                   <>
                     <option value="17/05 das 10h30 as 12h">17/05 das 10h30 as 12h (Instrumental)</option>
                     <option value="24/05 das 10h30 as 12h">24/05 das 10h30 as 12h (Instrumental)</option>
                   </>
                ) : (
                   <option value="" disabled>Selecione uma área de audição primeiro</option>
                )}
              </select>
              {errors.data_audicao && <span className="error-message"><AlertCircle size={14}/> {errors.data_audicao.message}</span>}
            </div>

          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <><Loader2 size={24} className="animate-spin" /> Adicionando à Lista...</>
            ) : (
              'Confirmar Inscrição'
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

