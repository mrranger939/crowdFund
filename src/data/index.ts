import { Campaign, ProgramState, Transaction } from '@/utils/interfaces'

export const campaigns: Campaign[] = [
  {
    publicKey: '0x1234567890abcdef',
    cid: 1,
    creator: '0x1234567890abcdef',
    title: 'Save the Whales',
    description: 'A campaign to fund marine conservation efforts.',
    imageUrl: 'https://dummyjson.com/image/400x200/282828',
    goal: 10000,
    amountRaised: 5600,
    timestamp: Date.now(),
    donors: 123,
    withdrawals: 2,
    balance: 5600 - 10000,
    active: true,
  },
  {
    publicKey: '0x9876543210fedcba',
    cid: 2,
    creator: '0x9876543210fedcba',
    title: 'Solar for Schools',
    description: 'Bringing solar power to schools around the globe.',
    imageUrl: 'https://dummyjson.com/image/400x200/282828',
    goal: 50000,
    amountRaised: 23456,
    timestamp: Date.now() - 86400000,
    donors: 456,
    withdrawals: 1,
    balance: 23456 - 50000,
    active: true,
  },
  {
    publicKey: '0x5555555555555555',
    cid: 3,
    creator: '0x5555555555555555',
    title: 'Art for All',
    description: 'Supporting local artists and art education programs.',
    imageUrl: 'https://dummyjson.com/image/400x200/282828',
    goal: 15000,
    amountRaised: 14999,
    timestamp: Date.now() - 86400000 * 7,
    donors: 789,
    withdrawals: 3,
    balance: 14999 - 15000,
    active: false,
  },
  {
    publicKey: '0xaaaaaaaabbbbbbbb',
    cid: 4,
    creator: '0xaaaaaaaabbbbbbbb',
    title: 'Books for Kids',
    description: 'Providing books to underprivileged children.',
    imageUrl: 'https://dummyjson.com/image/400x200/282828',
    goal: 8000,
    amountRaised: 7980,
    timestamp: Date.now() - 86400000 * 30,
    donors: 321,
    withdrawals: 0,
    balance: 7980 - 8000,
    active: true,
  },
  {
    publicKey: '0xcccdddddeeeeefff',
    cid: 5,
    creator: '0xcccdddddeeeeefff',
    title: 'Clean Water Initiative',
    description: 'Ensuring clean water access in developing communities.',
    imageUrl: 'https://dummyjson.com/image/400x200/282828',
    goal: 20000,
    amountRaised: 10000,
    timestamp: Date.now() - 86400000 * 90,
    donors: 654,
    withdrawals: 2,
    balance: 10000 - 20000,
    active: true,
  },
]

export const dummyTransactions: Transaction[] = [
  {
    publicKey: 'TransactionPublicKey1',
    owner: 'DonorAddress1',
    cid: 1,
    amount: 100,
    timestamp: Date.now() - 86400000, // 1 day ago
    credited: true, // Donation
  },
  {
    publicKey: 'TransactionPublicKey2',
    owner: 'DonorAddress2',
    cid: 1,
    amount: 200,
    timestamp: Date.now() - 43200000, // 12 hours ago
    credited: true, // Donation
  },
  {
    publicKey: 'TransactionPublicKey3',
    owner: 'OwnerAddress1',
    cid: 1,
    amount: 300,
    timestamp: Date.now() - 21600000, // 6 hours ago
    credited: false, // Withdrawal
  },
  {
    publicKey: 'TransactionPublicKey4',
    owner: 'OwnerAddress2',
    cid: 1,
    amount: 100,
    timestamp: Date.now() - 10800000, // 3 hours ago
    credited: false, // Withdrawal
  },
]

export const dummyProgramState: ProgramState = {
  initialized: true,
  campaignCount: 50,
  platformFee: 5,
  platformAddress: '0x1234567890abcdef',
}
