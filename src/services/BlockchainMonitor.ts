import {Injectable} from '@/decorators';
import {Logger} from './Logger';
import {Client} from "discordx";
import {web3client} from "@/configs";
import { EmbedBuilder } from "discord.js"; // Importação do EmbedBuilder

@Injectable()
export class BlockchainMonitor {
    constructor(private logger: Logger) {}

    async startMonitoring(client: Client, channelId: string) {
        /*web3client.watchBlocks({
            onBlock: (block) => {
                // Criação do Embed usando EmbedBuilder
                const embed = new EmbedBuilder()
                    .setColor('#0099ff') // Cor do lado do embed
                    .setTitle('AVAX Block Info') // Título do embed
                    .addFields(
                        {name: 'Block Number', value: String(block.number), inline: true},
                        {name: 'Hash', value: block.hash, inline: true},
                        // Convertendo o timestamp para uma data legível
                        {name: 'Transactions', value: String(block.transactions.length), inline: true},
                        {name: 'Minered by', value: block.miner, inline: true}
                    )
                    .setTimestamp() // Adiciona o timestamp atual ao embed
                    .setFooter({text: 'Blockchain Info'});

                // Envio do Embed
                this.sendDiscordNotification(client, channelId, embed);
            },
        });*/
    }

    private async sendDiscordNotification(client: Client, channelId: string, embed: EmbedBuilder | string) {
        const channel = await client.channels.fetch(channelId);
        if (typeof embed === 'string') {
            channel?.send({ content: embed });
        } else {
            channel?.send({ embeds: [embed] });
        }
    }
}