import {createPublicClient, http} from 'viem'
import {avalanche, avalancheFuji} from 'viem/chains'

export const web3client = createPublicClient({
    chain: avalanche,
    transport: http(),
})