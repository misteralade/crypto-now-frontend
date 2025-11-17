export const getNetworkConfig = (network: string) => {
  const networkConfigs: Record<string, { color: string; displayName: string }> = {
    BTC: { color: '#F7931A', displayName: 'Bitcoin' },
    ERC20: { color: '#627EEA', displayName: 'Ethereum (ERC20)' },
    TRC20: { color: '#FF060A', displayName: 'Tron (TRC20)' },
    BEP20: { color: '#F3BA2F', displayName: 'BNB Chain (BEP20)' },
    SOLANA: { color: '#14F195', displayName: 'Solana' },
    POLYGON: { color: '#8247E5', displayName: 'Polygon' },
    ARBITRUM: { color: '#28A0F0', displayName: 'Arbitrum' },
    OPTIMISM: { color: '#FF0420', displayName: 'Optimism' },
    AVALANCHE: { color: '#E84142', displayName: 'Avalanche' },
    FANTOM: { color: '#1969FF', displayName: 'Fantom' },
    BSC: { color: '#F3BA2F', displayName: 'BSC' },
    CARDANO: { color: '#0033AD', displayName: 'Cardano' },
    POLKADOT: { color: '#E6007A', displayName: 'Polkadot' },
    COSMOS: { color: '#2E3148', displayName: 'Cosmos' },
    TERRA: { color: '#5493F7', displayName: 'Terra' },
    NEAR: { color: '#00C08B', displayName: 'NEAR' },
    HARMONY: { color: '#00ADE8', displayName: 'Harmony' },
    MOONBEAM: { color: '#53CBC9', displayName: 'Moonbeam' },
    CRONOS: { color: '#002D74', displayName: 'Cronos' },
    KCC: { color: '#00B488', displayName: 'KCC' },
    HECO: { color: '#01943F', displayName: 'HECO' },
    XDAI: { color: '#48A9A6', displayName: 'xDai' },
    CELO: { color: '#FCFF52', displayName: 'Celo' },
    ALGORAND: { color: '#000000', displayName: 'Algorand' },
    TEZOS: { color: '#2C7DF7', displayName: 'Tezos' },
    ELROND: { color: '#000000', displayName: 'Elrond' },
    KLAYTN: { color: '#FF3D00', displayName: 'Klaytn' },
    OKEX: { color: '#000000', displayName: 'OKEx' },
  };
  
  return networkConfigs[network.toUpperCase()] || {
    color: '#03034D',
    displayName: network
  };
};