import type { DiscProfile, ResultadoDisc } from '../types/database'

export interface DiscQuestion {
  id: number
  texto: string
  opcoes: {
    texto: string
    perfil: DiscProfile
  }[]
}

export const DISC_QUESTIONS: DiscQuestion[] = [
  {
    id: 1,
    texto: 'Em situações de pressão, você tende a:',
    opcoes: [
      { texto: 'Assumir o controle e agir rapidamente', perfil: 'D' },
      { texto: 'Motivar e animar as pessoas ao redor', perfil: 'I' },
      { texto: 'Manter a calma e apoiar a equipe', perfil: 'S' },
      { texto: 'Analisar os dados antes de agir', perfil: 'C' },
    ],
  },
  {
    id: 2,
    texto: 'Qual das frases melhor descreve como você toma decisões?',
    opcoes: [
      { texto: 'Decido rapidamente com base nos resultados esperados', perfil: 'D' },
      { texto: 'Consulto as pessoas e levo o feeling em conta', perfil: 'I' },
      { texto: 'Prefiro o consenso e evito conflitos', perfil: 'S' },
      { texto: 'Pesquiso bastante e analiso todos os riscos', perfil: 'C' },
    ],
  },
  {
    id: 3,
    texto: 'Como você prefere trabalhar?',
    opcoes: [
      { texto: 'Com autonomia e metas desafiadoras', perfil: 'D' },
      { texto: 'Em equipes animadas com muito contato social', perfil: 'I' },
      { texto: 'Em ambiente estável, com rotinas bem definidas', perfil: 'S' },
      { texto: 'Com processos claros e critérios objetivos', perfil: 'C' },
    ],
  },
  {
    id: 4,
    texto: 'Quando há um conflito no grupo, você costuma:',
    opcoes: [
      { texto: 'Enfrentar diretamente e resolver logo', perfil: 'D' },
      { texto: 'Tentar conciliar com entusiasmo e humor', perfil: 'I' },
      { texto: 'Ouvir todos e buscar uma solução pacífica', perfil: 'S' },
      { texto: 'Analisar os fatos e propor uma solução lógica', perfil: 'C' },
    ],
  },
  {
    id: 5,
    texto: 'O que mais te motiva profissionalmente?',
    opcoes: [
      { texto: 'Conquistar objetivos e superar desafios', perfil: 'D' },
      { texto: 'Reconhecimento, elogios e conexões sociais', perfil: 'I' },
      { texto: 'Segurança, estabilidade e boas relações', perfil: 'S' },
      { texto: 'Qualidade, precisão e competência técnica', perfil: 'C' },
    ],
  },
  {
    id: 6,
    texto: 'Como você reage a mudanças inesperadas?',
    opcoes: [
      { texto: 'Me adapto rápido e vejo como oportunidade', perfil: 'D' },
      { texto: 'Fico animado e encaro como algo novo e interessante', perfil: 'I' },
      { texto: 'Prefiro a estabilidade, mas me ajusto com tempo', perfil: 'S' },
      { texto: 'Me preocupo com os riscos e preciso entender bem antes', perfil: 'C' },
    ],
  },
  {
    id: 7,
    texto: 'Em uma reunião de equipe, você tende a:',
    opcoes: [
      { texto: 'Liderar a pauta e direcionar as decisões', perfil: 'D' },
      { texto: 'Animar o ambiente e manter todos engajados', perfil: 'I' },
      { texto: 'Ouvir com atenção e apoiar os colegas', perfil: 'S' },
      { texto: 'Registrar tudo e garantir que os detalhes sejam cobertos', perfil: 'C' },
    ],
  },
  {
    id: 8,
    texto: 'Quando comete um erro, qual é sua primeira reação?',
    opcoes: [
      { texto: 'Identificar rapidamente e corrigir o curso', perfil: 'D' },
      { texto: 'Compartilhar com alguém para desabafar e encontrar uma saída', perfil: 'I' },
      { texto: 'Refletir com calma e evitar repetir o erro', perfil: 'S' },
      { texto: 'Analisar o que deu errado sistematicamente', perfil: 'C' },
    ],
  },
  {
    id: 9,
    texto: 'Como você prefere receber feedback?',
    opcoes: [
      { texto: 'Direto ao ponto, sem rodeios', perfil: 'D' },
      { texto: 'De forma positiva, enaltecendo os pontos fortes', perfil: 'I' },
      { texto: 'Com sensibilidade e consideração pelos sentimentos', perfil: 'S' },
      { texto: 'Com dados e exemplos concretos', perfil: 'C' },
    ],
  },
  {
    id: 10,
    texto: 'Qual é o seu maior ponto forte?',
    opcoes: [
      { texto: 'Objetividade e capacidade de liderança', perfil: 'D' },
      { texto: 'Comunicação e carisma', perfil: 'I' },
      { texto: 'Empatia e lealdade', perfil: 'S' },
      { texto: 'Atenção aos detalhes e rigor analítico', perfil: 'C' },
    ],
  },
  {
    id: 11,
    texto: 'Em um projeto, você prefere ser:',
    opcoes: [
      { texto: 'O responsável pelas decisões e resultados', perfil: 'D' },
      { texto: 'O elo de comunicação e motivação do time', perfil: 'I' },
      { texto: 'O suporte confiável que mantém tudo funcionando', perfil: 'S' },
      { texto: 'O especialista que garante a qualidade', perfil: 'C' },
    ],
  },
  {
    id: 12,
    texto: 'Como você lida com prazos apertados?',
    opcoes: [
      { texto: 'Acelero o ritmo e foco no essencial para entregar', perfil: 'D' },
      { texto: 'Peço ajuda e trabalho em equipe para dar conta', perfil: 'I' },
      { texto: 'Me organizo com antecedência para evitar essa situação', perfil: 'S' },
      { texto: 'Reavaliou prioridades com cuidado para não comprometer a qualidade', perfil: 'C' },
    ],
  },
  {
    id: 13,
    texto: 'O que mais te incomoda no ambiente de trabalho?',
    opcoes: [
      { texto: 'Falta de autonomia e burocracia excessiva', perfil: 'D' },
      { texto: 'Isolamento e falta de interação com as pessoas', perfil: 'I' },
      { texto: 'Conflitos constantes e ambiente instável', perfil: 'S' },
      { texto: 'Desorganização e falta de padrões', perfil: 'C' },
    ],
  },
  {
    id: 14,
    texto: 'Quando precisa aprender algo novo, você prefere:',
    opcoes: [
      { texto: 'Aprender na prática, tentando e errando', perfil: 'D' },
      { texto: 'Aprender em grupo, trocando experiências', perfil: 'I' },
      { texto: 'Seguir um passo a passo estruturado', perfil: 'S' },
      { texto: 'Estudar profundamente antes de aplicar', perfil: 'C' },
    ],
  },
  {
    id: 15,
    texto: 'Como as pessoas próximas te descrevem?',
    opcoes: [
      { texto: 'Determinado, direto e conquistador', perfil: 'D' },
      { texto: 'Animado, social e inspirador', perfil: 'I' },
      { texto: 'Paciente, confiável e gentil', perfil: 'S' },
      { texto: 'Meticuloso, preciso e analítico', perfil: 'C' },
    ],
  },
  {
    id: 16,
    texto: 'Ao planejar suas metas, você costuma:',
    opcoes: [
      { texto: 'Definir objetivos ousados e traçar o caminho mais curto', perfil: 'D' },
      { texto: 'Compartilhar com todos e buscar apoio', perfil: 'I' },
      { texto: 'Planejar com calma, garantindo sustentabilidade', perfil: 'S' },
      { texto: 'Detalhar cada etapa e criar métricas precisas', perfil: 'C' },
    ],
  },
  {
    id: 17,
    texto: 'Em situações de crise, você:',
    opcoes: [
      { texto: 'Toma a frente e age imediatamente', perfil: 'D' },
      { texto: 'Busca apoio e tenta manter o ânimo da equipe', perfil: 'I' },
      { texto: 'Mantém a calma e oferece suporte a todos', perfil: 'S' },
      { texto: 'Analisa as causas e busca a solução mais segura', perfil: 'C' },
    ],
  },
  {
    id: 18,
    texto: 'O que define sucesso para você?',
    opcoes: [
      { texto: 'Alcançar resultados expressivos e ser reconhecido como líder', perfil: 'D' },
      { texto: 'Ter boas relações e ser querido e respeitado', perfil: 'I' },
      { texto: 'Ter estabilidade, harmonia e segurança', perfil: 'S' },
      { texto: 'Fazer um trabalho impecável com excelência técnica', perfil: 'C' },
    ],
  },
  {
    id: 19,
    texto: 'Quando precisa convencer alguém, você usa:',
    opcoes: [
      { texto: 'Argumentos diretos e focados em resultados', perfil: 'D' },
      { texto: 'Entusiasmo e apelo emocional', perfil: 'I' },
      { texto: 'Paciência, construindo confiança gradualmente', perfil: 'S' },
      { texto: 'Dados, fatos e lógica', perfil: 'C' },
    ],
  },
  {
    id: 20,
    texto: 'Como você prefere organizar seu dia?',
    opcoes: [
      { texto: 'Com liberdade para priorizar conforme as demandas surgem', perfil: 'D' },
      { texto: 'Com espaço para interações e imprevistos sociais', perfil: 'I' },
      { texto: 'Com uma rotina estável e previsível', perfil: 'S' },
      { texto: 'Com agenda detalhada e metas bem definidas', perfil: 'C' },
    ],
  },
  {
    id: 21,
    texto: 'Qual tipo de líder você mais admira?',
    opcoes: [
      { texto: 'Visionário, ousado e orientado a resultados', perfil: 'D' },
      { texto: 'Inspirador, carismático e que conecta as pessoas', perfil: 'I' },
      { texto: 'Empático, justo e que cuida da equipe', perfil: 'S' },
      { texto: 'Técnico, metódico e comprometido com a excelência', perfil: 'C' },
    ],
  },
  {
    id: 22,
    texto: 'Quando surge uma oportunidade nova, você:',
    opcoes: [
      { texto: 'Age rapidamente para não perder o timing', perfil: 'D' },
      { texto: 'Se empolga e compartilha com todos', perfil: 'I' },
      { texto: 'Avalia com cuidado antes de se comprometer', perfil: 'S' },
      { texto: 'Pesquisa profundamente todos os aspectos primeiro', perfil: 'C' },
    ],
  },
  {
    id: 23,
    texto: 'Sua comunicação no trabalho costuma ser:',
    opcoes: [
      { texto: 'Direta, objetiva e focada nos resultados', perfil: 'D' },
      { texto: 'Expressiva, entusiástica e com storytelling', perfil: 'I' },
      { texto: 'Gentil, cuidadosa e considerada', perfil: 'S' },
      { texto: 'Precisa, estruturada e baseada em fatos', perfil: 'C' },
    ],
  },
  {
    id: 24,
    texto: 'O que você prioriza em um trabalho de equipe?',
    opcoes: [
      { texto: 'Eficiência e entrega de resultados rápidos', perfil: 'D' },
      { texto: 'Bom clima, colaboração e engajamento de todos', perfil: 'I' },
      { texto: 'Harmonia, confiança e relacionamentos saudáveis', perfil: 'S' },
      { texto: 'Qualidade, rigor e processos bem definidos', perfil: 'C' },
    ],
  },
]

export function calculateDiscResult(respostas: Record<number, DiscProfile>): ResultadoDisc {
  const contagem = { D: 0, I: 0, S: 0, C: 0 }

  Object.values(respostas).forEach((perfil) => {
    contagem[perfil]++
  })

  const total = Object.values(contagem).reduce((a, b) => a + b, 0)

  const percentuais = {
    d: Math.round((contagem.D / total) * 100),
    i: Math.round((contagem.I / total) * 100),
    s: Math.round((contagem.S / total) * 100),
    c: Math.round((contagem.C / total) * 100),
  }

  const perfilPredominante = (Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0]) as DiscProfile

  return {
    d: contagem.D,
    i: contagem.I,
    s: contagem.S,
    c: contagem.C,
    perfil_predominante: perfilPredominante,
    percentuais,
  }
}

export interface DiscProfileInfo {
  nome: string
  titulo: string
  descricao: string
  caracteristicas: string[]
  pontosFortres: string[]
  desafios: string[]
  cor: string
  emoji: string
}

export const DISC_PROFILES: Record<DiscProfile, DiscProfileInfo> = {
  D: {
    nome: 'Dominância',
    titulo: 'O Executor',
    descricao:
      'Você é uma pessoa orientada a resultados, direta e decisiva. Tem uma capacidade natural de liderança e não tem medo de enfrentar desafios. Age com rapidez e determinação, sempre com o foco no que importa: atingir os objetivos.',
    caracteristicas: [
      'Orientado a resultados',
      'Decisivo e direto',
      'Autoconfiante',
      'Competitivo',
      'Independente',
      'Determinado',
    ],
    pontosFortres: [
      'Liderança natural em situações de pressão',
      'Alta capacidade de tomar decisões rápidas',
      'Foco intenso em metas e resultados',
      'Disposição para enfrentar desafios',
    ],
    desafios: [
      'Pode parecer impaciente ou dominador',
      'Tendência a ignorar os sentimentos dos outros',
      'Dificuldade em delegar tarefas',
      'Pode ser excessivamente competitivo',
    ],
    cor: '#e05252',
    emoji: '🔥',
  },
  I: {
    nome: 'Influência',
    titulo: 'O Comunicador',
    descricao:
      'Você é uma pessoa energética, otimista e com grande habilidade social. Seu entusiasmo é contagiante e você tem o dom de inspirar e motivar as pessoas ao seu redor. Brilha em ambientes colaborativos e é um excelente comunicador.',
    caracteristicas: [
      'Comunicativo e expressivo',
      'Entusiasta e otimista',
      'Persuasivo',
      'Criativo',
      'Sociável',
      'Inspirador',
    ],
    pontosFortres: [
      'Habilidade de motivar e engajar equipes',
      'Excelente comunicação e persuasão',
      'Facilidade em criar conexões e redes',
      'Criatividade e pensamento inovador',
    ],
    desafios: [
      'Pode ser impulsivo e desorganizado',
      'Tendência a evitar conflitos e dar más notícias',
      'Dificuldade em focar nos detalhes',
      'Pode ser superficial em algumas análises',
    ],
    cor: '#f5a623',
    emoji: '⚡',
  },
  S: {
    nome: 'Estabilidade',
    titulo: 'O Apoiador',
    descricao:
      'Você é uma pessoa leal, paciente e confiável. Valoriza profundamente as relações humanas e tem uma capacidade extraordinária de ouvir e apoiar os outros. É o pilar que sustenta as equipes, transmitindo segurança e harmonia.',
    caracteristicas: [
      'Empático e colaborativo',
      'Paciente e persistente',
      'Confiável e leal',
      'Bom ouvinte',
      'Consistente',
      'Harmonioso',
    ],
    pontosFortres: [
      'Habilidade de criar ambientes harmoniosos',
      'Lealdade e comprometimento excepcionais',
      'Excelente capacidade de ouvir e apoiar',
      'Consistência e confiabilidade',
    ],
    desafios: [
      'Resistência a mudanças rápidas',
      'Dificuldade em dizer não',
      'Pode evitar conflitos necessários',
      'Tendência a ser muito dependente da aprovação alheia',
    ],
    cor: '#52c87a',
    emoji: '🌿',
  },
  C: {
    nome: 'Conformidade',
    titulo: 'O Analista',
    descricao:
      'Você é uma pessoa precisa, analítica e orientada à qualidade. Tem um padrão de excelência elevado e não abre mão dos detalhes. É o especialista que todos buscam quando precisam de uma análise profunda e de soluções bem fundamentadas.',
    caracteristicas: [
      'Analítico e preciso',
      'Meticuloso e detalhista',
      'Sistemático',
      'Alto padrão de qualidade',
      'Lógico',
      'Diplomático',
    ],
    pontosFortres: [
      'Análise profunda e rigorosa de dados',
      'Atenção excepcional aos detalhes',
      'Comprometimento com qualidade e excelência',
      'Pensamento lógico e sistemático',
    ],
    desafios: [
      'Pode ser perfeccionista em excesso',
      'Dificuldade em tomar decisões rápidas',
      'Tendência ao isolamento social',
      'Pode ser excessivamente crítico',
    ],
    cor: '#4a90d9',
    emoji: '🔬',
  },
}
