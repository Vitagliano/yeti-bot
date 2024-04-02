import {EntityRepository, Reference} from '@mikro-orm/core';
import {User} from "./User";


export class WalletAddressRepository extends EntityRepository<WalletAddress> {
    async addWalletAddress(userId: string, walletAddress: string): Promise<void> {
        const user = await this.em.getRepository(User).findOne({id: userId});

        if (!user) {
            throw new Error('User not found');
        }

        const wallet = this.create({
            walletAddress,
            user: user,
        });

        await this.persistAndFlush(wallet);
    }

    async updateLastTransaction(walletId: number, transactionId: string): Promise<void> {
        const wallet = await this.findOne({id: walletId});
        if (wallet) {
            wallet.lastTransactionId = transactionId;
            await this.flush();
        }
    }
}