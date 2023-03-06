let payloadValue = (BANK_ID, C_REFID, REDIRECT_URL, LOCAL_INSTRUMENT, sortCode, accountNumber, creditorIban, debtorIban) => {
    const payload = 
      {
        initiation: {
          bankId: BANK_ID,
          refId: C_REFID,
          remittanceInformationPrimary: `RemittancePrimary${C_REFID}`,
          remittanceInformationSecondary: `RemittanceSecondary${C_REFID}`,
          amount: {
            value: "5.00",
            currency: "EUR"
          },
          localInstrument: `${LOCAL_INSTRUMENT}`,
          debtor: debtorIban == 'NA' ? null :  debtor(debtorIban),
          creditor: creditorWith(sortCode, accountNumber, creditorIban),
          callbackUrl: `${REDIRECT_URL}`,
          callbackState: `CallbackState${C_REFID}`
        },
        pispConsentAccepted: true
    };
    
    if (payload.initiation.debtor === null) {
      delete payload.initiation.debtor
    }
    console.log(payload)
    return payload
}

let creditor = (paymentType, iban, sortCode) => {
  creditor = paymentType ==  'FASTER_PAYMENTS' ?  creditorWith(iban, sortCode) : 
            paymentType == ('SEPA' || 'ELIXIR') ? creditorWithIban(iban) :
            paymentType ==  'EXPRESS_ELIXIR' ?  creditorWith(iban) : 
            creditorWithIban

  return creditor
}

let creditorWith = (sortCode, accountNumber, iban) => {
  let creditor = {
    name: "Clara Creditor",
    sortCode: getValue(sortCode),
    accountNumber: getValue(accountNumber),
    iban: getValue(iban)
  }
  if (creditor.sortCode === null) {
    delete creditor.sortCode;
  }

  if (creditor.accountNumber === null) {
    delete creditor.accountNumber;
  }
  if (creditor.iban === null) {
    delete creditor.iban;
  }
  return creditor
}

let debtor = (debtorIban) =>  {
  return {
    name: "Dan Debtor",
    iban: debtorIban
  }
}

let creditorWithIban = (iban = "PL92124049371831347560745013") => {
  return {
    name: "Clara Creditor",
    iban
  }
}

let getValue = (parameter) => {
     return parameter = parameter == 'NA' ? null : parameter
}

let authCallbackPayload = (C_REFID) => {
    return {
    query: `state=CallbackState${C_REFID}` 
    }
}

// payloadValue("erw", "daf", "adf", "adf", "adf", "NA", 'fds', 'NA')

module.exports = { authCallbackPayload, payloadValue }