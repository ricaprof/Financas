import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Brain, Calendar, Building, Users, Globe, RefreshCw, AlertCircle, Search } from 'lucide-react';

const StockDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Função para extrair o símbolo da URL
  const getSymbolFromUrl = () => {
    const path = window.location.pathname;
    const matches = path.match(/\/acao\/([^\/]+)/);
    return matches ? matches[1].toUpperCase() : 'BBAS3';
  };

  // Função para buscar dados da API
  const fetchStockData = async (stockSymbol) => {
    setLoading(true);
    setError(null);
    
    try {
      // Substitua pela URL da sua API
      const response = await fetch(`http://localhost:8801/api/yahoo/${stockSymbol}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Assumindo que a resposta tem a estrutura: { dadosCompletos: {...}, graficoMensal: [...] }
      const processedData = {
        ...data.dadosCompletos,
        historicalData: data.graficoMensal?.map(item => ({
          date: new Date(item.date * 1000).toLocaleDateString('pt-BR'),
          price: item.close,
          volume: item.volume,
          high: item.high,
          low: item.low,
          open: item.open
        })) || []
      };
      
      setStockData(processedData);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados baseado na URL
  useEffect(() => {
    const urlSymbol = getSymbolFromUrl();
    setSymbol(urlSymbol);
    fetchStockData(urlSymbol);
  }, []);

  // Handle search for new stock
  const handleSearch = () => {
    if (symbol.trim()) {
      // Atualizar URL sem recarregar a página
      window.history.pushState({}, '', `/acao/${symbol.toUpperCase()}`);
      fetchStockData(symbol.toUpperCase());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Função para gerar análise da IA
  const generateAIAnalysis = () => {
    if (!stockData) return;
    
    setIsAnalyzing(true);
    
    // Simulação de análise da IA baseada nos dados
    setTimeout(() => {
      const currentPrice = stockData.regularMarketPrice;
      const change = stockData.regularMarketChange;
      const changePercent = stockData.regularMarketChangePercent;
      const pe = stockData.priceEarnings;
      const marketCap = stockData.marketCap;
      
      let analysis = `🤖 **Análise IA para ${stockData.symbol}**\n\n`;
      
      // Análise de preço
      if (change > 0) {
        analysis += `📈 **Movimento Positivo**: A ação está em alta de ${changePercent.toFixed(2)}%, sinalizando momentum positivo no curto prazo.\n\n`;
      } else {
        analysis += `📉 **Movimento Negativo**: A ação recuou ${Math.abs(changePercent).toFixed(2)}%, mas isso pode representar uma oportunidade de entrada.\n\n`;
      }
      
      // Análise P/E
      if (pe < 10) {
        analysis += `💰 **P/E Atrativo**: Com P/E de ${pe.toFixed(2)}, a ação aparenta estar subvalorizada comparada ao setor bancário.\n\n`;
      } else if (pe > 15) {
        analysis += `⚠️ **P/E Elevado**: P/E de ${pe.toFixed(2)} pode indicar sobrevalorização. Cautela recomendada.\n\n`;
      } else {
        analysis += `✅ **P/E Equilibrado**: P/E de ${pe.toFixed(2)} está dentro de patamares razoáveis para o setor.\n\n`;
      }
      
      // Análise de volume
      analysis += `📊 **Volume**: Movimentação de ${(stockData.regularMarketVolume / 1000000).toFixed(1)}M de ações indica ${stockData.regularMarketVolume > 30000000 ? 'alto' : 'moderado'} interesse do mercado.\n\n`;
      
      // Recomendação final
      const recommendation = change > 0 && pe < 12 ? 'COMPRA' : change < -2 && pe < 10 ? 'OPORTUNIDADE' : 'OBSERVAR';
      analysis += `🎯 **Recomendação**: ${recommendation}\n\n`;
      analysis += `⚠️ *Esta análise é apenas informativa e não constitui recomendação de investimento.*`;
      
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-gray-800 text-xl font-bold mb-2">Erro ao carregar dados</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchStockData(getSymbolFromUrl())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stockData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/40 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{stockData.longName}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-blue-600">{stockData.symbol}</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      onKeyPress={handleKeyPress}
                      className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: PETR4"
                    />
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {formatCurrency(stockData.regularMarketPrice)}
              </div>
              <div className={`flex items-center justify-end gap-2 ${stockData.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.regularMarketChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-lg font-semibold">
                  {stockData.regularMarketChange >= 0 ? '+' : ''}{stockData.regularMarketChange?.toFixed(2)} 
                  ({stockData.regularMarketChangePercent?.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 border border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-700" />
                <span className="text-gray-700 font-medium">Abertura</span>
              </div>
              <div className="text-xl font-bold text-gray-800">{formatCurrency(stockData.regularMarketOpen)}</div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 border border-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-700" />
                <span className="text-gray-700 font-medium">Volume</span>
              </div>
              <div className="text-xl font-bold text-gray-800">{formatNumber(stockData.regularMarketVolume)}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-4 border border-purple-300">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-700" />
                <span className="text-gray-700 font-medium">Máx 52s</span>
              </div>
              <div className="text-xl font-bold text-gray-800">{formatCurrency(stockData.fiftyTwoWeekHigh)}</div>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-4 border border-orange-300">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-orange-700" />
                <span className="text-gray-700 font-medium">Mín 52s</span>
              </div>
              <div className="text-xl font-bold text-gray-800">{formatCurrency(stockData.fiftyTwoWeekLow)}</div>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 mb-6 border border-white/40 shadow-lg">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'fundamentals', label: 'Fundamentos', icon: Building },
              { id: 'ai', label: 'Análise IA', icon: Brain }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de preço */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Evolução do Preço (3 meses)</h3>
              {stockData.historicalData && stockData.historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={stockData.historicalData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        color: '#1F2937',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  Dados históricos não disponíveis
                </div>
              )}
            </div>

            {/* Volume */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Volume de Negociação</h3>
              {stockData.historicalData && stockData.historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockData.historicalData.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        color: '#1F2937',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="volume" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-500">
                  Dados de volume não disponíveis
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'fundamentals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Valuation
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">P/L</span>
                  <span className="text-gray-800 font-bold text-lg">{stockData.priceEarnings?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">LPA</span>
                  <span className="text-gray-800 font-bold text-lg">{formatCurrency(stockData.earningsPerShare)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Valor de Mercado</span>
                  <span className="text-gray-800 font-bold text-lg">
                    R$ {(stockData.marketCap / 1000000000).toFixed(1)}B
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Informações da Empresa
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Setor</span>
                  <span className="text-gray-800 font-bold">Financeiro</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Segmento</span>
                  <span className="text-gray-800 font-bold">Bancos</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Funcionários</span>
                  <span className="text-gray-800 font-bold">85.953</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Métricas de Mercado
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Variação Dia</span>
                  <span className={`font-bold text-lg ${stockData.regularMarketChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockData.regularMarketChangePercent?.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Máxima do Dia</span>
                  <span className="text-gray-800 font-bold text-lg">{formatCurrency(stockData.regularMarketDayHigh)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Mínima do Dia</span>
                  <span className="text-gray-800 font-bold text-lg">{formatCurrency(stockData.regularMarketDayLow)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Análise Inteligente
              </h3>
              <button
                onClick={generateAIAnalysis}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-400 disabled:to-purple-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 font-medium"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Gerar Análise
                  </>
                )}
              </button>
            </div>

            {aiAnalysis ? (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 shadow-inner">
                <div className="text-gray-800 whitespace-pre-line leading-relaxed font-medium">
                  {aiAnalysis}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-12 h-12 text-purple-600" />
                </div>
                <p className="text-gray-600 text-lg font-medium">Clique em "Gerar Análise" para obter insights inteligentes sobre esta ação</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;