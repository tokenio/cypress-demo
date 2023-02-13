// let C_REFID = ''
// let REDIRECT_URL = ''

const mockRedirectPayload = (BANK_ID, C_REFID, REDIRECT_URL) => {
    return {
    initiation: {
        bankId: BANK_ID,
        refId: `${C_REFID}`,
        remittanceInformationPrimary: `RemittancePrimary${C_REFID}`,
        remittanceInformationSecondary: `RemittanceSecondary${C_REFID}`,
        amount : {
            value: "5.00",
            currency: "GBP"
        },
        localInstrument: "FASTER_PAYMENTS",
        creditor: {
            name: "Clara Creditor",
            sortCode: "123456",
            accountNumber: "12345678"
        },
        callbackUrl: `${REDIRECT_URL}`,
        callbackState: `CallbackState${C_REFID}`
    },
    pispConsentAccepted: true
    }
}

const bancoPostaPayload = (BANK_ID, C_REFID, REDIRECT_URL) => {
    return {
        initiation: {
          bankId: BANK_ID,
          refId: C_REFID,
          remittanceInformationPrimary: `RemittancePrimary${C_REFID}`,
          remittanceInformationSecondary: `RemittanceSecondary${C_REFID}`,
          amount: {
            value: "5.00",
            currency: "EUR"
          },
          localInstrument: "SEPA",
          debtor: {
            name: "Dan Debtor",
            iban: "IT41Q0760103200001009197649"
          },
          creditor: {
            name: "Clara Creditor",
            iban: "IT41Q0760103200001009197649"
          },
          callbackUrl: `${REDIRECT_URL}`,
          callbackState: `CallbackState${C_REFID}`
        },
        pispConsentAccepted: true
      }
}


const authCallbackPayload = (C_REFID) => {
    return {
    query: `state=CallbackState${C_REFID}` 
    }
}

module.exports = { mockRedirectPayload, bancoPostaPayload, authCallbackPayload }