Feature: Payments V2
    
    @token-callback @two-step
    Scenario: Verify that token callback request is sent successfully for "<bank-id>"

        Given User Sends createPaymentRequest to "<bank-id>" bank id with "<localInstrument>" "<sortCode>" "<account>" "<creditorIban>" "<debtorIban>" details
        Then Payment status should be "INITIATION_PENDING_REDIRECT_AUTH"
        When User visits the redirect url and perform necessary action
        Then Final url should contain "INITIATION_PENDING_REDEMPTION" and payment id
        When User Sends RedeemPayment request and gets "INITIATION_PROCESSING" status
        Then User sends getPayment request and gets "INITIATION_PROCESSING" status

        Examples:
        | bank-id         | localInstrument | sortCode | account  |         creditorIban         | debtorIban |
        | mock-redirect   | FASTER_PAYMENTS | 123456   | 12345678 |        NA                    |  NA        | 
        | ob-lloyds       | FASTER_PAYMENTS | 123456   | 12345678 |        NA                    |  NA        | 
        | pa-ing          | SEPA            | NA       | NA       | PL92124049371831347560745013 |  NA        | 
        | pa-ing          | ELIXIR          | NA       | NA       | PL92124049371831347560745013 |  NA        | 
        | pa-ing          | EXPRESS_ELIXIR  | NA       | NA       | PL92124049371831347560745013 |  NA        | 
        | citipl          | ELIXIR          | NA       | NA       | PL07BARC20325388680799       |  NA        | 
        | mbank           | SEPA            | NA       | NA       | PL62160010420002014739310056 |  NA        | 
        | mbank           | ELIXIR          | NA       | NA       | PL62160010420002014739310056 |  NA        |

    @tpp-callback @two-step
    Scenario: Verify that tpp callback request is sent successfully for "<bank-id>"

        Given User Sends createPaymentRequest to "<bank-id>" bank id with "<localInstrument>" "<sortCode>" "<account>" "<creditorIban>" "<debtorIban>" details
        Then Payment status should be "INITIATION_PENDING_REDIRECT_AUTH"
        When User visits the redirect url and perform necessary action
        Then Final url should contain "CallbackState" and ref id
        When User Sends OnBankAuthCallback request
        Then Payment status should be "INITIATION_PENDING_REDEMPTION"
        When User Sends RedeemPayment request and gets "INITIATION_PROCESSING" status
        Then User sends getPayment request and gets "INITIATION_PROCESSING" status

        Examples:
        | bank-id         | localInstrument | sortCode | account  |         creditorIban         | debtorIban |
        | mock-redirect   | FASTER_PAYMENTS | 123456   | 12345678 |        NA                    |  NA        | 
        | ob-lloyds       | FASTER_PAYMENTS | 123456   | 12345678 |        NA                    |  NA        | 
        | pa-ing          | SEPA            | NA       | NA       | PL92124049371831347560745013 |  NA        | 
        | pa-ing          | ELIXIR          | NA       | NA       | PL92124049371831347560745013 |  NA        | 
        | pa-ing          | EXPRESS_ELIXIR  | NA       | NA       | PL92124049371831347560745013 |  NA        | 
        | citipl          | ELIXIR          | NA       | NA       | PL07BARC20325388680799       |  NA        | 
        | mbank           | SEPA            | NA       | NA       | PL62160010420002014739310056 |  NA        | 
        | mbank           | ELIXIR          | NA       | NA       | PL62160010420002014739310056 |  NA        | 
    

    # @token-callback @one-step-decoupled
    # Scenario: Verify that token callback requests is sent successfully for Banco Posta

    #     Given User Sends createPaymentRequest to "<bank-id>" bank id with "<localInstrument>" "<sortCode>" "<account>" "<creditorIban>" "<debtorIban>" details
    #     Then Payment status should be "INITIATION_PENDING_REDIRECT_AUTH"
    #     When User visits the redirect url
    #     Then User logs in via home page for bank with "ngp-cbi-07601-annex" bank id
    #     And Final url should be "^https:\/\/auth\.dev\.token\.io\/mock-integration\/dumb\?member-id=m:[a-zA-Z0-9]+:[a-zA-Z0-9]+&payment-id=pm2:[a-zA-Z0-9]+:[a-zA-Z0-9]+&state=CallbackState\d+&status=INITIATION_PENDING_DECOUPLED_AUTH$"
    #     And User wait for "3" seconds
    #     When User visits the redirect url
    #     And User wait for "3" seconds
    #     And User logs in via home page for bank with "ngp-cbi-07601-annex" bank id
    #     And User wait for "3" seconds

    #     # repeating visting redirect url since its not opening the bank homepage after one redirect
    #     # When User visits the redirect url
    #     # And User wait for "3" seconds
    #     # And User logs in via home page for bank with "ngp-cbi-07601-annex" bank id
    #     # And User wait for "3" seconds

    #     And User accepts the concent on the page
    #     And User wait for "3" seconds
    #     And User fills code and sms and click on continue 
    #     Then Final url should be "^https://auth\.dev\.token\.io/mock-integration/dumb\?member-id=m:[a-zA-Z0-9]+:[a-zA-Z0-9]+&payment-id=pm2:[a-zA-Z0-9]+:[a-zA-Z0-9]+&state=CallbackState[0-9]+&status=INITIATION_PROCESSING$"
    #     And User sends getPayment request and gets "INITIATION_PROCESSING" status
        
    #     Examples:
    #     | bank-id             | localInstrument | sortCode | account  |         creditorIban         | debtorIban |
    #     | ngp-cbi-07601-annex | FASTER_PAYMENTS | 123456   | 12345678 |        NA                    |  NA        |
       

    