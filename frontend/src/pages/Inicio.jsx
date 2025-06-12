import React from 'react';
import { ArrowRight, BarChart3, Bookmark, Globe, TrendingUp, Users, Bell, Shield, Zap } from 'lucide-react';

const IntroductionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Análise de Investimentos <span className="text-blue-600">Inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Tome decisões de investimento com confiança utilizando dados precisos, análises fundamentais
            e acompanhamento em tempo real do mercado financeiro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/acao/BBAS3" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Acessar empresas <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="#features" 
              className="px-8 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Conhecer Recursos
            </a>
          </div>
        </div>
      </div>

      {/* Market News Banner */}
      <div className="bg-blue-600 text-white py-4 px-6 mb-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Globe className="h-6 w-6 mr-3" />
            <h3 className="text-lg font-semibold">Acompanhe as últimas notícias do mercado em tempo real</h3>
          </div>
          <a 
            href="/news" 
            className="px-4 py-2 bg-white text-blue-600 font-medium rounded hover:bg-blue-50 transition-colors flex items-center"
          >
            Ver Notícias <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Recursos Poderosos para Investidores</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Análise Fundamentalista</h3>
              </div>
              <p className="text-gray-600">
                Acesse indicadores como P/L, P/VP, ROE, Dividend Yield e muito mais para avaliar a saúde financeira das empresas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Gráficos Avançados</h3>
              </div>
              <p className="text-gray-600">
                Visualize a performance histórica das ações com gráficos interativos e personalizáveis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Notícias do Mercado</h3>
              </div>
              <p className="text-gray-600">
                Fique atualizado com as últimas notícias que impactam suas ações e o mercado financeiro.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <Bookmark className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Listas Personalizadas</h3>
              </div>
              <p className="text-gray-600">
                Crie e acompanhe listas personalizadas de ações para monitorar seus investimentos favoritos.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Alertas Personalizados</h3>
              </div>
              <p className="text-gray-600">
                Configure alertas para preços, volumes e indicadores fundamentais das ações que você acompanha.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Comunidade</h3>
              </div>
              <p className="text-gray-600">
                Conecte-se com outros investidores, compartilhe análises e estratégias de investimento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como Funciona</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-blue-100 p-4 rounded-full flex-shrink-0">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Escolha suas ações</h3>
                <p className="text-gray-600">
                  Selecione as empresas que deseja analisar em nosso banco de dados abrangente.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-green-100 p-4 rounded-full flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Analise os dados</h3>
                <p className="text-gray-600">
                  Explore gráficos interativos, indicadores fundamentais e comparações setoriais.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-purple-100 p-4 rounded-full flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Tome decisões informadas</h3>
                <p className="text-gray-600">
                  Utilize nossas ferramentas para identificar oportunidades e gerenciar riscos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Comece a analisar suas ações hoje mesmo</h2>
          <p className="text-xl mb-8">
            Cadastre-se gratuitamente e tenha acesso a todas as ferramentas de análise e notícias do mercado.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/login" 
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Criar Conta Gratuita
            </a>
            <a 
              href="/demo" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Demonstração
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;

/*
TODO:

FAzer uma demo do site -> Provavelmente último passo


*/
