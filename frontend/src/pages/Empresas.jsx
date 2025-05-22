import React, { useState } from 'react';
import { ArrowUp, ArrowDown, BarChart2, Filter, Search, Star, TrendingUp, DollarSign, PieChart, Layers } from 'lucide-react';

const CompaniesPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados simulados das empresas
  const companiesData = [
    {
      id: 1,
      code: 'PETR4',
      name: 'Petrobras',
      sector: 'Petróleo & Gás',
      price: 37.26,
      change: 1.45,
      changePercent: 4.05,
      dividendYield: 6.8,
      pl: 8.4,
      pvp: 1.2,
      volume: '1.87M',
      marketCap: 'R$ 486B',
      favorite: true
    },
    {
      id: 2,
      code: 'VALE3',
      name: 'Vale S.A.',
      sector: 'Mineração',
      price: 68.91,
      change: -0.89,
      changePercent: -1.28,
      dividendYield: 8.2,
      pl: 5.7,
      pvp: 1.8,
      volume: '2.45M',
      marketCap: 'R$ 312B',
      favorite: false
    },
    {
      id: 3,
      code: 'ITUB4',
      name: 'Itaú Unibanco',
      sector: 'Bancos',
      price: 32.15,
      change: 0.45,
      changePercent: 1.42,
      dividendYield: 5.3,
      pl: 10.2,
      pvp: 1.5,
      volume: '3.12M',
      marketCap: 'R$ 298B',
      favorite: true
    },
    {
      id: 4,
      code: 'ABEV3',
      name: 'Ambev S.A.',
      sector: 'Bebidas',
      price: 14.78,
      change: 0.12,
      changePercent: 0.82,
      dividendYield: 3.9,
      pl: 18.6,
      pvp: 2.3,
      volume: '4.56M',
      marketCap: 'R$ 232B',
      favorite: false
    },
    {
      id: 5,
      code: 'BBDC4',
      name: 'Bradesco',
      sector: 'Bancos',
      price: 15.42,
      change: -0.32,
      changePercent: -2.03,
      dividendYield: 6.1,
      pl: 9.8,
      pvp: 0.9,
      volume: '2.78M',
      marketCap: 'R$ 158B',
      favorite: false
    },
    {
      id: 6,
      code: 'BBAS3',
      name: 'Banco do Brasil',
      sector: 'Bancos',
      price: 56.90,
      change: 1.20,
      changePercent: 2.16,
      dividendYield: 7.5,
      pl: 6.3,
      pvp: 0.8,
      volume: '1.92M',
      marketCap: 'R$ 203B',
      favorite: true
    },
    {
      id: 7,
      code: 'WEGE3',
      name: 'WEG S.A.',
      sector: 'Equipamentos Elétricos',
      price: 36.75,
      change: 0.85,
      changePercent: 2.37,
      dividendYield: 2.1,
      pl: 32.4,
      pvp: 8.7,
      volume: '3.45M',
      marketCap: 'R$ 154B',
      favorite: false
    },
    {
      id: 8,
      code: 'SUZB3',
      name: 'Suzano S.A.',
      sector: 'Papel & Celulose',
      price: 52.60,
      change: -1.20,
      changePercent: -2.23,
      dividendYield: 4.8,
      pl: 7.2,
      pvp: 1.4,
      volume: '1.23M',
      marketCap: 'R$ 72B',
      favorite: false
    }
  ];

  // Filtragem por setor
  const sectors = ['all', ...new Set(companiesData.map(company => company.sector))];

  // Ordenação
  const sortedCompanies = [...companiesData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtragem
  const filteredCompanies = sortedCompanies.filter(company => {
    const matchesFilter = filter === 'all' || company.sector === filter;
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         company.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleFavorite = (id) => {
    // Em uma aplicação real, isso atualizaria o estado global ou faria uma chamada API
    console.log(`Toggle favorite for company ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Empresas Listadas</h1>
          <p className="text-gray-600">Analise e compare as principais empresas do mercado</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  className="appearance-none block pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector === 'all' ? 'Todos os Setores' : sector}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <BarChart2 className="h-5 w-5" />
                <span>Comparar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sorting Options */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => requestSort('dividendYield')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${sortConfig.key === 'dividendYield' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Dividend Yield {sortConfig.key === 'dividendYield' && (sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
          </button>
          <button
            onClick={() => requestSort('pl')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${sortConfig.key === 'pl' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            P/L {sortConfig.key === 'pl' && (sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
          </button>
          <button
            onClick={() => requestSort('pvp')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${sortConfig.key === 'pvp' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            P/VP {sortConfig.key === 'pvp' && (sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
          </button>
          <button
            onClick={() => requestSort('marketCap')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${sortConfig.key === 'marketCap' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Valor de Mercado {sortConfig.key === 'marketCap' && (sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
          </button>
          <button
            onClick={() => requestSort('changePercent')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${sortConfig.key === 'changePercent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Variação {sortConfig.key === 'changePercent' && (sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
          </button>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{company.code}</h3>
                    <p className="text-gray-600">{company.name}</p>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(company.id)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star className={`h-5 w-5 ${company.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">R$ {company.price.toFixed(2)}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                    company.changePercent >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {company.changePercent >= 0 ? '+' : ''}{company.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500">Dividend Yield</p>
                    <p className="font-semibold">{company.dividendYield}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500">P/L</p>
                    <p className="font-semibold">{company.pl}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500">Setor</p>
                    <p className="font-semibold truncate">{company.sector}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500">Valor de Mercado</p>
                    <p className="font-semibold">{company.marketCap}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Análise
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Histórico
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center">
                    <PieChart className="h-4 w-4 mr-1" />
                    Indicadores
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Layers className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma empresa encontrada</h3>
            <p className="text-gray-500">Tente ajustar seus filtros de busca</p>
          </div>
        )}

        {/* Sector Overview */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Visão por Setor</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectors.filter(s => s !== 'all').map((sector) => {
              const sectorCompanies = companiesData.filter(c => c.sector === sector);
              const avgDividend = sectorCompanies.reduce((sum, c) => sum + c.dividendYield, 0) / sectorCompanies.length;
              const avgPL = sectorCompanies.reduce((sum, c) => sum + c.pl, 0) / sectorCompanies.length;
              
              return (
                <div key={sector} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900">{sector}</h3>
                  <p className="text-sm text-gray-500 mb-2">{sectorCompanies.length} empresas</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">DY médio:</span>
                    <span className="font-medium">{avgDividend.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">P/L médio:</span>
                    <span className="font-medium">{avgPL.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;


/* 
TODO:

Aqui a página está feita e com um design bonito,

O que falta ->??

- Colocar os dados reais da API
-Colocar para clicar na empresa e abrir a página dela
*/