import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Target, Activity, AlertCircle, Loader, Building, Globe, TrendingUpIcon } from 'lucide-react';

const CompanyAnalysisDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticker, setTicker] = useState('PETR4.SA');
  const [activeTab, setActiveTab] = useState('overview');

  // URL da sua API backend
  const API_BASE_URL = 'http://localhost:8801/api/yahoo'; // Ajuste conforme necessário

  // Função para extrair ticker da URL
  const getTickerFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTicker = urlParams.get('ticker');
    return urlTicker || 'PETR4.SA';
  };

  // Função para buscar dados da empresa
  const fetchCompanyData = async (symbol) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Buscando dados para: ${symbol}`);

      // Buscar dados completos da empresa
      const companyResponse = await fetch(`${API_BASE_URL}/${symbol}`);
      if (!companyResponse.ok) {
        throw new Error(`Erro HTTP: ${companyResponse.status}`);
      }
      const companyData = await companyResponse.json();

      // Buscar dados históricos
      const historicalResponse = await fetch(`${API_BASE_URL}/${symbol}/history?period=1y&interval=1mo`);
      if (!historicalResponse.ok) {
        throw new Error(`Erro HTTP: ${historicalResponse.status}`);
      }
      const historicalResult = await historicalResponse.json();

      setCompanyData(companyData);
      setHistoricalData(historicalResult.data || []);
      setStockData(historicalResult.data || []);

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(`Erro ao buscar dados: ${err.message}`);
      // Fallback com dados simulados
      setCompanyData(getSimulatedCompanyData(symbol));
      setHistoricalData(getSimulatedHistoricalData());
      setStockData(getSimulatedHistoricalData());
    } finally {
      setLoading(false);
    }
  };

  // Dados simulados como fallback
  const getSimulatedCompanyData = (symbol) => ({
    companyInfo: {
      symbol: symbol,
      shortName: 'Petrobras',
      longName: 'Petróleo Brasileiro S.A.',
      sector: 'Energy',
      industry: 'Oil & Gas Integrated',
      country: 'Brazil',
      employees: 45000
    },
    pricing: {
      currentPrice: 28.45,
      change: 0.85,
      changePercent: 3.08,
      dayHigh: 29.10,
      dayLow: 27.80
    },
    volume: {
      volume: 12500000,
      avgVolume: 15600000,
      volumeFormatted: '12.5M',
      avgVolumeFormatted: '15.6M'
    },
    fundamentals: {
      marketCap: 371000000000,
      marketCapFormatted: 'R$ 371.0B',
      peRatio: 8.4,
      pbRatio: 1.2,
      dividendYield: 0.068,
      dividendYieldFormatted: '6.80%',
      beta: 1.15
    },
    financialHealth: {
      roe: 0.125,
      roeFormatted: '12.50%',
      roa: 0.08,
      roaFormatted: '8.00%',
      profitMargins: 0.183,
      profitMarginsFormatted: '18.30%'
    },
    balance: {
      totalDebt: 75000000000,
      totalDebtFormatted: 'R$ 75.0B',
      currentRatio: 2.8,
      debtToEquity: 0.45
    }
  });

  const getSimulatedHistoricalData = () => [
    { month: 'Jan', price: '28.45', priceRaw: 28.45, volume: 1200000, high: '29.80', low: '27.20' },
    { month: 'Fev', price: '29.12', priceRaw: 29.12, volume: 1350000, high: '30.50', low: '28.00' },
    { month: 'Mar', price: '27.89', priceRaw: 27.89, volume: 1180000, high: '29.20', low: '26.50' },
    { month: 'Abr', price: '30.55', priceRaw: 30.55, volume: 1420000, high: '32.10', low: '27.80' },
    { month: 'Mai', price: '32.18', priceRaw: 32.18, volume: 1580000, high: '33.40', low: '30.20' },
    { month: 'Jun', price: '31.67', priceRaw: 31.67, volume: 1490000, high: '33.80', low: '30.90' }
  ];

  useEffect(() => {
    const currentTicker = getTickerFromUrl();
    setTicker(currentTicker);
    fetchCompanyData(currentTicker);
  }, []);

  const handleTickerChange = (newTicker) => {
    setTicker(newTicker);
    const url = new URL(window.location);
    url.searchParams.set('ticker', newTicker);
    window.history.pushState({}, '', url);
    fetchCompanyData(newTicker);
  };

  const MetricCard = ({ title, tooltips, value, change, changePercent, icon: Icon, isPositive, subtitle }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
        {tooltips && (
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="absolute top-2 right-2 text-gray-500 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={showTooltip ? "Hide tooltip" : "Show tooltip"}
          >
            ?
          </button>
        )}

        {showTooltip && tooltips && (
          <div className="absolute top-8 right-2 z-10 text-xs rounded-md p-3 max-w-xs shadow-lg bg-gray-800 text-white border animate-fadeIn">
            {tooltips}
          </div>
        )}

        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-8 w-8 text-blue-500" aria-hidden="true" />}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 truncate">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            
            {change !== undefined && changePercent !== undefined && (
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-sm font-semibold flex items-center ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(changePercent).toFixed(2)}%
                </span>
                <span className={`text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  ({isPositive ? '+' : ''}{change.toFixed(2)})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Carregando dados da empresa...</p>
          <p className="text-gray-500 text-sm mt-2">Buscando informações do Yahoo Finance</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 mb-4">Exibindo dados simulados como exemplo</p>
          <button
            onClick={() => fetchCompanyData(ticker)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = companyData?.pricing?.currentPrice || 0;
  const priceChange = companyData?.pricing?.change || 0;
  const priceChangePercent = companyData?.pricing?.changePercent || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {companyData?.companyInfo?.shortName || ticker}
              </h1>
              <p className="text-gray-600 mt-1">
                {companyData?.companyInfo?.longName || 'Análise Completa da Empresa'}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {companyData?.companyInfo?.sector || 'N/A'}
                </span>
                <span className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {companyData?.companyInfo?.country || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Digite o ticker (ex: PETR4.SA)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleTickerChange(ticker)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
              { id: 'financials', name: 'Fundamentalista', icon: DollarSign },
              { id: 'charts', name: 'Gráficos', icon: TrendingUp },
              { id: 'company', name: 'Empresa', icon: Building }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } border-b-2 px-3 py-2 flex items-center space-x-2 focus:outline-none`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>  
    {/* Overview Tab */}
    {activeTab === 'overview' && (
      <div className="space-y-6">
        {/* Price and Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Preço Atual"
            value={`R$ ${currentPrice.toFixed(2)}`}
            change={priceChange}
            changePercent={priceChangePercent}
            isPositive={priceChange >= 0}
            icon={DollarSign}
            tooltips="Preço atual da ação no mercado"
          />
          <MetricCard
            title="Valor de Mercado"
            value={companyData?.fundamentals?.marketCapFormatted || 'N/A'}
            icon={Target}
            tooltips="Valor total de mercado da empresa (preço da ação × total de ações)"
          />
          <MetricCard
            title="P/L"
            value={companyData?.fundamentals?.peRatio?.toFixed(2) || 'N/A'}
            icon={Activity}
            tooltips="Relação Preço/Lucro (indica quanto os investidores estão dispostos a pagar por cada unidade de lucro)"
          />
          <MetricCard
            title="Dividend Yield"
            value={companyData?.fundamentals?.dividendYieldFormatted || 'N/A'}
            icon={TrendingUpIcon}
            tooltips="Rendimento de dividendos em relação ao preço da ação"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Histórico de Preços (12 meses)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="priceRaw" stroke="#3b82f6" fill="#93c5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Volume Negociado</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="ROE"
            value={companyData?.financialHealth?.roeFormatted || 'N/A'}
            icon={Activity}
            tooltips="Retorno sobre o Patrimônio Líquido (mede a eficiência na geração de lucros com o capital próprio)"
          />
          <MetricCard
            title="Margem Líquida"
            value={companyData?.financialHealth?.profitMarginsFormatted || 'N/A'}
            icon={Activity}
            tooltips="Percentual de lucro em relação à receita total"
          />
          <MetricCard
            title="Dívida/Patrimônio"
            value={companyData?.balance?.debtToEquity?.toFixed(2) || 'N/A'}
            icon={AlertCircle}
            tooltips="Relação entre dívida total e patrimônio líquido (indica alavancagem)"
          />
        </div>
      </div>
    )}

    {/* Financials Tab */}
    {activeTab === 'financials' && (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Indicadores Fundamentais</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">P/L (Preço/Lucro)</span>
                <span className="font-medium">{companyData?.fundamentals?.peRatio?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">P/VP (Preço/Valor Patrimonial)</span>
                <span className="font-medium">{companyData?.fundamentals?.pbRatio?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Dividend Yield</span>
                <span className="font-medium">{companyData?.fundamentals?.dividendYieldFormatted || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Beta (Volatilidade)</span>
                <span className="font-medium">{companyData?.fundamentals?.beta?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Saúde Financeira</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Dívida Total</span>
                <span className="font-medium">{companyData?.balance?.totalDebtFormatted || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Dívida/Patrimônio</span>
                <span className="font-medium">{companyData?.balance?.debtToEquity?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Current Ratio</span>
                <span className="font-medium">{companyData?.balance?.currentRatio?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Margem Líquida</span>
                <span className="font-medium">{companyData?.financialHealth?.profitMarginsFormatted || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Rentabilidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">ROE</h4>
              <p className="text-2xl font-bold mt-1">{companyData?.financialHealth?.roeFormatted || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-1">Retorno sobre Patrimônio</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">ROA</h4>
              <p className="text-2xl font-bold mt-1">{companyData?.financialHealth?.roaFormatted || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-1">Retorno sobre Ativos</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">ROIC</h4>
              <p className="text-2xl font-bold mt-1">N/A</p>
              <p className="text-xs text-gray-500 mt-1">Retorno sobre Capital Investido</p>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Charts Tab */}
    {activeTab === 'charts' && (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Histórico de Preços</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="priceRaw" stroke="#3b82f6" strokeWidth={2} name="Preço (R$)" />
                <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} name="Máxima" />
                <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} name="Mínima" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Volume Negociado</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#8884d8" name="Volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Distribuição de Preços</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Mínima', value: historicalData.reduce((acc, curr) => acc + parseFloat(curr.low || 0), 0) },
                      { name: 'Média', value: historicalData.reduce((acc, curr) => acc + parseFloat(curr.priceRaw || 0), 0) / historicalData.length },
                      { name: 'Máxima', value: historicalData.reduce((acc, curr) => acc + parseFloat(curr.high || 0), 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Company Tab */}
    {activeTab === 'company' && (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Informações da Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Dados Gerais</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome</span>
                  <span className="font-medium">{companyData?.companyInfo?.longName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Setor</span>
                  <span className="font-medium">{companyData?.companyInfo?.sector || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Indústria</span>
                  <span className="font-medium">{companyData?.companyInfo?.industry || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">País</span>
                  <span className="font-medium">{companyData?.companyInfo?.country || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Funcionários</span>
                  <span className="font-medium">{companyData?.companyInfo?.employees?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Atividade no Mercado</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticker</span>
                  <span className="font-medium">{companyData?.companyInfo?.symbol || ticker}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume Médio</span>
                  <span className="font-medium">{companyData?.volume?.avgVolumeFormatted || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume (último dia)</span>
                  <span className="font-medium">{companyData?.volume?.volumeFormatted || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variação (dia)</span>
                  <span className={`font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChangePercent?.toFixed(2)}% ({priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Descrição da Empresa</h3>
          <p className="text-gray-700">
            {companyData?.companyInfo?.longName || 'Nome da empresa'} é uma empresa do setor de {companyData?.companyInfo?.sector || 'setor'} 
            que atua principalmente na área de {companyData?.companyInfo?.industry || 'indústria'}. Com sede em {companyData?.companyInfo?.country || 'país'}, 
            a empresa possui aproximadamente {companyData?.companyInfo?.employees?.toLocaleString() || 'N/A'} funcionários.
          </p>
          <p className="text-gray-700 mt-3">
            Esta análise fornece uma visão geral dos principais indicadores financeiros e de mercado da empresa, 
            permitindo uma avaliação completa de seu desempenho e potencial de investimento.
          </p>
        </div>
      </div>
    )}
  </div>

  {/* Footer */}
  <div className="bg-white border-t mt-8 py-6">
    <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
      <p>Dados fornecidos pelo Yahoo Finance. Última atualização: {new Date().toLocaleDateString()}</p>
      <p className="mt-2">Esta análise não constitui recomendação de investimento.</p>
    </div>
  </div>
</div>
  );
}
export default CompanyAnalysisDashboard;