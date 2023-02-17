Feature: Payments V2
    
    @token-callback @two-step
    Scenario: Verify that token callback request is sent successfully for mock-redirect

        Given User Sends createPaymentRequest to "mock-redirect" bank id
        Then Payment status should be "INITIATION_PENDING_REDIRECT_AUTH"
        When User visits the redirect url
        Then Final url should be "^https://auth\.dev\.token\.io/mock-integration/dumb\?member-id=m:[a-zA-Z0-9]+:[a-zA-Z0-9]+&payment-id=pm2:[a-zA-Z0-9]+:[a-zA-Z0-9]+&state=CallbackState[0-9]+&status=INITIATION_PENDING_REDEMPTION$"
        When Token redeems the payment and gets "INITIATION_PROCESSING" status
        Then User sends getPayment request and gets "INITIATION_PROCESSING" status

    @token-callback @one-step-decoupled
    Scenario: Verify that token callback requests is sent successfully for Banco Posta

        Given User Sends createPaymentRequest to "ngp-cbi-07601-annex" bank id
        Then Payment status should be "INITIATION_PENDING_REDIRECT_AUTH"
        When User visits the redirect url
        Then User logs in via home page for bank with "ngp-cbi-07601-annex" bank id
        And Final url should be "^https:\/\/auth\.dev\.token\.io\/mock-integration\/dumb\?member-id=m:[a-zA-Z0-9]+:[a-zA-Z0-9]+&payment-id=pm2:[a-zA-Z0-9]+:[a-zA-Z0-9]+&state=CallbackState\d+&status=INITIATION_PENDING_DECOUPLED_AUTH$"
        And User wait for "3" seconds
        When User visits the redirect url
        And User wait for "3" seconds
        And User logs in via home page for bank with "ngp-cbi-07601-annex" bank id
        And User wait for "3" seconds

        # repeating visting redirect url since its not opening the bank homepage after one redirect
        # When User visits the redirect url
        # And User wait for "3" seconds
        # And User logs in via home page for bank with "ngp-cbi-07601-annex" bank id
        # And User wait for "3" seconds

        And User accepts the concent on the page
        And User wait for "3" seconds
        And User fills code and sms and click on continue 
        Then Final url should be "^https://auth\.dev\.token\.io/mock-integration/dumb\?member-id=m:[a-zA-Z0-9]+:[a-zA-Z0-9]+&payment-id=pm2:[a-zA-Z0-9]+:[a-zA-Z0-9]+&state=CallbackState[0-9]+&status=INITIATION_PROCESSING$"
        And User sends getPayment request and gets "INITIATION_PROCESSING" status
        
       

    