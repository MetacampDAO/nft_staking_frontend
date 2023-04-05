import { SolPaymentGuardSettings, Option } from "@metaplex-foundation/js";
import { AccountMeta } from "@solana/web3.js";

export const getRemainingAccountsByGuardType = (
  guard: Option<SolPaymentGuardSettings | object>,
  guardType: string
) => {
  const remainingAccs: {
    [key: string]: () => AccountMeta[];
  } = {
    solPayment: () => {
      const solPaymentGuard = guard as SolPaymentGuardSettings;

      return [
        {
          pubkey: solPaymentGuard.destination,
          isSigner: false,
          isWritable: true,
        },
      ];
    },
  };

  if (!remainingAccs[guardType]) {
    console.warn(
      "Couldn't find remaining accounts for Guard " +
        guardType +
        ". This can most likely cause the mint tx to fail."
    );

    return [];
  }

  return remainingAccs[guardType]();
};
