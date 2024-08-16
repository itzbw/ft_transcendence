import time
import qrcode
import pyotp

key = "myappkey"

totp = pyotp.TOTP(key)

while True:
            print(totp.verify(input("Enter code:")))