import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  AuthorityType,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createSetAuthorityInstruction,
  getAccount,
  getMint
} from '@solana/spl-token';

const mintNFT = async () => {
  // Connect to cluster.
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Generate a new wallet keypair and airdrop SOL.
  const fromWallet = Keypair.generate();

  const airdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL,
  );

  // Wait for airdrop confirmation.
  await connection.confirmTransaction(airdropSignature);

  // Create new token mint with payer and mint authority
  let mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    fromWallet.publicKey /** optional freeze authority */,
    0 /** Decimal default. Use 0 instead of 9 for NFT */,
  );

  // Token Mint address
  console.log('Mint address:', mint.toBase58());

  // Get the token account of fromWallet. Create it if it does not exist.
  const fromAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey,
  );

  // Mint 1 new token to the "from" account
  let mintSignature = await mintTo(
    connection,
    fromWallet, // who pays transaction fee
    mint, // mint
    fromAccount.address, // destination
    fromWallet, // mintAuthority
    1,
  );

  console.log('Mint tx:', mintSignature);
   
  // Disable future minting
  let transaction = new Transaction().add(
    createSetAuthorityInstruction(
      mint,
      fromWallet.publicKey,
      AuthorityType.MintTokens,
      null,
    ),
  );

  await sendAndConfirmTransaction(connection, transaction, [fromWallet], {
    commitment: 'confirmed',
  });

  // Print results
  const accountInfo = await getAccount(
  connection,
  fromAccount.address,
);

console.log('ATA of mint for fromAccount', accountInfo);

const mintInfo = await getMint(connection, mint);

console.log('mintInfo', mintInfo);

};

mintNFT();
