import { Connection, clusterApiUrl} from '@solana/web3.js';
import {
  AccountLayout as TokenAccountLayout,
  TOKEN_PROGRAM_ID,
  u64,
} from "@solana/spl-token";

(async () => {
  // Connect to cluster
  var connection = new Connection(clusterApiUrl("mainnet-beta"));

