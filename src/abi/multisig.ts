import {Abi, encodeCall, decodeResult} from "@subsquid/ink-abi"

export const metadata = {
  "source": {
    "hash": "0x08871249a2fc337247ff46c024be209781e6be4aadaedff8657f871db5ec0728",
    "language": "ink! 4.2.0",
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
    "name": "multisig",
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
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 3
            }
          },
          {
            "label": "owners_list",
            "type": {
              "displayName": [
                "Vec"
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
          "type": 10
        },
        "selector": "0x9bae9d5e"
      },
      {
        "args": [],
        "default": false,
        "docs": [],
        "label": "default",
        "payable": false,
        "returnType": {
          "displayName": [
            "ink_primitives",
            "ConstructorResult"
          ],
          "type": 10
        },
        "selector": "0xed4b9d1b"
      }
    ],
    "docs": [],
    "environment": {
      "accountId": {
        "displayName": [
          "AccountId"
        ],
        "type": 1
      },
      "balance": {
        "displayName": [
          "Balance"
        ],
        "type": 5
      },
      "blockNumber": {
        "displayName": [
          "BlockNumber"
        ],
        "type": 31
      },
      "chainExtension": {
        "displayName": [
          "ChainExtension"
        ],
        "type": 32
      },
      "hash": {
        "displayName": [
          "Hash"
        ],
        "type": 30
      },
      "maxEventTopics": 4,
      "timestamp": {
        "displayName": [
          "Timestamp"
        ],
        "type": 8
      }
    },
    "events": [
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 3
            }
          }
        ],
        "docs": [],
        "label": "ThresholdChanged"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [],
        "label": "OwnerAdded"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [],
        "label": "OwnerRemoved"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [],
            "indexed": true,
            "label": "contract_address",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "selector",
            "type": {
              "displayName": [],
              "type": 16
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "input",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 7
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "transferred_value",
            "type": {
              "displayName": [
                "Balance"
              ],
              "type": 5
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "gas_limit",
            "type": {
              "displayName": [
                "u64"
              ],
              "type": 8
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "allow_reentry",
            "type": {
              "displayName": [
                "bool"
              ],
              "type": 9
            }
          }
        ],
        "docs": [],
        "label": "TransactionProposed"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [],
        "label": "Approve"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [],
        "label": "Reject"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "result",
            "type": {
              "displayName": [
                "TxResult"
              ],
              "type": 29
            }
          }
        ],
        "docs": [],
        "label": "TransactionExecuted"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "docs": [],
        "label": "TransactionRemoved"
      },
      {
        "args": [
          {
            "docs": [],
            "indexed": true,
            "label": "to",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "value",
            "type": {
              "displayName": [
                "Balance"
              ],
              "type": 5
            }
          }
        ],
        "docs": [],
        "label": "Transfer"
      }
    ],
    "lang_error": {
      "displayName": [
        "ink",
        "LangError"
      ],
      "type": 14
    },
    "messages": [
      {
        "args": [
          {
            "label": "tx",
            "type": {
              "displayName": [
                "Transaction"
              ],
              "type": 15
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "propose_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x0b1f1375"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "approve_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x59f1ed0c"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "reject_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x08ac8825"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "try_execute_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 17
        },
        "selector": "0xd7c8d55f"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "try_remove_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 17
        },
        "selector": "0x33f0fe58"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "add_owner",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0xad6d4358"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "remove_owner",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0xfdfe3353"
      },
      {
        "args": [
          {
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 3
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "change_threshold",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x1f154c5b"
      },
      {
        "args": [
          {
            "label": "to",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          },
          {
            "label": "value",
            "type": {
              "displayName": [
                "Balance"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "transfer",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x84a15da1"
      },
      {
        "args": [],
        "default": false,
        "docs": [],
        "label": "get_owners",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 18
        },
        "selector": "0x0b91ccc9"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "is_owner",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 19
        },
        "selector": "0xd7a3fbb1"
      },
      {
        "args": [],
        "default": false,
        "docs": [],
        "label": "get_threshold",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 20
        },
        "selector": "0x23122a1d"
      },
      {
        "args": [],
        "default": false,
        "docs": [],
        "label": "get_next_tx_id",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 21
        },
        "selector": "0x95628e63"
      },
      {
        "args": [],
        "default": false,
        "docs": [],
        "label": "get_active_txid_list",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 22
        },
        "selector": "0x7c22b655"
      },
      {
        "args": [
          {
            "label": "index",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "get_tx",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 23
        },
        "selector": "0x00702515"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "is_tx_valid",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x7aec7567"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "get_tx_approvals",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 25
        },
        "selector": "0x7818ec2a"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "get_tx_rejections",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 25
        },
        "selector": "0xe6fca8b0"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "get_tx_approval_for_account",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 27
        },
        "selector": "0x0edbed0b"
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
              "name": "owners_list"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0xaee61b32",
                      "ty": 4
                    }
                  },
                  "root_key": "0xaee61b32"
                }
              },
              "name": "owners"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 3
                }
              },
              "name": "threshold"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 5
                }
              },
              "name": "next_tx_id"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 6
                }
              },
              "name": "txs_id_list"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 1
                            }
                          },
                          "name": "address"
                        },
                        {
                          "layout": {
                            "array": {
                              "layout": {
                                "leaf": {
                                  "key": "0xbc330eb0",
                                  "ty": 3
                                }
                              },
                              "len": 4,
                              "offset": "0xbc330eb0"
                            }
                          },
                          "name": "selector"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 7
                            }
                          },
                          "name": "input"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 5
                            }
                          },
                          "name": "transferred_value"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 8
                            }
                          },
                          "name": "gas_limit"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 9
                            }
                          },
                          "name": "allow_reentry"
                        }
                      ],
                      "name": "Transaction"
                    }
                  },
                  "root_key": "0xbc330eb0"
                }
              },
              "name": "txs"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0x0ce5b35d",
                      "ty": 9
                    }
                  },
                  "root_key": "0x0ce5b35d"
                }
              },
              "name": "approvals"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0x5876d092",
                      "ty": 3
                    }
                  },
                  "root_key": "0x5876d092"
                }
              },
              "name": "approvals_count"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0xbe6ca363",
                      "ty": 3
                    }
                  },
                  "root_key": "0xbe6ca363"
                }
              },
              "name": "rejections_count"
            }
          ],
          "name": "MultiSig"
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
          "sequence": {
            "type": 1
          }
        }
      }
    },
    {
      "id": 1,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 2,
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
      "id": 2,
      "type": {
        "def": {
          "array": {
            "len": 32,
            "type": 3
          }
        }
      }
    },
    {
      "id": 3,
      "type": {
        "def": {
          "primitive": "u8"
        }
      }
    },
    {
      "id": 4,
      "type": {
        "def": {
          "tuple": []
        }
      }
    },
    {
      "id": 5,
      "type": {
        "def": {
          "primitive": "u128"
        }
      }
    },
    {
      "id": 6,
      "type": {
        "def": {
          "sequence": {
            "type": 5
          }
        }
      }
    },
    {
      "id": 7,
      "type": {
        "def": {
          "sequence": {
            "type": 3
          }
        }
      }
    },
    {
      "id": 8,
      "type": {
        "def": {
          "primitive": "u64"
        }
      }
    },
    {
      "id": 9,
      "type": {
        "def": {
          "primitive": "bool"
        }
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
                    "type": 11
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
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
            "type": 11
          },
          {
            "name": "E",
            "type": 14
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
                    "type": 4
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 12
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
            "type": 12
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 12,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 13,
                    "typeName": "WrappedEnvError"
                  }
                ],
                "index": 0,
                "name": "EnvExecutionFailed"
              },
              {
                "fields": [
                  {
                    "type": 14,
                    "typeName": "LangError"
                  }
                ],
                "index": 1,
                "name": "LangExecutionFailed"
              },
              {
                "index": 2,
                "name": "OwnersCantBeEmpty"
              },
              {
                "index": 3,
                "name": "ThresholdGreaterThanOwners"
              },
              {
                "index": 4,
                "name": "ThresholdCantBeZero"
              },
              {
                "index": 5,
                "name": "Unauthorized"
              },
              {
                "index": 6,
                "name": "MaxOwnersReached"
              },
              {
                "index": 7,
                "name": "OwnerAlreadyExists"
              },
              {
                "index": 8,
                "name": "NotOwner"
              },
              {
                "index": 9,
                "name": "MaxTransactionsReached"
              },
              {
                "index": 10,
                "name": "TxIdOverflow"
              },
              {
                "index": 11,
                "name": "AlreadyVoted"
              },
              {
                "index": 12,
                "name": "InvalidTxId"
              },
              {
                "index": 13,
                "name": "TransferFailed"
              }
            ]
          }
        },
        "path": [
          "multisig",
          "multisig",
          "Error"
        ]
      }
    },
    {
      "id": 13,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "Decode"
              },
              {
                "index": 1,
                "name": "CalleeTrapped"
              },
              {
                "index": 2,
                "name": "CalleeReverted"
              },
              {
                "index": 3,
                "name": "TransferFailed"
              },
              {
                "index": 4,
                "name": "NotCallable"
              },
              {
                "index": 5,
                "name": "Unexpected"
              }
            ]
          }
        },
        "path": [
          "multisig",
          "multisig",
          "WrappedEnvError"
        ]
      }
    },
    {
      "id": 14,
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
      "id": 15,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "name": "address",
                "type": 1,
                "typeName": "AccountId"
              },
              {
                "name": "selector",
                "type": 16,
                "typeName": "[u8; 4]"
              },
              {
                "name": "input",
                "type": 7,
                "typeName": "Vec<u8>"
              },
              {
                "name": "transferred_value",
                "type": 5,
                "typeName": "Balance"
              },
              {
                "name": "gas_limit",
                "type": 8,
                "typeName": "u64"
              },
              {
                "name": "allow_reentry",
                "type": 9,
                "typeName": "bool"
              }
            ]
          }
        },
        "path": [
          "multisig",
          "multisig",
          "Transaction"
        ]
      }
    },
    {
      "id": 16,
      "type": {
        "def": {
          "array": {
            "len": 4,
            "type": 3
          }
        }
      }
    },
    {
      "id": 17,
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
                    "type": 14
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
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 18,
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
                    "type": 14
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
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 19,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 9
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
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
            "type": 9
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 20,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 3
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
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
            "type": 3
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 21,
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
                    "type": 14
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
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 22,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
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
            "type": 6
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 23,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 24
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
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
            "type": 24
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 24,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "fields": [
                  {
                    "type": 15
                  }
                ],
                "index": 1,
                "name": "Some"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 15
          }
        ],
        "path": [
          "Option"
        ]
      }
    },
    {
      "id": 25,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 26
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
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
            "type": 26
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 26,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "fields": [
                  {
                    "type": 3
                  }
                ],
                "index": 1,
                "name": "Some"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 3
          }
        ],
        "path": [
          "Option"
        ]
      }
    },
    {
      "id": 27,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 28
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
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
            "type": 28
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 28,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "fields": [
                  {
                    "type": 9
                  }
                ],
                "index": 1,
                "name": "Some"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 9
          }
        ],
        "path": [
          "Option"
        ]
      }
    },
    {
      "id": 29,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 7,
                    "typeName": "Vec<u8>"
                  }
                ],
                "index": 0,
                "name": "Success"
              },
              {
                "fields": [
                  {
                    "type": 12,
                    "typeName": "Error"
                  }
                ],
                "index": 1,
                "name": "Failed"
              }
            ]
          }
        },
        "path": [
          "multisig",
          "multisig",
          "TxResult"
        ]
      }
    },
    {
      "id": 30,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 2,
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
      "id": 31,
      "type": {
        "def": {
          "primitive": "u32"
        }
      }
    },
    {
      "id": 32,
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

    get_owners(): Promise<Result<Vec, LangError>> {
        return this.stateCall('0x0b91ccc9', [])
    }

    is_owner(owner: AccountId): Promise<Result<bool, LangError>> {
        return this.stateCall('0xd7a3fbb1', [owner])
    }

    get_threshold(): Promise<Result<u8, LangError>> {
        return this.stateCall('0x23122a1d', [])
    }

    get_next_tx_id(): Promise<Result<bigint, LangError>> {
        return this.stateCall('0x95628e63', [])
    }

    get_active_txid_list(): Promise<Result<bigint[], LangError>> {
        return this.stateCall('0x7c22b655', [])
    }

    get_tx(index: bigint): Promise<Result<(Transaction | undefined), LangError>> {
        return this.stateCall('0x00702515', [index])
    }

    is_tx_valid(tx_id: bigint): Promise<Result<Type_11, LangError>> {
        return this.stateCall('0x7aec7567', [tx_id])
    }

    get_tx_approvals(tx_id: bigint): Promise<Result<(u8 | undefined), LangError>> {
        return this.stateCall('0x7818ec2a', [tx_id])
    }

    get_tx_rejections(tx_id: bigint): Promise<Result<(u8 | undefined), LangError>> {
        return this.stateCall('0xe6fca8b0', [tx_id])
    }

    get_tx_approval_for_account(tx_id: bigint, owner: AccountId): Promise<Result<(bool | undefined), LangError>> {
        return this.stateCall('0x0edbed0b', [tx_id, owner])
    }

    private async stateCall<T>(selector: string, args: any[]): Promise<T> {
        let input = _abi.encodeMessageInput(selector, args)
        let data = encodeCall(this.address, input)
        let result = await this.ctx._chain.client.call('state_call', ['ContractsApi_call', data, this.blockHash])
        let value = decodeResult(result)
        return _abi.decodeMessageOutput(selector, value)
    }
}

export type Event = Event_ThresholdChanged | Event_OwnerAdded | Event_OwnerRemoved | Event_TransactionProposed | Event_Approve | Event_Reject | Event_TransactionExecuted | Event_TransactionRemoved | Event_Transfer

export interface Event_ThresholdChanged {
    __kind: 'ThresholdChanged'
    threshold: u8
}

export interface Event_OwnerAdded {
    __kind: 'OwnerAdded'
    owner: AccountId
}

export interface Event_OwnerRemoved {
    __kind: 'OwnerRemoved'
    owner: AccountId
}

export interface Event_TransactionProposed {
    __kind: 'TransactionProposed'
    txId: bigint
    contractAddress: AccountId
    selector: Uint8Array
    input: Uint8Array
    transferredValue: bigint
    gasLimit: u64
    allowReentry: bool
}

export interface Event_Approve {
    __kind: 'Approve'
    txId: bigint
    owner: AccountId
}

export interface Event_Reject {
    __kind: 'Reject'
    txId: bigint
    owner: AccountId
}

export interface Event_TransactionExecuted {
    __kind: 'TransactionExecuted'
    txId: bigint
    result: TxResult
}

export interface Event_TransactionRemoved {
    __kind: 'TransactionRemoved'
    txId: bigint
}

export interface Event_Transfer {
    __kind: 'Transfer'
    to: AccountId
    value: bigint
}

export type Message = Message_propose_tx | Message_approve_tx | Message_reject_tx | Message_try_execute_tx | Message_try_remove_tx | Message_add_owner | Message_remove_owner | Message_change_threshold | Message_transfer | Message_get_owners | Message_is_owner | Message_get_threshold | Message_get_next_tx_id | Message_get_active_txid_list | Message_get_tx | Message_is_tx_valid | Message_get_tx_approvals | Message_get_tx_rejections | Message_get_tx_approval_for_account

export interface Message_propose_tx {
    __kind: 'propose_tx'
    tx: Transaction
}

export interface Message_approve_tx {
    __kind: 'approve_tx'
    txId: bigint
}

export interface Message_reject_tx {
    __kind: 'reject_tx'
    txId: bigint
}

export interface Message_try_execute_tx {
    __kind: 'try_execute_tx'
    txId: bigint
}

export interface Message_try_remove_tx {
    __kind: 'try_remove_tx'
    txId: bigint
}

export interface Message_add_owner {
    __kind: 'add_owner'
    owner: AccountId
}

export interface Message_remove_owner {
    __kind: 'remove_owner'
    owner: AccountId
}

export interface Message_change_threshold {
    __kind: 'change_threshold'
    threshold: u8
}

export interface Message_transfer {
    __kind: 'transfer'
    to: AccountId
    value: bigint
}

export interface Message_get_owners {
    __kind: 'get_owners'
}

export interface Message_is_owner {
    __kind: 'is_owner'
    owner: AccountId
}

export interface Message_get_threshold {
    __kind: 'get_threshold'
}

export interface Message_get_next_tx_id {
    __kind: 'get_next_tx_id'
}

export interface Message_get_active_txid_list {
    __kind: 'get_active_txid_list'
}

export interface Message_get_tx {
    __kind: 'get_tx'
    index: bigint
}

export interface Message_is_tx_valid {
    __kind: 'is_tx_valid'
    txId: bigint
}

export interface Message_get_tx_approvals {
    __kind: 'get_tx_approvals'
    txId: bigint
}

export interface Message_get_tx_rejections {
    __kind: 'get_tx_rejections'
    txId: bigint
}

export interface Message_get_tx_approval_for_account {
    __kind: 'get_tx_approval_for_account'
    txId: bigint
    owner: AccountId
}

export type Constructor = Constructor_new | Constructor_default

export interface Constructor_new {
    __kind: 'new'
    threshold: u8
    ownersList: Vec
}

export interface Constructor_default {
    __kind: 'default'
}

export type AccountId = Uint8Array

export type Vec = AccountId[]

export type LangError = LangError_CouldNotReadInput

export interface LangError_CouldNotReadInput {
    __kind: 'CouldNotReadInput'
}

export type bool = boolean

export type u8 = number

export interface Transaction {
    address: AccountId
    selector: Uint8Array
    input: Uint8Array
    transferredValue: bigint
    gasLimit: u64
    allowReentry: bool
}

export type Type_11 = Type_11_Ok | Type_11_Err

export interface Type_11_Ok {
    __kind: 'Ok'
}

export interface Type_11_Err {
    __kind: 'Err'
    value: Error
}

export type u64 = bigint

export type TxResult = TxResult_Success | TxResult_Failed

export interface TxResult_Success {
    __kind: 'Success'
    value: Uint8Array
}

export interface TxResult_Failed {
    __kind: 'Failed'
    value: Error
}

export type Error = Error_EnvExecutionFailed | Error_LangExecutionFailed | Error_OwnersCantBeEmpty | Error_ThresholdGreaterThanOwners | Error_ThresholdCantBeZero | Error_Unauthorized | Error_MaxOwnersReached | Error_OwnerAlreadyExists | Error_NotOwner | Error_MaxTransactionsReached | Error_TxIdOverflow | Error_AlreadyVoted | Error_InvalidTxId | Error_TransferFailed

export interface Error_EnvExecutionFailed {
    __kind: 'EnvExecutionFailed'
    value: WrappedEnvError
}

export interface Error_LangExecutionFailed {
    __kind: 'LangExecutionFailed'
    value: LangError
}

export interface Error_OwnersCantBeEmpty {
    __kind: 'OwnersCantBeEmpty'
}

export interface Error_ThresholdGreaterThanOwners {
    __kind: 'ThresholdGreaterThanOwners'
}

export interface Error_ThresholdCantBeZero {
    __kind: 'ThresholdCantBeZero'
}

export interface Error_Unauthorized {
    __kind: 'Unauthorized'
}

export interface Error_MaxOwnersReached {
    __kind: 'MaxOwnersReached'
}

export interface Error_OwnerAlreadyExists {
    __kind: 'OwnerAlreadyExists'
}

export interface Error_NotOwner {
    __kind: 'NotOwner'
}

export interface Error_MaxTransactionsReached {
    __kind: 'MaxTransactionsReached'
}

export interface Error_TxIdOverflow {
    __kind: 'TxIdOverflow'
}

export interface Error_AlreadyVoted {
    __kind: 'AlreadyVoted'
}

export interface Error_InvalidTxId {
    __kind: 'InvalidTxId'
}

export interface Error_TransferFailed {
    __kind: 'TransferFailed'
}

export type WrappedEnvError = WrappedEnvError_Decode | WrappedEnvError_CalleeTrapped | WrappedEnvError_CalleeReverted | WrappedEnvError_TransferFailed | WrappedEnvError_NotCallable | WrappedEnvError_Unexpected

export interface WrappedEnvError_Decode {
    __kind: 'Decode'
}

export interface WrappedEnvError_CalleeTrapped {
    __kind: 'CalleeTrapped'
}

export interface WrappedEnvError_CalleeReverted {
    __kind: 'CalleeReverted'
}

export interface WrappedEnvError_TransferFailed {
    __kind: 'TransferFailed'
}

export interface WrappedEnvError_NotCallable {
    __kind: 'NotCallable'
}

export interface WrappedEnvError_Unexpected {
    __kind: 'Unexpected'
}

export type Result<T, E> = {__kind: 'Ok', value: T} | {__kind: 'Err', value: E}
