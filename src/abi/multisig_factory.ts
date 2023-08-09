import {Abi, encodeCall, decodeResult} from "@subsquid/ink-abi"

export const metadata = {
  "source": {
    "hash": "0xb7b5f9057a0f8f82b3325453eace8468e7bc1ee2f8e861a51878694e4ec61426",
    "language": "ink! 4.2.1",
    "compiler": "rustc 1.69.0-nightly",
    "build_info": {
      "build_mode": "Release",
      "cargo_contract_version": "3.0.1",
      "rust_toolchain": "nightly-aarch64-unknown-linux-gnu",
      "wasm_opt_settings": {
        "keep_debug_symbols": false,
        "optimization_passes": "Z"
      }
    }
  },
  "contract": {
    "name": "multisig-factory",
    "version": "0.1.0",
    "authors": [
      "0xLucca",
      "GabrielCamba"
    ]
  },
  "spec": {
    "constructors": [
      {
        "args": [
          {
            "label": "codehash",
            "type": {
              "displayName": [
                "Hash"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "new",
        "payable": false,
        "returnType": {
          "displayName": [
            "ink_primitives",
            "ConstructorResult"
          ],
          "type": 3
        },
        "selector": "0x9bae9d5e"
      }
    ],
    "docs": [],
    "environment": {
      "accountId": {
        "displayName": [
          "AccountId"
        ],
        "type": 9
      },
      "balance": {
        "displayName": [
          "Balance"
        ],
        "type": 11
      },
      "blockNumber": {
        "displayName": [
          "BlockNumber"
        ],
        "type": 13
      },
      "chainExtension": {
        "displayName": [
          "ChainExtension"
        ],
        "type": 14
      },
      "hash": {
        "displayName": [
          "Hash"
        ],
        "type": 0
      },
      "maxEventTopics": 4,
      "timestamp": {
        "displayName": [
          "Timestamp"
        ],
        "type": 12
      }
    },
    "events": [
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "multisig_address",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 9
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 2
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "owners_list",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "label": "NewMultisig"
      }
    ],
    "lang_error": {
      "displayName": [
        "ink",
        "LangError"
      ],
      "type": 7
    },
    "messages": [
      {
        "args": [
          {
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 2
            }
          },
          {
            "label": "owners_list",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 8
            }
          },
          {
            "label": "salt",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 10
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "new_multisig",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 3
        },
        "selector": "0xf72d4700"
      }
    ]
  },
  "storage": {
    "root": {
      "layout": {
        "struct": {
          "fields": [
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 0
                }
              },
              "name": "multisig_codehash"
            }
          ],
          "name": "MultiSigFactory"
        }
      },
      "root_key": "0x00000000"
    }
  },
  "types": [
    {
      "id": 0,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 1,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "Hash"
        ]
      }
    },
    {
      "id": 1,
      "type": {
        "def": {
          "array": {
            "len": 32,
            "type": 2
          }
        }
      }
    },
    {
      "id": 2,
      "type": {
        "def": {
          "primitive": "u8"
        }
      }
    },
    {
      "id": 3,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 4
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 7
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 4
          },
          {
            "name": "E",
            "type": 7
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 4,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 5
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 5
          },
          {
            "name": "E",
            "type": 6
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 5,
      "type": {
        "def": {
          "tuple": []
        }
      }
    },
    {
      "id": 6,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "InstantiationFailed"
              }
            ]
          }
        },
        "path": [
          "multisig_factory",
          "multisig_factory",
          "Error"
        ]
      }
    },
    {
      "id": 7,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 1,
                "name": "CouldNotReadInput"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "LangError"
        ]
      }
    },
    {
      "id": 8,
      "type": {
        "def": {
          "sequence": {
            "type": 9
          }
        }
      }
    },
    {
      "id": 9,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 1,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "AccountId"
        ]
      }
    },
    {
      "id": 10,
      "type": {
        "def": {
          "sequence": {
            "type": 2
          }
        }
      }
    },
    {
      "id": 11,
      "type": {
        "def": {
          "primitive": "u128"
        }
      }
    },
    {
      "id": 12,
      "type": {
        "def": {
          "primitive": "u64"
        }
      }
    },
    {
      "id": 13,
      "type": {
        "def": {
          "primitive": "u32"
        }
      }
    },
    {
      "id": 14,
      "type": {
        "def": {
          "variant": {}
        },
        "path": [
          "ink_env",
          "types",
          "NoChainExtension"
        ]
      }
    }
  ],
  "version": "4"
}

const _abi = new Abi(metadata)

export function decodeEvent(hex: string): Event {
    return _abi.decodeEvent(hex)
}

export function decodeMessage(hex: string): Message {
    return _abi.decodeMessage(hex)
}

export function decodeConstructor(hex: string): Constructor {
    return _abi.decodeConstructor(hex)
}

export interface Chain {
    client: {
        call: <T=any>(method: string, params?: unknown[]) => Promise<T>
    }
}

export interface ChainContext {
    _chain: Chain
}

export class Contract {
    constructor(private ctx: ChainContext, private address: string, private blockHash?: string) { }

    private async stateCall<T>(selector: string, args: any[]): Promise<T> {
        let input = _abi.encodeMessageInput(selector, args)
        let data = encodeCall(this.address, input)
        let result = await this.ctx._chain.client.call('state_call', ['ContractsApi_call', data, this.blockHash])
        let value = decodeResult(result)
        return _abi.decodeMessageOutput(selector, value)
    }
}

export type Event = Event_NewMultisig

export interface Event_NewMultisig {
    __kind: 'NewMultisig'
    multisigAddress: AccountId
    threshold: u8
    ownersList: Vec
}

export type Message = Message_new_multisig

export interface Message_new_multisig {
    __kind: 'new_multisig'
    threshold: u8
    ownersList: Vec
    salt: Uint8Array
}

export type Constructor = Constructor_new

export interface Constructor_new {
    __kind: 'new'
    codehash: Hash
}

export type AccountId = Uint8Array

export type u8 = number

export type Vec = AccountId[]

export type Hash = Uint8Array

export type Result<T, E> = {__kind: 'Ok', value: T} | {__kind: 'Err', value: E}
