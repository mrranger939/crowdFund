// utils/addressTruncator.ts

export function truncateAddress(address: string): string {
  if (!address) {
    throw new Error('Invalid address')
  }

  const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`
  return truncated
}

export const getCluster = (cluster: string): string => {

  const clusterUrls: any = {
    "https://api.mainnet-beta.solana.com": 'mainnet-beta',
    "https://api.testnet.solana.com": 'testnet',
    "https://api.devnet.solana.com": 'devnet',
    "http://127.0.0.1:8899": 'custom'
  }

  return clusterUrls[getClusterURL(cluster)];
};

export const getClusterURL = (cluster: string): string => {
  const clusterUrl: any = {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    testnet: "https://api.testnet.solana.com",
    devnet: "https://api.devnet.solana.com",
    localhost: "http://127.0.0.1:8899",
  };

  return clusterUrl[cluster];
};