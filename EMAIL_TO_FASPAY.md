# 📧 Email Template for Faspay Support

Copy and paste this email to send to Faspay support:

---

**To:** support@faspay.co.id  
**Subject:** URL Registration - Autolaku Dropship (Merchant ID: 36480)

---

Kepada Tim Faspay,

Mohon bantuan untuk registrasi URL berikut untuk integrasi Xpress v4:

## 1. URL Notifikasi Pembayaran (Payment Notification / Webhook):
```
https://www.autolaku.com/api/payments/webhook
```
- **Method:** POST
- **Format:** JSON
- **Fungsi:** Server-to-server notification untuk update status pembayaran

**Contoh Request dari Faspay ke kami:**
```json
POST https://www.autolaku.com/api/payments/webhook
Content-Type: application/json

{
  "request": "Payment Notification",
  "trx_id": "3648040500001234",
  "merchant_id": "36480",
  "merchant": "Autolaku Dropship",
  "bill_no": "AUTOLAKU-1730123456-001",
  "payment_reff": "PAY123456",
  "payment_date": "2025-10-28 10:30:45",
  "payment_status_code": "2",
  "payment_status_desc": "Payment Success",
  "bill_total": "100000",
  "payment_total": "100000",
  "payment_channel_uid": "711",
  "payment_channel": "ShopeePay QRIS",
  "signature": "abc123def456..."
}
```

**Contoh Response dari kami ke Faspay:**
```json
{
  "response": "Payment Notification",
  "trx_id": "3648040500001234",
  "merchant_id": "36480",
  "bill_no": "AUTOLAKU-1730123456-001",
  "response_code": "00",
  "response_desc": "Success",
  "response_date": "2025-10-28 10:30:46"
}
```

## 2. URL Landing Page (Return URL / Callback):
```
https://www.autolaku.com/subscription/success
```
- **Method:** GET (redirect)
- **Format:** Query parameters  
- **Fungsi:** Redirect user setelah pembayaran

**Contoh Redirect dari Faspay:**
```
https://www.autolaku.com/subscription/success?trx_id=3648040500001234&merchant_id=36480&merchant=Autolaku+Dropship&bill_no=AUTOLAKU-1730123456-001&bill_ref=AUTOLAKU-1730123456-001&bill_total=100000&bank_user_name=Customer+Name&status=0&signature=abc123def456...
```

**Note:** URL Landing Page ini hanya untuk menampilkan halaman sukses ke customer. Update status pembayaran akan dilakukan melalui URL Notifikasi (webhook).

---

**Detail Merchant:**
- Payment Channel: QRIS (ShopeePay) - Channel Code 711
- Merchant ID: 36480
- User ID: bot36480

Mohon konfirmasi setelah URL ini berhasil didaftarkan di sistem Faspay sehingga kami dapat melakukan testing.

Terima kasih atas bantuannya.

Hormat kami,  
**Autolaku Team**

---

## ⚠️ Important Notes for You:

1. **Send this email NOW** to get the URLs registered
2. **Wait for confirmation** from Faspay before testing
3. **After confirmation**, test with real QRIS payment
4. **Check logs** to verify webhook is received
5. **Verify** user account gets activated

---

## 🔍 What Faspay Will Do:

1. Register both URLs in their system
2. Link them to your Merchant ID (36480)
3. Enable webhook notifications to your server
4. Enable return URL redirects after payment

Once registered, Faspay will:
- ✅ Send POST requests to `/api/payments/webhook` when payment completes
- ✅ Redirect users to `/subscription/success` after payment

---

## 📞 Faspay Support Contacts:

- **Email:** support@faspay.co.id
- **For urgent issues:** Check Faspay dashboard for live chat

---

**Ready to send? Copy the email above and send it now!** 🚀

