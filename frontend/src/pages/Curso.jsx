import React, { useState } from "react";
import { TrendingUp, Shield, BookOpen, Target, AlertTriangle, ChevronRight, Clock, Users, Star, Play, CheckCircle } from "lucide-react";

const courseContent = [
  {
    title: "1. Introdução aos Investimentos",
    description: "Aprenda o que são investimentos, por que investir e os principais conceitos para iniciantes.",
    duration: "45 min",
    difficulty: "Iniciante",
    icon: <BookOpen className="w-6 h-6" />,
    topics: [
      "O que é investir?",
      "Por que investir?",
      "Riscos e retornos",
      "Perfil do investidor",
    ],
    detailedContent: "Neste módulo, você descobrirá os fundamentos dos investimentos e como eles podem transformar sua vida financeira. Aprenderá sobre juros compostos, inflação e como começar mesmo com pouco dinheiro."
  },
  {
    title: "2. Tipos de Investimentos",
    description: "Conheça os principais tipos de investimentos disponíveis no mercado.",
    duration: "60 min",
    difficulty: "Iniciante",
    icon: <TrendingUp className="w-6 h-6" />,
    topics: [
      "Renda fixa (CDB, Tesouro Direto, LCI/LCA)",
      "Renda variável (Ações, Fundos Imobiliários)",
      "Fundos de investimento",
      "Criptomoedas",
    ],
    detailedContent: "Explore o universo dos investimentos, desde os mais conservadores até os mais arrojados. Compare rentabilidades, liquidez e riscos de cada modalidade."
  },
  {
    title: "3. Como Começar a Investir",
    description: "Passo a passo para abrir conta em corretora e começar a investir com segurança.",
    duration: "50 min",
    difficulty: "Iniciante",
    icon: <Target className="w-6 h-6" />,
    topics: [
      "Abrindo conta em uma corretora",
      "Documentação necessária",
      "Primeiros aportes",
      "Montando uma carteira inicial",
    ],
    detailedContent: "Guia prático completo para dar seus primeiros passos no mundo dos investimentos. Desde a escolha da corretora até sua primeira aplicação."
  },
  {
    title: "4. Estratégias de Investimento",
    description: "Descubra estratégias para potencializar seus ganhos e minimizar riscos.",
    duration: "70 min",
    difficulty: "Intermediário",
    icon: <Shield className="w-6 h-6" />,
    topics: [
      "Diversificação",
      "Investimento de longo prazo",
      "Aportes regulares",
      "Rebalanceamento de carteira",
    ],
    detailedContent: "Estratégias testadas pelos maiores investidores do mundo. Aprenda a construir uma carteira sólida e resiliente a diferentes cenários de mercado."
  },
  {
    title: "5. Dicas e Cuidados",
    description: "Dicas práticas e cuidados essenciais para investir com responsabilidade.",
    duration: "40 min",
    difficulty: "Iniciante",
    icon: <AlertTriangle className="w-6 h-6" />,
    topics: [
      "Evite promessas de ganhos fáceis",
      "Cuidado com fraudes",
      "Educação financeira contínua",
      "Busque orientação profissional",
    ],
    detailedContent: "Proteja seu patrimônio conhecendo as principais armadilhas do mercado financeiro. Dicas para identificar esquemas fraudulentos e investir com segurança."
  },
];

const stats = [
  { icon: <Users className="w-8 h-8" />, number: "15.000+", label: "Alunos formados" },
  { icon: <Star className="w-8 h-8" />, number: "4.9", label: "Avaliação média" },
  { icon: <Clock className="w-8 h-8" />, number: "5h", label: "Duração total" },
  { icon: <CheckCircle className="w-8 h-8" />, number: "100%", label: "Online e gratuito" },
];

const benefits = [
  "Aprenda no seu ritmo, quando e onde quiser",
  "Conteúdo atualizado com as melhores práticas do mercado",
  "Suporte completo para iniciantes",
  "Certificado de conclusão",
  "Acesso vitalício ao conteúdo",
  "Exemplos práticos e estudos de caso reais"
];

export default function Curso() {
  const [expandedModule, setExpandedModule] = useState(null);

  const toggleModule = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Curso Gratuito • 100% Online
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Como <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Investir</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforme sua vida financeira com este curso completo e gratuito. 
              Aprenda a investir do zero com segurança e responsabilidade.
            </p>
            <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Começar Agora
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Conteúdo do Curso</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            5 módulos cuidadosamente estruturados para você dominar os investimentos
          </p>
        </div>

        <div className="space-y-6">
          {courseContent.map((module, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleModule(idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-gray-600 mb-3">{module.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          <Clock className="w-4 h-4 mr-1" />
                          {module.duration}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedModule === idx ? 'rotate-90' : ''}`} />
                </div>
              </div>
              
              {expandedModule === idx && (
                <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                  <div className="pt-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">{module.detailedContent}</p>
                    <h4 className="font-semibold text-gray-900 mb-3">O que você vai aprender:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {module.topics.map((topic, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Por que escolher nosso curso?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Mais de 15.000 pessoas já transformaram suas vidas financeiras com nosso método comprovado.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-black">
                  <div className="text-2xl font-bold mb-2">Comece hoje mesmo!</div>
                  <div className="text-lg mb-6">100% Gratuito • Sem pegadinhas</div>
                  <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                    Inscrever-se Grátis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="text-lg text-gray-700 font-medium mb-4">
            ⚠️ Aviso Importante
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Investir envolve riscos de perda de capital. As informações apresentadas neste curso são apenas para fins educacionais. 
            Sempre estude, consulte profissionais qualificados e invista de acordo com seu perfil de risco.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500">
              © 2025 Curso Como Investir. Feito com ❤️ para sua educação financeira.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}