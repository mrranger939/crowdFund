/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fundus.json`.
 */
export type Fundus = {
  "address": "BWKPqyezd6a3B6npzvR3M5svUerDANVpuMUDyvF51Zd4",
  "metadata": {
    "name": "fundus",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createCampaign",
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": "string"
        },
        {
          "name": "goal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteCampaign",
      "discriminator": [
        223,
        105,
        48,
        131,
        88,
        27,
        249,
        227
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        }
      ]
    },
    {
      "name": "donate",
      "discriminator": [
        121,
        186,
        218,
        211,
        73,
        70,
        196,
        180
      ],
      "accounts": [
        {
          "name": "donor",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "transaction",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "deployer",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateCampaign",
      "discriminator": [
        235,
        31,
        39,
        49,
        121,
        173,
        19,
        92
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": "string"
        },
        {
          "name": "goal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePlatformSettings",
      "discriminator": [
        213,
        238,
        2,
        39,
        128,
        157,
        3,
        95
      ],
      "accounts": [
        {
          "name": "updater",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newPlatformFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "transaction",
          "writable": true
        },
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "platformAddress",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cid",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    },
    {
      "name": "transaction",
      "discriminator": [
        11,
        24,
        174,
        129,
        203,
        117,
        242,
        23
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyInitialized",
      "msg": "The program has already being initialized"
    },
    {
      "code": 6001,
      "name": "titleTooLong",
      "msg": "The Title is of more than 100 characters"
    },
    {
      "code": 6002,
      "name": "descriptionTooLong",
      "msg": "Description is more than 600 characters"
    },
    {
      "code": 6003,
      "name": "imageUrlTooLong",
      "msg": "Image Url is more than 300 characters"
    },
    {
      "code": 6004,
      "name": "invalidGoalAmount",
      "msg": "Invalid goal amount, Goal must be greater than zero"
    },
    {
      "code": 6005,
      "name": "unauthorisedAccess",
      "msg": "Unauthorised Access"
    },
    {
      "code": 6006,
      "name": "campaignNotFound",
      "msg": "Campaign doesnot exist"
    },
    {
      "code": 6007,
      "name": "inActiveCampaign",
      "msg": "This Campaign is Inactive"
    },
    {
      "code": 6008,
      "name": "invalidDonationAmount",
      "msg": "Donation must be atleast 1 SOL Token"
    },
    {
      "code": 6009,
      "name": "campaignGoalReached",
      "msg": "Campaign goal reached"
    },
    {
      "code": 6010,
      "name": "invalidWithdrawAmount",
      "msg": "Withdraw amount must be atleast 1 SOL Token"
    },
    {
      "code": 6011,
      "name": "insufficientFund",
      "msg": "Insufficient Funds"
    },
    {
      "code": 6012,
      "name": "invalidPlatformAddress",
      "msg": "Invalid Platform Address"
    },
    {
      "code": 6013,
      "name": "invalidPlatformFee",
      "msg": "The platform fee must be in between 1 to 15"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cid",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "amountRaised",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "donors",
            "type": "u64"
          },
          {
            "name": "withdrawals",
            "type": "u64"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "programState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "campaignCount",
            "type": "u64"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "platformAddress",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "cid",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "credited",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
