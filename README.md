# Readme

z-index
110 : modal
100 : mobile-navbar
50: search game filter 
2: badge provider (joker - hot)

# Setup

copy .env.example to .env
npm install
npm run dev / npm run start

# PayID deposits

The wallet includes a PayID (AUD) manual bank-transfer flow. Configure the
following deployment environment variables before enabling it:

```env
NEXT_PUBLIC_PAYID_IDENTIFIER=your-payid@example.com
NEXT_PUBLIC_PAYID_ACCOUNT_NAME=Your registered PayID account name
NEXT_PUBLIC_PAYID_BANK_ID=payid
NEXT_PUBLIC_PAYID_MINIMUM_AMOUNT=10
```

The browser creates a pending deposit through the existing deposit API using a
unique payment reference. It must not mark a payment as successful by itself:
the server/payment team must reconcile the bank statement or a trusted banking
provider webhook and then approve the pending deposit. Do not put banking API
credentials or webhook signing secrets in `NEXT_PUBLIC_*` variables.
