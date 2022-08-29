import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import otoAbi from '../utils/otoAbi.json';
import oto1Abi from '../utils/oto1Abi.json';
import wavaxAbi from '../utils/wavaxAbi.json';
import { useLocation } from 'react-router-dom';

const EtherContext = React.createContext();

const defaultDashboardData = {
  avaxPrice: 0,
  price: 0,
  marketCap: 0,
  // holders: 0,
  rewards: 0,
  totalSupply: 0,
  circulatingSupply: 0,
  AVAXliq: 0,
  firepitPercentage: 0,
  distributed: 0,
  distributedUSD: 0,
};

const defaultWalletData = {
  balance: 0,
  balanceInUSD: 0,
  AVAXbalance: 0,
  AVAXbalanceInUSD: 0,
  dividend: 0,
  dividendInUSD: 0,
};

export const EtherContextProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);      
  const [walletData, setWalletData] = useState(defaultWalletData);                        
  const [user, setUser] = useState(() => {
    const stickyValue = sessionStorage.getItem('user');
    return stickyValue !== null ? JSON.parse(stickyValue) : null;
  });

  const avaxProvider = useMemo(() => new ethers.providers.getDefaultProvider('https://mainnet.infura.io/v3/612bc69b6c6d4bed9563cc131c039427'), []);
  const otoContract = useMemo(() => new ethers.Contract('0x843f8A97f078F465539A0Ee32341e9312eD31429', otoAbi, avaxProvider), [avaxProvider]);
  const oto1Contract = useMemo(() => new ethers.Contract('0xB7c95518143B64A6DA9eD07Aeb16f656fc86b53f', oto1Abi, avaxProvider), [avaxProvider]);
  const wavaxContract = useMemo(() => new ethers.Contract('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', wavaxAbi, avaxProvider), [avaxProvider]);
  const lpPair = '0xF28fFC5292Da1eB198D5a89d436015D20937B51F';
  const tokenDecimal = 9;

  const location = useLocation();

  const tokenFormatEther = (value) => {
    return ethers.utils.formatUnits(value, tokenDecimal);
  };


  // Dashboard
  const getAvaxPrice = useCallback(async () => {
    const response = await fetch('https://api.coinstats.app/public/v1/coins/ethereum');
    const data = await response.json();
    const avaxPrice = data.coin.price;

    return avaxPrice.toFixed(2);
  }, []);

  const getLPBalance = useCallback(async () => {
    const avaxBalance = await wavaxContract.balanceOf(lpPair);
    const tokenBalance = await otoContract.balanceOf(lpPair);

    return {
      avax: ethers.utils.formatUnits(avaxBalance, 18),
      token: tokenFormatEther(tokenBalance),
    };
  }, [wavaxContract, otoContract]);

  const getTokenPrice = useCallback((lpAvax, lpToken, avaxPrice) => {
    if (lpAvax && lpToken && avaxPrice) {
      const avaxBalanceInUsd = lpAvax * avaxPrice;
      const tokenPrice = (avaxBalanceInUsd / lpToken);
      return tokenPrice;
    }
  }, []);

 
  const getMarketCap = useCallback(
    async (otoPrice) => {
      let totalSupply = await otoContract.totalSupply();

      let marketCap = parseFloat(tokenFormatEther(totalSupply)) * otoPrice; 
      const numberFormatter = Intl.NumberFormat('en-US');
      return numberFormatter.format(marketCap.toFixed(2));
    },
    [otoContract]
  );

  const getDistributed = useCallback(
    async () => {
      let distributed = await oto1Contract.totalDividendsDistributed();
      return parseFloat(ethers.utils.formatUnits(distributed,18)).toFixed(2);
    },
    [oto1Contract]
  );

  const getTotalSupply = useCallback(
    async (otoPrice) => {
      const totalSupply = 1000000.00;
      const numberFormatter = Intl.NumberFormat('en-US');
      return numberFormatter.format(totalSupply.toFixed(2));
    },
    []
  );

  const getCircSupply = useCallback(async () => {
    let totalSupply1 = await otoContract.totalSupply();
    let circSupply = tokenFormatEther(totalSupply1);

    return parseFloat(circSupply);
  }, [otoContract]);

  const getCirculatingSupply = useCallback(async () => {
    let totalSupply = await otoContract.totalSupply();
    let circulatingSupply = parseFloat(tokenFormatEther(totalSupply)).toFixed(2);
    const numberFormatter = Intl.NumberFormat('en-US');
    return numberFormatter.format(parseFloat(circulatingSupply).toFixed(2));
  }, [otoContract]);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };                                             

  const getAccountBalance = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const balance = await otoContract.balanceOf(address);
      return parseFloat(tokenFormatEther(balance)).toFixed(5);
    },
    [otoContract]
  );
  
  const getDividend = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const dividend = await oto1Contract.dividendOf(address);
      return parseFloat(ethers.utils.formatUnits(dividend, 18)).toFixed(5);
    },
    [oto1Contract]
  );          

  const getClaimed = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const claimed = await oto1Contract.totalDividendClaimed(address);
      return parseFloat(ethers.utils.formatUnits(claimed, 18)).toFixed(5);
    },
    [oto1Contract]
  );      
  
  const getAVAXBalance = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const AVAXbalance = await avaxProvider.getBalance(address);
      return parseFloat(ethers.utils.formatUnits(AVAXbalance, 18)).toFixed(3);
    },
    [avaxProvider]
  );  

  // Account
  const calculateWallet = useCallback(async () => {
    const balance = await getAccountBalance(user);
    const claimed = await getClaimed(user);
    const claimedInUSD = (claimed * dashboardData.price).toFixed(3);
    const dividend = await getDividend(user);
    const dividendInUSD = (dividend * dashboardData.price).toFixed(3);
    const balanceInUSD = (balance * dashboardData.price).toFixed(3);
    const AVAXbalance = await getAVAXBalance(user);
    const AVAXbalanceInUSD = (AVAXbalance * dashboardData.avaxPrice).toFixed(3);

    setWalletData((prevData) => ({
      balance, balanceInUSD, AVAXbalance, dividend, AVAXbalanceInUSD, dividendInUSD, claimed, claimedInUSD
    }));
  }, [getAccountBalance, dashboardData.price, user, getAVAXBalance, getDividend, dashboardData.avaxPrice, getClaimed]);

  useEffect(() => {
    if (user) {
      calculateWallet(user);
    }
  }, [user, location.pathname, calculateWallet]);


  // On page load
  const fetchData = useCallback(async () => {
    const avaxPrice = await getAvaxPrice();
    const lpBalance = await getLPBalance();
    const otoPrice = getTokenPrice(lpBalance.avax, lpBalance.token, avaxPrice);
    const marketCap = await getMarketCap(otoPrice);
    const numberFormatter = Intl.NumberFormat('en-US');
    const AVAXliq = numberFormatter.format(getTokenPrice(lpBalance.avax, 1, avaxPrice).toFixed(2));
    const totalSupply = await getTotalSupply();
    const circulatingSupply = await getCirculatingSupply();
    const circSupply = await getCircSupply();
    const distributed = await getDistributed();
    const distributedUSD = (distributed * avaxPrice).toFixed(2);

    setDashboardData({avaxPrice, price: otoPrice, marketCap, totalSupply, AVAXliq, circulatingSupply, circSupply, distributed, distributedUSD});
  }, [getAvaxPrice, getLPBalance, getTokenPrice, getMarketCap, getTotalSupply, getCirculatingSupply, getCircSupply, getDistributed]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <EtherContext.Provider value={{ dashboardData, walletData, connectWallet, user}}>
      {children}
    </EtherContext.Provider>
  );
};

export default EtherContext;
