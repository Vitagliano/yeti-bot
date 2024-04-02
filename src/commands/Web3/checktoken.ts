import {Discord, Slash, SlashOption} from 'discordx';
import {ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Message} from 'discord.js';
import axios from 'axios';
import {Category} from "@discordx/utilities";

@Discord()
@Category('Web3')

export class Web3Commands {
    @Slash({
        name: "checktoken",
        description: "Checks information for a specific token contract"
    })
    async checkToken(
        @SlashOption({
            name: "address",
            description: "Token address",
            type: ApplicationCommandOptionType.String,
            required: true
        })
            tokenAddress: string,
        interaction: CommandInteraction
    ) {

        if (!tokenAddress || tokenAddress.length !== 42 || !tokenAddress.startsWith('0x')) {
            await interaction.editReply('Invalid token address.');
            return;
        }

        try {
            const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
            if (!response.data || !response.data.pairs || !response.data.pairs[0]) {
                await interaction.editReply('Failed to fetch token data. Please check if the token address is correct.');
                return;
            }

            function formatNumber(num: number): string {
                if (num >= 1e6) {
                    let formattedNum = (num / 1e6).toFixed(2);
                    return formattedNum.endsWith('0') ? formattedNum.slice(0, -1) + 'M' : formattedNum + 'M';
                } else {
                    return Math.round(num).toLocaleString('en-US');
                }
            }

            const pair = response.data.pairs[0];


            // Criação da mensagem embed
            const embedMessage = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Token: ${pair.baseToken.symbol || 'Not available'}`)
                .setURL(`https://dexscreener.com/${pair.chainId}/${tokenAddress}`)
                .addFields(
                    {name: '🌐 Network', value: `${pair.chainId} @ ${pair.dexId}`},
                    {name: '🎫 Ticker', value: pair.baseToken.symbol || 'Not available'},
                    {
                        name: '💎 MarketCap',
                        value: `$${pair.fdv ? Math.trunc(pair.fdv).toLocaleString('en-US') : 'Undefined'}`
                    },
                    {
                        name: '🪙 Liquidity (USD)',
                        value: `$${pair.liquidity.usd ? Math.trunc(pair.liquidity.usd).toLocaleString('en-US') : 'Not aavailable'}`
                    },
                    {name: '💰 Price', value: `$${pair.priceUsd ? pair.priceUsd : 'Not available'}`},
                    {
                        name: ' Buys /  Sells (last hour)',
                        value: `🟢 Buys: ${pair.txns.h1.buys || '0'}\n🔴 Sells: ${pair.txns.h1.sells || '0'}`
                    },
                    {
                        name: '📊 Volume (last 24 hours)',
                        value: `$${pair.volume.h24 ? formatNumber(pair.volume.h24) : 'Not available'}`
                    },
                    {
                        name: `${pair.priceChange.h24 > 0 ? "🚀" : "📉"} Price Change (last 24 hours)`,
                        value: `${pair.priceChange.h24 || 'Not available'}%`
                    },
                )
                .setTimestamp()
            ;

            await interaction.editReply({embeds: [embedMessage]});
        } catch (error) {
            await interaction.editReply('Failed to fetch token data. Please check if the token address is correct.');
        }
    }
}