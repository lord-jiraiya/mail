from twilio.rest import Client 
 
account_sid = 'AC5ef024bb202a8fe8a0de728c221a264d' 
auth_token = '56c3721b008ab8c97ee55a63e0591f50' 
client = Client(account_sid, auth_token) 
 
message = client.messages.create( 
                              from_='+16109474264',  
                              body='I miss You, Juhi',      
                              to='+916202348887' 
                          ) 
 
print(message)