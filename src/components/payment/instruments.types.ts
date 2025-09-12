import type { Bank } from "./bank";

type Method = 'card' | 'netbanking' | 'upi' | 'wallet';

interface Instrument {
        method: Method;
        banks: Bank[];
    }

interface EMIInstrument {
              method: "emi",
              issuers: Bank[],
              types: ["debit"],
              iins: number[]
}

interface Banks {
    name: string;
    instruments: Instrument | EMIInstrument[];
}

export interface Display {
    hide ?:Instrument[] ,
    blocks: {
        banks: Banks;
        cards_only?:Banks;
    };
    sequence?: string[];
    preferences?: {
        show_default_blocks: boolean;
    }
}

export interface RazorPayConfigCheckoutOption {
    config: {
        display: Display
    }
}