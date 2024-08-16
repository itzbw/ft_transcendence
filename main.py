import time
import qrcode
import pyotp

key = "myappkey"

# Replace 'myapp' with the name of your application
uri = pyotp.totp.TOTP(key).provisioning_uri(name="mike", issuer_name="myapp")

print(uri)

# Generate the QR code and save it as an image
qrcode.make(uri).save("totp.png") 