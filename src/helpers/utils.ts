import numeral from 'numeral';
import { getAddress } from '@ethersproject/address';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import BigNumber from '@/helpers/bignumber';
import config from '@/config';
import i18n from '@/i18n';
import { getFactors } from '@/helpers/miningFactors';
// import { request } from '@/helpers/subgraph';
import merge from 'lodash/merge';
import queries from '@/helpers/queries.json';
import { subgraphRequest } from '@/_balancer/utils';
import cloneDeep from 'lodash/cloneDeep';

// import { default as data } from '../../rewards.json';

export const ITEMS_PER_PAGE = 20;
export const MAX_GAS = new BigNumber('0xffffffff');
export const MAX_UINT = MaxUint256;
export const POOL_TOKENS_DECIMALS = 18;
export const GAS_LIMIT_BUFFER = 0.1;
export const MAX =
  '115792089237316195423570985008687907853269984665640564039457.584007913129639935';
export const EDIT_POOL_GOOGLE_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSe_sIVqZCL0rO--8u3PUUNGuxZ68LviAZBtrqV4gVTeTxzHCA/viewform';

export const amplAddress = '0xD46bA6D942050d489DBd938a2C909A5d5039A161';
export const validAmplPools = ['0xa751a143f8fe0a108800bfb915585e4255c2fe80'];

export const unknownColors = [
  '#5d6872',
  '#7e9e99',
  '#9d9f7f',
  '#68aca9',
  '#a593a5',
  '#387080',
  '#c7bdf4',
  '#c28d75'
];

export const capInputOptions = {
  NUMERIC: i18n.tc('value'),
  UNLIMITED: i18n.tc('unlimited')
};

export const liquidityToggleOptions = {
  MULTI_ASSET: i18n.tc('multiAsset'),
  SINGLE_ASSET: i18n.tc('singleAsset')
};

export const poolTypes = {
  SHARED_POOL: i18n.tc('shared'),
  SMART_POOL: i18n.tc('smart')
};

export const poolRights = {
  canPauseSwapping: i18n.tc('canPauseSwapping'),
  canChangeSwapFee: i18n.tc('canChangeSwapFee'),
  canChangeWeights: i18n.tc('canChangeWeights'),
  canAddRemoveTokens: i18n.tc('canAddRemoveTokens'),
  canWhitelistLPs: i18n.tc('canWhitelistLPs'),
  canChangeCap: i18n.tc('canChangeCap')
};

export function jsonParse(input, fallback?) {
  try {
    return JSON.parse(input);
  } catch (err) {
    return fallback || undefined;
  }
}

export function shortenAddress(str = '') {
  return str ? `${str.slice(0, 6)}...${str.slice(str.length - 4)}` : str;
}

export function shorten(str = '', max = 14) {
  return str.length > max ? `${str.slice(0, max)}...` : str;
}

export function bnum(val: string | number | BigNumber): BigNumber {
  const number = typeof val === 'string' ? val : val ? val.toString() : '0';
  return new BigNumber(number);
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function toWei(val: string | BigNumber): BigNumber {
  return scale(bnum(val.toString()), 18).integerValue();
}

export function denormalizeBalance(
  amount: BigNumber,
  tokenDecimals: number
): BigNumber {
  return scale(bnum(amount), tokenDecimals);
}

export function normalizeBalance(
  amount: BigNumber,
  tokenDecimals: number
): BigNumber {
  return scale(bnum(amount), -tokenDecimals);
}

export function isLocked(
  allowances,
  tokenAddress,
  spender,
  rawAmount,
  decimals
) {
  const tokenAllowance = allowances[tokenAddress];
  if (!tokenAllowance || !tokenAllowance[spender]) {
    return true;
  }
  if (!rawAmount) {
    return false;
  }
  const amount = denormalizeBalance(rawAmount, decimals);
  return amount.gt(tokenAllowance[spender]);
}

export async function getSYMMPriceXDAI() {
  try {
    const response = await subgraphRequest(
      process.env.VUE_APP_NETWORK === 'xdai'
        ? config.subgraphUrl
        : config.subgraphUrlXDAI,
      queries['getSYMMPrice']
    );
    return response.tokenPrices[0].price;
  } catch (e) {
    console.error(e);
  }
}
export async function getSYMMPriceCELO() {
  try {
    const response = await subgraphRequest(
      process.env.VUE_APP_NETWORK === 'celo'
        ? config.subgraphUrl
        : config.subgraphUrlCELO,
      queries['getSYMMPrice']
    );
    return response.tokenPrices[0].price;
  } catch (e) {
    console.error(e);
  }
}
export async function getCELOPriceXDAI() {
  try {
    const response = await subgraphRequest(
      process.env.VUE_APP_NETWORK === 'xdai'
        ? config.subgraphUrl
        : config.subgraphUrlXDAI,
      queries['getCELOPrice']
    );
    return response.tokenPrices[0].price;
  } catch (e) {
    console.error(e);
  }
}
export async function getCELOPriceCELO() {
  try {
    const response = await subgraphRequest(
      process.env.VUE_APP_NETWORK === 'celo'
        ? config.subgraphUrl
        : config.subgraphUrlCELO,
      queries['getCELOPrice']
    );
    return response.tokenPrices[0].price;
  } catch (e) {
    console.error(e);
  }
}
export async function getTokenPriceXDAI(token: string) {
  try {
    const response = await subgraphRequest(
      process.env.VUE_APP_NETWORK === 'xdai'
        ? config.subgraphUrl
        : config.subgraphUrlXDAI,
      queries[`get${token}Price`]
    );
    return response.tokenPrices[0].price;
  } catch (e) {
    console.error(e);
  }
}
export async function getTokenPriceCELO(token: string) {
  try {
    const response = await subgraphRequest(
      process.env.VUE_APP_NETWORK === 'celo'
        ? config.subgraphUrl
        : config.subgraphUrlCELO,
      queries[`get${token}Price`]
    );
    return response.tokenPrices[0].price;
  } catch (e) {
    console.error(e);
  }
}

async function getPools(payload, isCurrentNetwork?) {
  const {
    first = ITEMS_PER_PAGE,
    page = 1,
    orderBy = 'liquidity',
    orderDirection = 'desc',
    where = {}
  } = payload;
  const skip = (page - 1) * first;
  const ts = Math.round(new Date().getTime() / 1000);
  const tsYesterday = ts - 24 * 3600;
  where.tokensList_not = [];
  const query = {
    pools: {
      __args: {
        where,
        first,
        skip,
        orderBy,
        orderDirection
      },
      swaps: {
        __args: {
          where: {
            timestamp_lt: tsYesterday
          }
        }
      }
    }
  };
  try {
    if (config.network === 'xdai') {
      return await subgraphRequest(
        isCurrentNetwork ? config.subgraphUrl : config.subgraphUrlCELO,
        merge(queries['getPools'], query)
      );
    } else {
      return await subgraphRequest(
        isCurrentNetwork ? config.subgraphUrl : config.subgraphUrlXDAI,
        merge(queries['getPools'], query)
      );
    }
  } catch (e) {
    console.error(e);
  }
}

async function getPoolsNoPaging(payload, isCurrentNetwork?) {
  const {
    orderBy = 'liquidity',
    orderDirection = 'desc',
    where = {}
  } = payload;
  const ts = Math.round(new Date().getTime() / 1000);
  const tsYesterday = ts - 24 * 3600;
  where.tokensList_not = [];
  const query = {
    pools: {
      __args: {
        where: {
          finalized: true
        },
        orderBy,
        orderDirection
      }
    }
  };
  try {
    if (config.network === 'xdai') {
      return await subgraphRequest(
        isCurrentNetwork ? config.subgraphUrl : config.subgraphUrlCELO,
        merge(queries['getPools'], query)
      );
    } else {
      return await subgraphRequest(
        isCurrentNetwork ? config.subgraphUrl : config.subgraphUrlXDAI,
        merge(queries['getPools'], query)
      );
    }
  } catch (e) {
    console.error(e);
  }
}

export async function formatPool(pool) {
  let colorIndex = 0;
  pool.tokens = pool.tokens.map(token => {
    token.checksum = getAddress(token.address);
    token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
    const configToken = config.tokens[token.checksum];
    if (configToken) {
      token.color = configToken.color;
    } else {
      token.color = unknownColors[colorIndex];
      colorIndex++;
    }
    return token;
  });
  if (pool.shares) pool.holders = pool.shares.length;
  pool.tokensList = pool.tokensList.map(token => getAddress(token));
  pool.lastSwapVolume = 0;
  const poolTotalSwapVolume =
    pool.swaps && pool.swaps[0] && pool.swaps[0].poolTotalSwapVolume
      ? parseFloat(pool.swaps[0].poolTotalSwapVolume)
      : 0;
  pool.lastSwapVolume = parseFloat(pool.totalSwapVolume) - poolTotalSwapVolume;
  pool.feesCollected = pool.lastSwapVolume * pool.swapFee;
  pool.apy = (100 / pool.liquidity) * ((pool.feesCollected * 365) / 100);

  const query = {
    where: {
      finalized: true,
      liquidity_gt: 0
    }
  };

  // Get factors
  const factors = getFactors(
    pool.swapFee,
    pool.tokens,
    pool.tokensList,
    pool.totalWeight,
    config.chainId
  );

  const combinedAdjustmentFactor = new BigNumber(factors.feeFactor)
    .times(factors.ratioFactor)
    .times(factors.wrapFactor);

  // Calculate adjusted pool liquidity
  const adjustedPoolLiquidity = new BigNumber(pool.liquidity).times(
    combinedAdjustmentFactor
  );

  let totalAdjustedLiquiditySecondNetwork = new BigNumber(0);
  let totalAdjustedLiquidityCurrentNetwork = new BigNumber(0);
  let thisAdjustedPoolLiquidity = new BigNumber(0);

  const thisChainId = config.chainId;
  const secondChainId = config.chainId == '42220' ? '100' : '42220';

  // Get all the pools for the other network and add up the total liquidity and adjusted liquidity
  let pools = await getPoolsNoPaging(query);
  pools.pools.forEach(thispool => {
    const thisPoolFactors = getFactors(
      thispool.swapFee,
      thispool.tokens,
      thispool.tokensList,
      thispool.totalWeight,
      secondChainId
    );

    const thisCombinedAdjustmentFactor = new BigNumber(
      thisPoolFactors.feeFactor
    )
      .times(thisPoolFactors.ratioFactor)
      .times(thisPoolFactors.wrapFactor);

    thisAdjustedPoolLiquidity = new BigNumber(thispool.liquidity).times(
      thisCombinedAdjustmentFactor
    );

    totalAdjustedLiquiditySecondNetwork = totalAdjustedLiquiditySecondNetwork.plus(
      thisAdjustedPoolLiquidity
    );
  });

  // total liquidity for CELO APR and rewards
  let crTotalLiquidity = new BigNumber(0);
  const crPoolIds = [
    '0x13da4034a56f0293b8a78bc13524656e0136455c', // SYMM/cEUR
    '0x22324f68ff401a4379da39421140bcc58102338f', // SYMM/cUSD
    '0xf3ce35b10d3c9e74b0e6084ce08fd576fd9ec221' // SYMM/CELO
  ];

  // Get all the pools for the current network and add up the total liquidity and adjusted liquidity
  pools = await getPoolsNoPaging(query, 1);
  pools.pools.forEach(thispool => {
    const thisPoolFactors = getFactors(
      thispool.swapFee,
      thispool.tokens,
      thispool.tokensList,
      thispool.totalWeight,
      thisChainId,
      thispool.id
    );

    const thisCombinedAdjustmentFactor = new BigNumber(
      thisPoolFactors.feeFactor
    )
      .times(thisPoolFactors.ratioFactor)
      .times(thisPoolFactors.wrapFactor);

    thisAdjustedPoolLiquidity = new BigNumber(thispool.liquidity).times(
      thisCombinedAdjustmentFactor
    );

    totalAdjustedLiquidityCurrentNetwork = totalAdjustedLiquidityCurrentNetwork.plus(
      thisAdjustedPoolLiquidity
    );

    // get total liquidity for CELO APR and rewards
    if (crPoolIds.includes(thispool.id)) {
      crTotalLiquidity = crTotalLiquidity.plus(
        new BigNumber(thispool.liquidity)
      );
    }
  });

  // As per the Excel spreadsheet, calcultate the adjusted pool liquidity percent, the number of tokens paid out and then the value
  const adjustedPoolLiquidityPercent = adjustedPoolLiquidity.div(
    totalAdjustedLiquidityCurrentNetwork.plus(
      totalAdjustedLiquiditySecondNetwork
    )
  );

  // const SYMMprice = await getSYMMPriceXDAI() + await getSYMMPriceCELO() / 2;
  const SYMMprice =
    process.env.VUE_APP_NETWORK === 'xdai'
      ? await getSYMMPriceXDAI()
      : await getSYMMPriceCELO(); // fetch Price for SYMM
  // console.log(`SYMMPRICE: ${SYMMprice}`);
  const dailyCoinReward = new BigNumber(395.6);

  pool.tokenReward = dailyCoinReward.times(adjustedPoolLiquidityPercent);
  pool.rewardApy = pool.tokenReward
    .times(SYMMprice)
    .div(pool.liquidity)
    .times(365);

  // CELO APR and rewards,  cr is just prefix for Celo Rewards
  const crPool = cloneDeep(pool);
  // let crPoolLiquidityPercent = new BigNumber(0);
  const CELOprice =
    process.env.VUE_APP_NETWORK === 'xdai'
      ? await getCELOPriceXDAI()
      : await getCELOPriceCELO();

  // For SYMM/CELO, it's 20k USD for 84 days, others 40k USD for 84 days
  // 238.09 USD per day -> 36.6 Celo per day
  const crDailyCoinReward = [
    new BigNumber(2 * (238.09 / Number(CELOprice))),
    new BigNumber(2 * (238.09 / Number(CELOprice))),
    new BigNumber(238.09 / Number(CELOprice))
  ];

  crPoolIds.forEach((poolId: string, index: number) => {
    if (poolId === pool.id) {
      // crPoolLiquidityPercent = new BigNumber(pool.liquidity).div(
      //   crTotalLiquidity
      // );

      crPool.tokenRewardCelo = crDailyCoinReward[index]; //.times(crPoolLiquidityPercent);

      crPool.rewardApyCelo = crPool.tokenRewardCelo
        .times(CELOprice)
        .div(pool.liquidity)
        .times(365);
    }
  });

  // KNX APR and rewards
  if (crPool.id === '0xa4ae7529cece492b6c47c726a320eea8841658ec') {
    // KNX/cUSD
    const KNXprice =
      process.env.VUE_APP_NETWORK === 'xdai'
        ? await getTokenPriceXDAI('KNX')
        : await getTokenPriceCELO('KNX');

    const krDailyCoinReward = new BigNumber(7142.85); // 50K KNX a week
    crPool.tokenRewardKnx = krDailyCoinReward;
    crPool.rewardApyKnx = crPool.tokenRewardKnx
      .times(KNXprice)
      .div(crPool.liquidity)
      .times(365);
  }

  return crPool;
}

export async function formatPools(pools) {
  pools = pools.map(pool => formatPool(pool));
  return pools;
}

export async function getMarketChartFromCoinGecko(address) {
  const ratePerDay = {};
  const uri = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart?vs_currency=usd&days=60`;
  try {
    const marketChart = await fetch(uri).then(res => res.json());
    marketChart.prices.forEach(p => {
      const date = new Date();
      date.setTime(p[0]);
      const day = date.toISOString();
      ratePerDay[day] = p[1];
    });
    return ratePerDay;
  } catch (e) {
    return Promise.reject();
  }
}

export function isValidAddress(str) {
  try {
    getAddress(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function clone(item) {
  return JSON.parse(JSON.stringify(item));
}

export function trunc(value: number, decimals = 0) {
  const mutiplier = 10 ** decimals;
  return Math.trunc(value * mutiplier) / mutiplier;
}

export function calcPoolTokensByRatio(ratio, totalShares) {
  if (ratio.isNaN()) {
    return '0';
  }
  // @TODO - fix calcs so no buffer is needed
  const buffer = bnum(100);
  return bnum(ratio)
    .times(toWei(totalShares))
    .integerValue(BigNumber.ROUND_DOWN)
    .minus(buffer)
    .toString();
}

export function getTokenBySymbol(symbol) {
  const tokenAddresses = Object.keys(config.tokens);
  const tokenAddress = tokenAddresses.find(
    tokenAddress => config.tokens[tokenAddress].symbol === symbol
  );
  return config.tokens[tokenAddress];
}

export const isTxRejected = error => {
  if (!error) {
    return false;
  }
  return error.code === 4001 || error.code === -32603;
};

export const isTxReverted = error => {
  if (!error) {
    return false;
  }
  return error.code === -32016;
};

export function logRevertedTx(
  provider: Provider,
  contract: Contract,
  action: string,
  params: any,
  overrides: any
) {
  // address: 0xfffff6e3a909693c6e4dadbb72214fd6c3e47913
  const dummyPrivateKey =
    '0x651bd555534625dc2fd85e13369dc61547b2e3f2cfc8b98cee868b449c17a4d6';
  const dummyWallet = new Wallet(dummyPrivateKey).connect(provider);
  const loggingContract = contract.connect(dummyWallet);
  loggingContract[action](...params, overrides);
}

export function formatFilters(filters, fb) {
  if (!filters) return fb || {};
  if (!filters.token) filters.token = [];
  if (!filters.type) filters.type = 'shared';
  if (!Array.isArray(filters.token)) filters.token = [filters.token];
  return filters;
}

export function blockNumberToTimestamp(
  currentTime,
  currentBlockNumber,
  blockNumber
) {
  const AVG_BLOCK_TIMES = {
    1: 13,
    42: 5
  };
  const avgBlockTime = AVG_BLOCK_TIMES[config.chainId];
  return currentTime + avgBlockTime * 1000 * (blockNumber - currentBlockNumber);
}

export function filterObj(obj, fn) {
  return Object.fromEntries(Object.entries(obj).filter(item => fn(item)));
}

export function formatNumber(number, key) {
  if (number === 0) return '-';

  if (number < 0.0001) number = 0;

  let format = '0.[000]';
  if (number > 1000) format = '0.[0]a';
  if (number < 1) format = '0.[0000]';

  if (key === 'long') {
    format = '0,000.[00]';
    if (number < 1) format = '0.[0000]';
  }

  if (key === 'usd') {
    format = '$(0.[00])';
    if (number > 1000) format = '$(0.[0]a)';
    if (number < 1) format = '$(0.[0000])';
  }

  if (key === 'usd-long') {
    format = '$(0,000.[00])';
    if (number < 1) format = '$(0.[0000])';
  }

  if (key === 'percent') format = '(0.[00])%';
  if (key === 'percent-short') format = '(0)%';

  return numeral(number)
    .format(format)
    .toUpperCase();
}
