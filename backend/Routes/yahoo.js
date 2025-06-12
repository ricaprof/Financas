import express from 'express';
import yahooFinance from 'yahoo-finance2';



const router = express.Router();

// Função auxiliar para formatar números
const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) return null;
  return parseFloat(num).toFixed(decimals);
};

// Função para formatar valores grandes (milhões, bilhões)
const formatLargeNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  
  const billion = 1000000000;
  const million = 1000000;
  const thousand = 1000;
  
  if (num >= billion) {
    return `R$ ${(num / billion).toFixed(1)}B`;
  } else if (num >= million) {
    return `R$ ${(num / million).toFixed(1)}M`;
  } else if (num >= thousand) {
    return `${(num / thousand).toFixed(1)}K`;
  }
  
  return num.toLocaleString('pt-BR');
};

// Função para formatar porcentagem
const formatPercentage = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return `${(num * 100).toFixed(2)}%`;
};

// Rota principal para dados completos da empresa
router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  
  try {
    console.log(`Buscando dados completos para: ${symbol}`);
    
    // Buscar dados de resumo da empresa
    const quote = await yahooFinance.quoteSummary(symbol, {
      modules: [
        'summaryDetail',
        'financialData', 
        'defaultKeyStatistics',
        'assetProfile',
        'balanceSheetHistory',
        'incomeStatementHistory',
        'price',
        'summaryProfile'
      ]
    });

    const summary = quote || {};
    const summaryDetail = summary.summaryDetail || {};
    const financialData = summary.financialData || {};
    const keyStats = summary.defaultKeyStatistics || {};
    const assetProfile = summary.assetProfile || {};
    const price = summary.price || {};
    const summaryProfile = summary.summaryProfile || {};

    // Buscar cotação atual
    const currentQuote = await yahooFinance.quote(symbol);

    const data = {
      // Informações básicas da empresa
      companyInfo: {
        symbol: symbol,
        shortName: price?.shortName || currentQuote?.shortName || 'N/A',
        longName: price?.longName || currentQuote?.longName || 'N/A',
        sector: assetProfile?.sector || summaryProfile?.sector || 'N/A',
        industry: assetProfile?.industry || summaryProfile?.industry || 'N/A',
        country: assetProfile?.country || 'N/A',
        website: assetProfile?.website || 'N/A',
        employees: assetProfile?.fullTimeEmployees || 'N/A',
        description: assetProfile?.longBusinessSummary || summaryProfile?.longBusinessSummary || 'N/A'
      },

      // Preços e cotação
      pricing: {
        currentPrice: currentQuote?.regularMarketPrice || summaryDetail?.previousClose || price?.regularMarketPrice || null,
        previousClose: summaryDetail?.previousClose || currentQuote?.regularMarketPreviousClose || null,
        open: summaryDetail?.open || currentQuote?.regularMarketOpen || null,
        dayLow: summaryDetail?.dayLow || currentQuote?.regularMarketDayLow || null,
        dayHigh: summaryDetail?.dayHigh || currentQuote?.regularMarketDayHigh || null,
        fiftyTwoWkLow: summaryDetail?.fiftyTwoWeekLow || currentQuote?.fiftyTwoWeekLow || null,
        fiftyTwoWkHigh: summaryDetail?.fiftyTwoWeekHigh || currentQuote?.fiftyTwoWeekHigh || null,
        change: currentQuote?.regularMarketChange || null,
        changePercent: currentQuote?.regularMarketChangePercent || null
      },

      // Volume
      volume: {
        volume: summaryDetail?.volume || currentQuote?.regularMarketVolume || null,
        avgVolume: summaryDetail?.averageVolume || currentQuote?.averageVolume || null,
        avgVolume10days: summaryDetail?.averageVolume10days || null,
        volumeFormatted: formatLargeNumber(summaryDetail?.volume || currentQuote?.regularMarketVolume),
        avgVolumeFormatted: formatLargeNumber(summaryDetail?.averageVolume || currentQuote?.averageVolume)
      },

      // Indicadores fundamentalistas
      fundamentals: {
        marketCap: summaryDetail?.marketCap || price?.marketCap || null,
        marketCapFormatted: formatLargeNumber(summaryDetail?.marketCap || price?.marketCap),
        peRatio: summaryDetail?.trailingPE || financialData?.trailingPE || keyStats?.trailingPE || null,
        forwardPE: summaryDetail?.forwardPE || keyStats?.forwardPE || null,
        pbRatio: keyStats?.priceToBook || null,
        psRatio: keyStats?.priceToSalesTrailing12Months || null,
        pegRatio: keyStats?.pegRatio || null,
        dividendYield: summaryDetail?.dividendYield || summaryDetail?.trailingAnnualDividendYield || null,
        dividendYieldFormatted: formatPercentage(summaryDetail?.dividendYield || summaryDetail?.trailingAnnualDividendYield),
        dividendRate: summaryDetail?.dividendRate || null,
        payoutRatio: keyStats?.payoutRatio || null,
        beta: keyStats?.beta || summaryDetail?.beta || null,
        eps: keyStats?.trailingEps || financialData?.trailingEps || null,
        bookValue: keyStats?.bookValue || null
      },

      // Indicadores financeiros
      financialHealth: {
        roe: financialData?.returnOnEquity || null,
        roeFormatted: formatPercentage(financialData?.returnOnEquity),
        roa: financialData?.returnOnAssets || null,
        roaFormatted: formatPercentage(financialData?.returnOnAssets),
        roic: financialData?.returnOnInvestmentCapital || null,
        roicFormatted: formatPercentage(financialData?.returnOnInvestmentCapital),
        profitMargins: financialData?.profitMargins || null,
        profitMarginsFormatted: formatPercentage(financialData?.profitMargins),
        operatingMargins: financialData?.operatingMargins || null,
        operatingMarginsFormatted: formatPercentage(financialData?.operatingMargins),
        grossMargins: financialData?.grossMargins || null,
        grossMarginsFormatted: formatPercentage(financialData?.grossMargins),
        ebitdaMargins: financialData?.ebitdaMargins || null,
        ebitdaMarginsFormatted: formatPercentage(financialData?.ebitdaMargins)
      },

      // Balanço patrimonial
      balance: {
        totalCash: financialData?.totalCash || null,
        totalCashFormatted: formatLargeNumber(financialData?.totalCash),
        totalDebt: financialData?.totalDebt || null,
        totalDebtFormatted: formatLargeNumber(financialData?.totalDebt),
        totalRevenue: financialData?.totalRevenue || null,
        totalRevenueFormatted: formatLargeNumber(financialData?.totalRevenue),
        debtToEquity: financialData?.debtToEquity || null,
        currentRatio: financialData?.currentRatio || null,
        quickRatio: financialData?.quickRatio || null,
        totalCashPerShare: financialData?.totalCashPerShare || null,
        revenuePerShare: financialData?.revenuePerShare || null
      },

      // Crescimento
      growth: {
        revenueGrowth: financialData?.revenueGrowth || null,
        revenueGrowthFormatted: formatPercentage(financialData?.revenueGrowth),
        earningsGrowth: financialData?.earningsGrowth || null,
        earningsGrowthFormatted: formatPercentage(financialData?.earningsGrowth),
        earningsQuarterlyGrowth: financialData?.earningsQuarterlyGrowth || null,
        earningsQuarterlyGrowthFormatted: formatPercentage(financialData?.earningsQuarterlyGrowth)
      },

      // Estatísticas adicionais
      statistics: {
        sharesOutstanding: keyStats?.sharesOutstanding || null,
        sharesOutstandingFormatted: formatLargeNumber(keyStats?.sharesOutstanding),
        floatShares: keyStats?.floatShares || null,
        floatSharesFormatted: formatLargeNumber(keyStats?.floatShares),
        heldPercentInsiders: keyStats?.heldPercentInsiders || null,
        heldPercentInstitutions: keyStats?.heldPercentInstitutions || null,
        shortRatio: keyStats?.shortRatio || null,
        shortPercentOfFloat: keyStats?.shortPercentOfFloat || null,
        enterpriseValue: keyStats?.enterpriseValue || null,
        enterpriseValueFormatted: formatLargeNumber(keyStats?.enterpriseValue),
        priceToSales: keyStats?.priceToSalesTrailing12Months || null,
        enterpriseToRevenue: keyStats?.enterpriseToRevenue || null,
        enterpriseToEbitda: keyStats?.enterpriseToEbitda || null
      },

      // Resumo para cards principais
      summary: {
        currentPrice: currentQuote?.regularMarketPrice || summaryDetail?.previousClose || null,
        priceChange: currentQuote?.regularMarketChange || null,
        priceChangePercent: currentQuote?.regularMarketChangePercent || null,
        volume: summaryDetail?.volume || currentQuote?.regularMarketVolume || null,
        marketCap: summaryDetail?.marketCap || price?.marketCap || null,
        peRatio: summaryDetail?.trailingPE || financialData?.trailingPE || null,
        dividendYield: summaryDetail?.dividendYield || summaryDetail?.trailingAnnualDividendYield || null,
        beta: keyStats?.beta || summaryDetail?.beta || null
      },

      // Metadados
      metadata: {
        lastUpdated: new Date().toISOString(),
        currency: price?.currency || currentQuote?.currency || 'BRL',
        exchange: price?.exchangeName || currentQuote?.fullExchangeName || 'Unknown',
        market: currentQuote?.market || 'br_market',
        quoteType: currentQuote?.quoteType || 'EQUITY'
      }
    };

    res.json(data);

  } catch (err) {
    console.error(`Erro ao buscar dados da empresa ${symbol}:`, err.message);
    res.status(500).json({ 
      error: 'Erro ao buscar dados da empresa',
      message: err.message,
      symbol: symbol
    });
  }
});

// Rota para buscar dados históricos
router.get('/:symbol/history', async (req, res) => {
  const symbol = req.params.symbol;
  const { period = '1y', interval = '1d' } = req.query;
  
  try {
    console.log(`Buscando dados históricos para: ${symbol} - Period: ${period}, Interval: ${interval}`);
    
    const historical = await yahooFinance.historical(symbol, {
      period1: getPeriodStartDate(period),
      period2: new Date(),
      interval: interval
    });

    const processedData = historical.map(item => {
      const date = new Date(item.date);
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                         'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      return {
        date: item.date.toISOString().split('T')[0],
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        price: formatNumber(item.close),
        priceRaw: item.close,
        open: formatNumber(item.open),
        openRaw: item.open,
        high: formatNumber(item.high),
        highRaw: item.high,
        low: formatNumber(item.low),
        lowRaw: item.low,
        volume: item.volume || 0,
        adjClose: formatNumber(item.adjClose),
        adjCloseRaw: item.adjClose
      };
    });

    res.json({
      symbol: symbol,
      period: period,
      interval: interval,
      data: processedData,
      count: processedData.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (err) {
    console.error(`Erro ao buscar dados históricos para ${symbol}:`, err.message);
    res.status(500).json({ 
      error: 'Erro ao buscar dados históricos',
      message: err.message,
      symbol: symbol
    });
  }
});

// Função auxiliar para calcular data de início baseada no período
function getPeriodStartDate(period) {
  const now = new Date();
  const startDate = new Date(now);
  
  switch (period) {
    case '1d':
      startDate.setDate(now.getDate() - 1);
      break;
    case '5d':
      startDate.setDate(now.getDate() - 5);
      break;
    case '1mo':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3mo':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6mo':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case '2y':
      startDate.setFullYear(now.getFullYear() - 2);
      break;
    case '5y':
      startDate.setFullYear(now.getFullYear() - 5);
      break;
    case '10y':
      startDate.setFullYear(now.getFullYear() - 10);
      break;
    case 'ytd':
      startDate.setMonth(0, 1); // 1º de janeiro do ano atual
      break;
    case 'max':
      startDate.setFullYear(1970, 0, 1); // Data muito antiga para pegar tudo
      break;
    default:
      startDate.setFullYear(now.getFullYear() - 1);
  }
  
  return startDate;
}

// Rota para buscar apenas o preço atual (mais rápida)
router.get('/:symbol/quote', async (req, res) => {
  const symbol = req.params.symbol;
  
  try {
    const quote = await yahooFinance.quote(symbol);
    
    res.json({
      symbol: symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      previousClose: quote.regularMarketPreviousClose,
      marketCap: quote.marketCap,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (err) {
    console.error(`Erro ao buscar cotação para ${symbol}:`, err.message);
    res.status(500).json({ 
      error: 'Erro ao buscar cotação',
      message: err.message,
      symbol: symbol
    });
  }
});

export default router;