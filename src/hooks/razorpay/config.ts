export const freeChargeAndUPI = { config: {
    display: {
      blocks: {
        banks: {
          name: 'Most Used Methods',
          instruments: [
            {
              method: 'wallet',
              wallets: ['freecharge']
            },
            {
                method: 'upi'
            },
            ],
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: true,
      },
    },
  },
} 

export const olaMoneyAndWallet = {
    config: {
    display: {
      blocks: {
        banks: {
          name: 'Methods With Offers',
          instruments: [
            {
              method: 'wallet',
              wallets: ['olamoney']
            },
            {
              method: 'wallet',
              wallets: ['freecharge']
            }]
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: true,
      },
    },
  },
}

export const customMostUsedMethods = {
    config: {
    display: {
      blocks: {
        banks: {
          name: 'Most Used Methods',
          instruments: [
            {
              method: 'wallet',
              wallets: ['freecharge']
            },
            {
                method: 'upi'
            },
            ],
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: true,
      },
    },
  },
}

export const onlyUsingCertainBanks = {
    config: {
    display: {
      blocks: {
        banks: {
          name: 'Pay Using Axis Bank',
          instruments: [
            {
              method: 'netbanking',
              banks: ['UTIB'],
            },
            {
              method: 'card',
              issuers: ['UTIB'],
            }
          ],
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: false,
      },
    },
  },
}

export const reOrderPaymentMethods = {
    config: {
    display: {
      blocks: {
        banks: {
          name: 'All Payment Options',
          instruments: [
            {
              method: 'upi'
            },
            {
              method: 'card'
            },
            {
                method: 'wallet'
            },
            {
                method: 'netbanking'
            }
          ],
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: false,
      },
    },
  },
}

export const removeEmiOptionMethod = {
    config: {
    display: {
      hide: [
        {
          method: 'emi'
        }
      ],
      preferences: {
        show_default_blocks: true,
      },
    },
  },
}


export const onlyASinglePaymentMethod = {
    config: {
  display: {
    blocks: {
      cards_only: {
        name: "Pay via Card",
        instruments: [
          {
            method: "card",
          },
        ],
      },
    },
    sequence: ["block.cards_only"],
    preferences: {
      show_default_blocks: false,
      },
    },
  },
}

export const landOnUPI = {
    config: {
    display: {
      blocks: {
        banks: {
          name: 'Pay via UPI',
          instruments: [
            {
              method: 'upi'
            }
          ],
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: false,
      },
    },
  },
}

export const landOnEmi = {
    config: {
  display: {
    blocks: {
      banks: {
        name: "Pay Using HDFC Bank",
        instruments: [
          {
              method: "emi",
              issuers: ["HDFC"],
              types: ["debit"],
              iins: [438628]
          },
        ]
      },
    },
    sequence: ["block.banks"],
    preferences: {
      show_default_blocks: false 
    }
  }
}
}