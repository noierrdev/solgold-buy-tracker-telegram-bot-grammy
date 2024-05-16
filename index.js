const web3=require('@solana/web3.js')
const { u32, u8, struct }=require("@solana/buffer-layout");
const { publicKey, u64, bool }=require("@solana/buffer-layout-utils");


// Defining Buffer Layout from https://github.com/solana-labs/solana-program-library/blob/48fbb5b7c49ea35848442bba470b89331dea2b2b/token/js/src/state/mint.ts#L31 // 

/** Buffer layout for de/serializing a mint */
const MintLayout = struct([
    u32('mintAuthorityOption'),
    publicKey('mintAuthority'),
    u64('supply'),
    u8('decimals'),
    bool('isInitialized'),
    u32('freezeAuthorityOption'),
    publicKey('freezeAuthority'),
]);

const chats=[];

const { Bot } = require("grammy");
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
//2pJbCesYtqstGsr2qDuSGAs5FuaAmoo3gSAjZucwMjPT
// const tokenAccountAddress=new web3.PublicKey("6TjbkHLFT9CWXDK4ceDuMbKyh1BnNzffj2d2BdbDPJw4");
const mintAddress=new web3.PublicKey("E5LvWLceEjGW2AcSzjSWM3Uxu2euDYu8jvj1rQTpL9h7");

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot("6245495911:AAF0lMhtIySXR4-kSxP_DJfYB3Pz84-acIQ"); // <-- put your bot token between the ""


connection.onLogs(mintAddress,(data)=>{
    connection.getParsedTransaction(data.signature)
    .then(transaction=>{
        console.log(transaction)
        if(!transaction) return;
        if(!transaction.meta.postTokenBalances[1].owner) return;
        chats.forEach(chat => {
            const receiver=transaction.meta.postTokenBalances[1].owner;
            const amount=transaction.meta.postTokenBalances[1].uiTokenAmount.uiAmount-transaction.meta.preTokenBalances[1].uiTokenAmount.uiAmount
            const time=new Date(transaction.blockTime*1000);
            bot.api.sendMessage(chat,
            `<b>Buyer :</b>
            <a href="https://explorer.solana.com/address/${receiver}?cluster=devnet">${receiver}</a>
            <b>Amount :</b>
            <b>${amount}</b>
            <b>Bought:</b>
            <b>${time.toString()}</b>
            <b>Signature :<b/>
            <a href="https://explorer.solana.com/tx/${data.signature}?cluster=devnet">View on Explorer</a>
            `,{parse_mode:"HTML"})
            // bot.api.sendMessage(chat,messageContent.substring(4096,8191))
        });
    })
})

// Handle the /start command.
bot.command("start", (ctx) => {
    chats.push(ctx.chatId);
    ctx.reply("Welcome! Up and running.");
});

// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();