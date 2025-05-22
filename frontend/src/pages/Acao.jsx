import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Target, Activity, AlertCircle } from 'lucide-react';
import * as Tooltips from '@radix-ui/react-tooltip';



const InfoTooltip = ({ message }) => (
  <Tooltips.Provider>
    <Tooltips.Root>
      <Tooltips.Trigger asChild>
        <span className="ml-1 cursor-pointer text-gray-400">?</span>
      </Tooltips.Trigger>
      <Tooltips.Portal>
        <Tooltips.Content
          side="top"
          className="bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-lg z-50"
        >
          {message}
          <Tooltips.Arrow className="fill-gray-800" />
        </Tooltips.Content>
      </Tooltips.Portal>
    </Tooltips.Root>
  </Tooltips.Provider>
);


const CompanyAnalysisDashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState('PETR4');
  
  // Dados simulados para o último ano
  const stockData = [
    { month: 'Jan', price: 28.45, volume: 1200000, revenue: 85000 },
    { month: 'Feb', price: 29.12, volume: 1350000, revenue: 88000 },
    { month: 'Mar', price: 27.89, volume: 1180000, revenue: 82000 },
    { month: 'Abr', price: 30.55, volume: 1420000, revenue: 92000 },
    { month: 'Mai', price: 32.18, volume: 1580000, revenue: 95000 },
    { month: 'Jun', price: 31.67, volume: 1490000, revenue: 91000 },
    { month: 'Jul', price: 33.42, volume: 1620000, revenue: 98000 },
    { month: 'Ago', price: 35.15, volume: 1750000, revenue: 102000 },
    { month: 'Set', price: 34.88, volume: 1680000, revenue: 99000 },
    { month: 'Out', price: 36.73, volume: 1820000, revenue: 105000 },
    { month: 'Nov', price: 38.91, volume: 1950000, revenue: 110000 },
    { month: 'Dez', price: 37.26, volume: 1870000, revenue: 107000 }
  ];

  const sectorData = [
    { name: 'Petróleo & Gás', value: 45, color: '#3B82F6' },
    { name: 'Tecnologia', value: 25, color: '#10B981' },
    { name: 'Bancos', value: 20, color: '#F59E0B' },
    { name: 'Outros', value: 10, color: '#EF4444' }
  ];

  const companies = [
    { code: 'PETR4', name: 'Petrobras', sector: 'Petróleo & Gás' },
    { code: 'VALE3', name: 'Vale', sector: 'Mineração' },
    { code: 'ITUB4', name: 'Itaú Unibanco', sector: 'Bancos' },
    { code: 'ABEV3', name: 'Ambev', sector: 'Bebidas' }
  ];

  const currentPrice = stockData[stockData.length - 1].price;
  const previousPrice = stockData[stockData.length - 2].price;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100);

const MetricCard = ({ title, tooltips, value, change, changePercent, icon: Icon, isPositive }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm ">
      {/* Tooltip Toggle (top-right) */}
      {tooltips && (
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="absolute top-2 right-2 text-red-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full px-2 py-0.5 text-xs hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={showTooltip ? "Hide tooltip" : "Show tooltip"}
        >
          <h1 className='text-black text-base'>?</h1>
        </button>
      )}

{/* Tooltip Content */}
{showTooltip && tooltips && (
  <div className="absolute top-8 right-2 z-10 text-xs rounded-md p-3 max-w-xs shadow-lg bg-white text-gray-800 border border-gray-200 animate-fadeIn">
    {tooltips}
  </div>
)}

      {/* Card Content */}
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="h-8 w-8 text-blue-500" aria-hidden="true" />}
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-sm font-medium dark:text-black truncate">{title}</h3>

          {/* Main Value */}
          <p className="text-2xl font-bold text-zinc-700 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>

          {/* Change Indicators */}
          <div className="flex items-center space-x-2 mt-2">
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              }`}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(2)}%
            </span>
            <span className={`text-sm text-gray-500 dark:text-gray-400 ${
               isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}>
              ({isPositive ? '' : ''}{change.toFixed(2)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Empresas</h1>
          <p className="text-gray-600">Dashboard completo para análise fundamentalista e técnica</p>
        </div>

       

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Preço Atual"
            tooltips={"Preço atual da ação"}
            value={`R$ ${currentPrice.toFixed(2)}`}
            change={priceChange}
            changePercent={priceChangePercent}
            icon={DollarSign}
            isPositive={priceChange > 0}
          />
          <MetricCard
            title="Volume Médio"
            value="1.65M"
            change={0.15}
            changePercent={10.2}
            icon={BarChart3}
            isPositive={true}
          />
          <MetricCard
            title="Market Cap"
            value="R$ 486B"
            change={12.5}
            changePercent={2.6}
            icon={Users}
            isPositive={true}
          />
          <MetricCard
            title="P/L Ratio"
            value="8.4"
            change={-0.3}
            changePercent={-3.4}
            icon={Activity}
            isPositive={false}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stock Price Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Evolução do Preço - Últimos 12 Meses
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`R$ ${value.toFixed(2)}`, 'Preço']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
              Volume de Negociação
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value.toLocaleString(), 'Volume']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="volume" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue and Sector Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
              Receita (R$ mil)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`R$ ${value.toLocaleString()} mil`, 'Receita']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="revenue" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-500" />
              Distribuição por Setor
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Ratios */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Indicadores Fundamentalistas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">8.4</div>
              <div className="text-sm text-gray-600">P/L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1.2</div>
              <div className="text-sm text-gray-600">P/VP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">12.5%</div>
              <div className="text-sm text-gray-600">ROE</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">18.3%</div>
              <div className="text-sm text-gray-600">Margem Líquida</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2.8</div>
              <div className="text-sm text-gray-600">Liquidez Corrente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">0.45</div>
              <div className="text-sm text-gray-600">Dív. Líquida/EBITDA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">15.2%</div>
              <div className="text-sm text-gray-600">ROIC</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">6.8%</div>
              <div className="text-sm text-gray-600">Dividend Yield</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Análise</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Desempenho:</strong> A ação apresentou valorização de {priceChangePercent.toFixed(1)}% no último mês, com volume de negociação acima da média.</p>
            <p><strong>Fundamentos:</strong> P/L de 8.4x indica empresa subvalorizada em relação ao setor. ROE de 12.5% demonstra boa rentabilidade.</p>
            <p><strong>Dividendos:</strong> Dividend Yield de 6.8% oferece boa remuneração aos acionistas.</p>
            <p><strong>Endividamento:</strong> Dívida líquida controlada em 0.45x o EBITDA, indicando saúde financeira sólida.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalysisDashboard;

//TODO:
/*
O quejá temos:
Consegui buscar dados da cotação por meio de uma API, mas não P/L, PVP, etc...
Banco de dados e sistema de login

O que falta fazer:
Buscar volume de negociação, receita, lucro, etc
Conseguir fazer uma análise do gráfico embaixo mais completa. 
Adicionar uma aba para falar somente da empresa
Adicionar uma aba para falar somente de notícias recentes envolvendo a empresa
*/