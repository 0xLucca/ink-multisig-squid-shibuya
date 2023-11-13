import {Abi, encodeCall, decodeResult} from "@subsquid/ink-abi"

export const metadata = {
  "source": {
    "hash": "0x0416b0a15303af4d36e19d89fd34ba2b998a221cbc8728b228736bf617b281d1",
    "language": "ink! 4.3.0",
    "compiler": "rustc 1.69.0-nightly",
    "build_info": {
      "build_mode": "Release",
      "cargo_contract_version": "3.2.0",
      "rust_toolchain": "nightly-aarch64-apple-darwin",
      "wasm_opt_settings": {
        "keep_debug_symbols": false,
        "optimization_passes": "Z"
      }
    }
  },
  "contract": {
    "name": "my_psp22",
    "version": "3.2.0",
    "authors": [
      "Brushfam <green@727.ventures>"
    ]
  },
  "spec": {
    "constructors": [
      {
        "args": [
          {
            "label": "total_supply",
            "type": {
              "displayName": [
                "Balance"
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
          "type": 5
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
        "type": 2
      },
      "balance": {
        "displayName": [
          "Balance"
        ],
        "type": 0
      },
      "blockNumber": {
        "displayName": [
          "BlockNumber"
        ],
        "type": 16
      },
      "chainExtension": {
        "displayName": [
          "ChainExtension"
        ],
        "type": 17
      },
      "hash": {
        "displayName": [
          "Hash"
        ],
        "type": 14
      },
      "maxEventTopics": 4,
      "timestamp": {
        "displayName": [
          "Timestamp"
        ],
        "type": 15
      }
    },
    "events": [],
    "lang_error": {
      "displayName": [
        "ink",
        "LangError"
      ],
      "type": 6
    },
    "messages": [
      {
        "args": [
          {
            "label": "hated",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 2
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "set_hated_account",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 5
        },
        "selector": "0x19398962"
      },
      {
        "args": [],
        "default": false,
        "docs": [],
        "label": "get_hated_account",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 7
        },
        "selector": "0x9e5e363f"
      },
      {
        "args": [
          {
            "label": "to",
            "type": {
              "displayName": [
                "psp22_external",
                "TransferInput1"
              ],
              "type": 2
            }
          },
          {
            "label": "value",
            "type": {
              "displayName": [
                "psp22_external",
                "TransferInput2"
              ],
              "type": 0
            }
          },
          {
            "label": "data",
            "type": {
              "displayName": [
                "psp22_external",
                "TransferInput3"
              ],
              "type": 8
            }
          }
        ],
        "default": false,
        "docs": [
          " Transfers `value` amount of tokens from the caller's account to account `to`",
          " with additional `data` in unspecified format.",
          "",
          " On success a `Transfer` event is emitted.",
          "",
          " # Errors",
          "",
          " Returns `InsufficientBalance` error if there are not enough tokens on",
          " the caller's account Balance.",
          "",
          " Returns `ZeroSenderAddress` error if sender's address is zero.",
          "",
          " Returns `ZeroRecipientAddress` error if recipient's address is zero."
        ],
        "label": "PSP22::transfer",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 9
        },
        "selector": "0xdb20f9f5"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          " Returns the total token supply."
        ],
        "label": "PSP22::total_supply",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 13
        },
        "selector": "0x162df8c2"
      },
      {
        "args": [
          {
            "label": "from",
            "type": {
              "displayName": [
                "psp22_external",
                "TransferFromInput1"
              ],
              "type": 2
            }
          },
          {
            "label": "to",
            "type": {
              "displayName": [
                "psp22_external",
                "TransferFromInput2"
              ],
              "type": 2
            }
          },
          {
            "label": "value",
            "type": {
              "displayName": [
                "psp22_external",
                "TransferFromInput3"
              ],
              "type": 0
            }
          },
          {
            "label": "data",
            "type": {
              "displayName": [
                "psp22_external",
                "TransferFromInput4"
              ],
              "type": 8
            }
          }
        ],
        "default": false,
        "docs": [
          " Transfers `value` tokens on the behalf of `from` to the account `to`",
          " with additional `data` in unspecified format.",
          "",
          " This can be used to allow a contract to transfer tokens on ones behalf and/or",
          " to charge fees in sub-currencies, for example.",
          "",
          " On success a `Transfer` and `Approval` events are emitted.",
          "",
          " # Errors",
          "",
          " Returns `InsufficientAllowance` error if there are not enough tokens allowed",
          " for the caller to withdraw from `from`.",
          "",
          " Returns `InsufficientBalance` error if there are not enough tokens on",
          " the the account Balance of `from`.",
          "",
          " Returns `ZeroSenderAddress` error if sender's address is zero.",
          "",
          " Returns `ZeroRecipientAddress` error if recipient's address is zero."
        ],
        "label": "PSP22::transfer_from",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 9
        },
        "selector": "0x54b3c76e"
      },
      {
        "args": [
          {
            "label": "spender",
            "type": {
              "displayName": [
                "psp22_external",
                "DecreaseAllowanceInput1"
              ],
              "type": 2
            }
          },
          {
            "label": "delta_value",
            "type": {
              "displayName": [
                "psp22_external",
                "DecreaseAllowanceInput2"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Atomically decreases the allowance granted to `spender` by the caller.",
          "",
          " An `Approval` event is emitted.",
          "",
          " # Errors",
          "",
          " Returns `InsufficientAllowance` error if there are not enough tokens allowed",
          " by owner for `spender`.",
          "",
          " Returns `ZeroSenderAddress` error if sender's address is zero.",
          "",
          " Returns `ZeroRecipientAddress` error if recipient's address is zero."
        ],
        "label": "PSP22::decrease_allowance",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 9
        },
        "selector": "0xfecb57d5"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "psp22_external",
                "BalanceOfInput1"
              ],
              "type": 2
            }
          }
        ],
        "default": false,
        "docs": [
          " Returns the account Balance for the specified `owner`.",
          "",
          " Returns `0` if the account is non-existent."
        ],
        "label": "PSP22::balance_of",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 13
        },
        "selector": "0x6568382f"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "psp22_external",
                "AllowanceInput1"
              ],
              "type": 2
            }
          },
          {
            "label": "spender",
            "type": {
              "displayName": [
                "psp22_external",
                "AllowanceInput2"
              ],
              "type": 2
            }
          }
        ],
        "default": false,
        "docs": [
          " Returns the amount which `spender` is still allowed to withdraw from `owner`.",
          "",
          " Returns `0` if no allowance has been set `0`."
        ],
        "label": "PSP22::allowance",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 13
        },
        "selector": "0x4d47d921"
      },
      {
        "args": [
          {
            "label": "spender",
            "type": {
              "displayName": [
                "psp22_external",
                "IncreaseAllowanceInput1"
              ],
              "type": 2
            }
          },
          {
            "label": "delta_value",
            "type": {
              "displayName": [
                "psp22_external",
                "IncreaseAllowanceInput2"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Atomically increases the allowance granted to `spender` by the caller.",
          "",
          " An `Approval` event is emitted.",
          "",
          " # Errors",
          "",
          " Returns `ZeroSenderAddress` error if sender's address is zero.",
          "",
          " Returns `ZeroRecipientAddress` error if recipient's address is zero."
        ],
        "label": "PSP22::increase_allowance",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 9
        },
        "selector": "0x96d6b57a"
      },
      {
        "args": [
          {
            "label": "spender",
            "type": {
              "displayName": [
                "psp22_external",
                "ApproveInput1"
              ],
              "type": 2
            }
          },
          {
            "label": "value",
            "type": {
              "displayName": [
                "psp22_external",
                "ApproveInput2"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Allows `spender` to withdraw from the caller's account multiple times, up to",
          " the `value` amount.",
          "",
          " If this function is called again it overwrites the current allowance with `value`.",
          "",
          " An `Approval` event is emitted.",
          "",
          " # Errors",
          "",
          " Returns `ZeroSenderAddress` error if sender's address is zero.",
          "",
          " Returns `ZeroRecipientAddress` error if recipient's address is zero."
        ],
        "label": "PSP22::approve",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 9
        },
        "selector": "0xb20f1bbd"
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
                "struct": {
                  "fields": [
                    {
                      "layout": {
                        "leaf": {
                          "key": "0x00000000",
                          "ty": 0
                        }
                      },
                      "name": "supply"
                    },
                    {
                      "layout": {
                        "root": {
                          "layout": {
                            "leaf": {
                              "key": "0x1d458d3b",
                              "ty": 0
                            }
                          },
                          "root_key": "0x1d458d3b"
                        }
                      },
                      "name": "balances"
                    },
                    {
                      "layout": {
                        "root": {
                          "layout": {
                            "leaf": {
                              "key": "0x0abd72fb",
                              "ty": 0
                            }
                          },
                          "root_key": "0x0abd72fb"
                        }
                      },
                      "name": "allowances"
                    },
                    {
                      "layout": {
                        "enum": {
                          "dispatchKey": "0x00000000",
                          "name": "Option",
                          "variants": {
                            "0": {
                              "fields": [],
                              "name": "None"
                            },
                            "1": {
                              "fields": [
                                {
                                  "layout": {
                                    "leaf": {
                                      "key": "0x00000000",
                                      "ty": 1
                                    }
                                  },
                                  "name": "0"
                                }
                              ],
                              "name": "Some"
                            }
                          }
                        }
                      },
                      "name": "_reserved"
                    }
                  ],
                  "name": "Data"
                }
              },
              "name": "psp22"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 2
                }
              },
              "name": "hated_account"
            }
          ],
          "name": "Contract"
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
          "primitive": "u128"
        }
      }
    },
    {
      "id": 1,
      "type": {
        "def": {
          "tuple": []
        }
      }
    },
    {
      "id": 2,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 3,
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
      "id": 3,
      "type": {
        "def": {
          "array": {
            "len": 32,
            "type": 4
          }
        }
      }
    },
    {
      "id": 4,
      "type": {
        "def": {
          "primitive": "u8"
        }
      }
    },
    {
      "id": 5,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 1
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
            "type": 1
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
      "id": 6,
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
      "id": 7,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 2
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
            "type": 2
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
      "id": 8,
      "type": {
        "def": {
          "sequence": {
            "type": 4
          }
        }
      }
    },
    {
      "id": 9,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 10
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
            "type": 10
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
      "id": 10,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 1
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 11
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
            "type": 1
          },
          {
            "name": "E",
            "type": 11
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 11,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 12,
                    "typeName": "String"
                  }
                ],
                "index": 0,
                "name": "Custom"
              },
              {
                "index": 1,
                "name": "InsufficientBalance"
              },
              {
                "index": 2,
                "name": "InsufficientAllowance"
              },
              {
                "index": 3,
                "name": "ZeroRecipientAddress"
              },
              {
                "index": 4,
                "name": "ZeroSenderAddress"
              },
              {
                "fields": [
                  {
                    "type": 12,
                    "typeName": "String"
                  }
                ],
                "index": 5,
                "name": "SafeTransferCheckFailed"
              }
            ]
          }
        },
        "path": [
          "openbrush_contracts",
          "traits",
          "errors",
          "psp22",
          "PSP22Error"
        ]
      }
    },
    {
      "id": 12,
      "type": {
        "def": {
          "primitive": "str"
        }
      }
    },
    {
      "id": 13,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 0
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
            "type": 0
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
      "id": 14,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 3,
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
      "id": 15,
      "type": {
        "def": {
          "primitive": "u64"
        }
      }
    },
    {
      "id": 16,
      "type": {
        "def": {
          "primitive": "u32"
        }
      }
    },
    {
      "id": 17,
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

    get_hated_account(): Promise<Result<Uint8Array, LangError>> {
        return this.stateCall('0x9e5e363f', [])
    }

    PSP22_total_supply(): Promise<Result<bigint, LangError>> {
        return this.stateCall('0x162df8c2', [])
    }

    PSP22_balance_of(owner: Uint8Array): Promise<Result<bigint, LangError>> {
        return this.stateCall('0x6568382f', [owner])
    }

    PSP22_allowance(owner: Uint8Array, spender: Uint8Array): Promise<Result<bigint, LangError>> {
        return this.stateCall('0x4d47d921', [owner, spender])
    }

    private async stateCall<T>(selector: string, args: any[]): Promise<T> {
        let input = _abi.encodeMessageInput(selector, args)
        let data = encodeCall(this.address, input)
        let result = await this.ctx._chain.client.call('state_call', ['ContractsApi_call', data, this.blockHash])
        let value = decodeResult(result)
        return _abi.decodeMessageOutput(selector, value)
    }
}

export type Event = never

export type Message = Message_set_hated_account | Message_get_hated_account | Message_PSP22_transfer | Message_PSP22_total_supply | Message_PSP22_transfer_from | Message_PSP22_decrease_allowance | Message_PSP22_balance_of | Message_PSP22_allowance | Message_PSP22_increase_allowance | Message_PSP22_approve

export interface Message_set_hated_account {
    __kind: 'set_hated_account'
    hated: Uint8Array
}

export interface Message_get_hated_account {
    __kind: 'get_hated_account'
}

/**
 *  Transfers `value` amount of tokens from the caller's account to account `to`
 *  with additional `data` in unspecified format.
 * 
 *  On success a `Transfer` event is emitted.
 * 
 *  # Errors
 * 
 *  Returns `InsufficientBalance` error if there are not enough tokens on
 *  the caller's account Balance.
 * 
 *  Returns `ZeroSenderAddress` error if sender's address is zero.
 * 
 *  Returns `ZeroRecipientAddress` error if recipient's address is zero.
 */
export interface Message_PSP22_transfer {
    __kind: 'PSP22_transfer'
    to: Uint8Array
    value: bigint
    data: Uint8Array
}

/**
 *  Returns the total token supply.
 */
export interface Message_PSP22_total_supply {
    __kind: 'PSP22_total_supply'
}

/**
 *  Transfers `value` tokens on the behalf of `from` to the account `to`
 *  with additional `data` in unspecified format.
 * 
 *  This can be used to allow a contract to transfer tokens on ones behalf and/or
 *  to charge fees in sub-currencies, for example.
 * 
 *  On success a `Transfer` and `Approval` events are emitted.
 * 
 *  # Errors
 * 
 *  Returns `InsufficientAllowance` error if there are not enough tokens allowed
 *  for the caller to withdraw from `from`.
 * 
 *  Returns `InsufficientBalance` error if there are not enough tokens on
 *  the the account Balance of `from`.
 * 
 *  Returns `ZeroSenderAddress` error if sender's address is zero.
 * 
 *  Returns `ZeroRecipientAddress` error if recipient's address is zero.
 */
export interface Message_PSP22_transfer_from {
    __kind: 'PSP22_transfer_from'
    from: Uint8Array
    to: Uint8Array
    value: bigint
    data: Uint8Array
}

/**
 *  Atomically decreases the allowance granted to `spender` by the caller.
 * 
 *  An `Approval` event is emitted.
 * 
 *  # Errors
 * 
 *  Returns `InsufficientAllowance` error if there are not enough tokens allowed
 *  by owner for `spender`.
 * 
 *  Returns `ZeroSenderAddress` error if sender's address is zero.
 * 
 *  Returns `ZeroRecipientAddress` error if recipient's address is zero.
 */
export interface Message_PSP22_decrease_allowance {
    __kind: 'PSP22_decrease_allowance'
    spender: Uint8Array
    deltaValue: bigint
}

/**
 *  Returns the account Balance for the specified `owner`.
 * 
 *  Returns `0` if the account is non-existent.
 */
export interface Message_PSP22_balance_of {
    __kind: 'PSP22_balance_of'
    owner: Uint8Array
}

/**
 *  Returns the amount which `spender` is still allowed to withdraw from `owner`.
 * 
 *  Returns `0` if no allowance has been set `0`.
 */
export interface Message_PSP22_allowance {
    __kind: 'PSP22_allowance'
    owner: Uint8Array
    spender: Uint8Array
}

/**
 *  Atomically increases the allowance granted to `spender` by the caller.
 * 
 *  An `Approval` event is emitted.
 * 
 *  # Errors
 * 
 *  Returns `ZeroSenderAddress` error if sender's address is zero.
 * 
 *  Returns `ZeroRecipientAddress` error if recipient's address is zero.
 */
export interface Message_PSP22_increase_allowance {
    __kind: 'PSP22_increase_allowance'
    spender: Uint8Array
    deltaValue: bigint
}

/**
 *  Allows `spender` to withdraw from the caller's account multiple times, up to
 *  the `value` amount.
 * 
 *  If this function is called again it overwrites the current allowance with `value`.
 * 
 *  An `Approval` event is emitted.
 * 
 *  # Errors
 * 
 *  Returns `ZeroSenderAddress` error if sender's address is zero.
 * 
 *  Returns `ZeroRecipientAddress` error if recipient's address is zero.
 */
export interface Message_PSP22_approve {
    __kind: 'PSP22_approve'
    spender: Uint8Array
    value: bigint
}

export type Constructor = Constructor_new

export interface Constructor_new {
    __kind: 'new'
    totalSupply: bigint
}

export type LangError = LangError_CouldNotReadInput

export interface LangError_CouldNotReadInput {
    __kind: 'CouldNotReadInput'
}

export type Result<T, E> = {__kind: 'Ok', value: T} | {__kind: 'Err', value: E}
