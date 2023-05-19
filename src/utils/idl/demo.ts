export type Demo = {
  "version": "0.1.0",
  "name": "demo",
  "instructions": [
    {
      "name": "stake",
      "accounts": [
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pdaNftAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "userInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "pointBalance",
            "type": "u64"
          },
          {
            "name": "activeStake",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "userStakeInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "stakeStartTime",
            "type": "u64"
          },
          {
            "name": "lastStakeRedeem",
            "type": "u64"
          },
          {
            "name": "stakeState",
            "type": {
              "defined": "StakeState"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Stake"
          },
          {
            "name": "Unstake"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNftCollection",
      "msg": "NFT isn't part of collection"
    }
  ]
};

export const IDL: Demo = {
  "version": "0.1.0",
  "name": "demo",
  "instructions": [
    {
      "name": "stake",
      "accounts": [
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pdaNftAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "userInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "pointBalance",
            "type": "u64"
          },
          {
            "name": "activeStake",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "userStakeInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "stakeStartTime",
            "type": "u64"
          },
          {
            "name": "lastStakeRedeem",
            "type": "u64"
          },
          {
            "name": "stakeState",
            "type": {
              "defined": "StakeState"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Stake"
          },
          {
            "name": "Unstake"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNftCollection",
      "msg": "NFT isn't part of collection"
    }
  ]
};
