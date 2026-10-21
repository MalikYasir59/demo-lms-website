# EmailJS Cloud Integration Guide
## Institute of Trading Tricks (`instituteoftradingtricks@gmail.com`)

This guide walks you through connecting your **EmailJS Cloud** account to the Institute of Trading Tricks Contact & Seat Reservation form, so every visitor enquiry is instantly delivered to **`instituteoftradingtricks@gmail.com`**.

---

## Overview of How It Works

1. A visitor fills out the **Reserve your seat** contact form on the website.
2. The browser submits the form data via the secure `@emailjs/browser` SDK.
3. EmailJS receives the parameters and generates an email using your custom template.
4. The email is delivered directly to **`instituteoftradingtricks@gmail.com`** with the student's name, phone/WhatsApp, email, selected course, and message.
5. You can reply directly to the student from your Gmail inbox!

---

## Step 1: Create a Free EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/).
2. Click **Sign Up Free**.
3. You can sign up using your Google Account (`instituteoftradingtricks@gmail.com`) or any email.
   > **Note:** The free plan includes **200 free emails per month**, which is more than enough for daily student inquiries and enrollment requests.

---

## Step 2: Connect Your Gmail Email Service

1. Once logged into the [EmailJS Dashboard](https://dashboard.emailjs.com/admin), navigate to **Email Services** in the left sidebar.
2. Click **Add New Service**.
3. Select **Gmail** from the list of personal email services.
4. Configure the service:
   - **Name:** `ITT Admissions Gmail` (or any friendly name)
   - **Service ID:** Leave the default or set something easy to remember like `service_itt` (Copy this ID!).
5. Click **Connect Account**.
6. A Google authentication popup will appear:
   - Choose or sign into **`instituteoftradingtricks@gmail.com`**.
   - Check the box granting EmailJS permission to send emails on your behalf.
7. Click **Create Service**.

> **Keep this Service ID handy** for Step 5: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`.

---

## Step 3: Create the Email Template

1. In the left sidebar, click **Email Templates**.
2. Click **Create New Template**.
3. Set the template fields as follows:

### Template Settings:
- **To Email:** `instituteoftradingtricks@gmail.com`
- **From Name:** `{{from_name}} (via ITT Website)`
- **Reply To:** `{{from_email}}`
- **Subject:** `New Enrollment Enquiry from {{from_name}} - [{{course}}]`

### Content Body (Copy & Paste this into the template editor):
```html
<h2>New Course Enrollment & Seat Reservation Enquiry</h2>
<p>A new enquiry has been submitted through the Institute of Trading Tricks contact page:</p>

<table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
  <tr style="background-color: #f4f4f4;">
    <td style="padding: 10px; font-weight: bold; width: 180px;">Student Name:</td>
    <td style="padding: 10px;">{{from_name}}</td>
  </tr>
  <tr>
    <td style="padding: 10px; font-weight: bold;">Phone / WhatsApp:</td>
    <td style="padding: 10px;"><a href="tel:{{phone}}">{{phone}}</a> | <a href="https://wa.me/{{phone}}">Chat on WhatsApp</a></td>
  </tr>
  <tr style="background-color: #f4f4f4;">
    <td style="padding: 10px; font-weight: bold;">Email:</td>
    <td style="padding: 10px;"><a href="mailto:{{from_email}}">{{from_email}}</a></td>
  </tr>
  <tr>
    <td style="padding: 10px; font-weight: bold;">Selected Course:</td>
    <td style="padding: 10px; font-weight: bold; color: #1D4ED8;">{{course}}</td>
  </tr>
  <tr style="background-color: #f4f4f4;">
    <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message / Notes:</td>
    <td style="padding: 10px; white-space: pre-wrap;">{{message}}</td>
  </tr>
  <tr>
    <td style="padding: 10px; font-weight: bold;">Submitted At:</td>
    <td style="padding: 10px;">{{time_stamp}}</td>
  </tr>
</table>

<br/>
<p style="font-size: 12px; color: #666;">
  To reply to the student directly, simply hit "Reply" in your email client (replies go to {{from_email}}).
</p>
```

4. Click **Save** in the top right.
5. In the top settings tab, copy the **Template ID** (e.g., `template_7x8q9w2`).

> **Keep this Template ID handy** for Step 5: `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`.

---

## Step 4: Get Your Public Key (API Key)

1. In the left sidebar, click **Account** (or the gear icon).
2. Go to the **API Keys** section.
3. Copy your **Public Key** (e.g., `aBcD1234_xyz-9876`).

> **Keep this Public Key handy** for Step 5: `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.

---

## Step 5: Add the Keys to Your Environment Files

Open your local configuration file `.env.local` in the project root:

```env
# ==============================================================================
# EmailJS Cloud Configuration (instituteoftradingtricks@gmail.com)
# ==============================================================================
NEXT_PUBLIC_EMAILJS_SERVICE_ID="your_service_id_here"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your_template_id_here"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_public_key_here"
```

Replace `your_service_id_here`, `your_template_id_here`, and `your_public_key_here` with your real keys from Steps 2, 3, and 4.

### Important: Restart the Development Server
Because Next.js embeds `NEXT_PUBLIC_*` environment variables during build / startup, restart your local server after updating `.env.local`:
```bash
npm run dev
```

---

## Step 6: Testing the Form

1. Navigate to `http://localhost:3000/contact`.
2. Fill out the contact form:
   - **Full name:** Test Student
   - **Phone / WhatsApp:** 0307 7330777
   - **Email:** your personal email
   - **Course:** Advance (Intermediate)
   - **Message:** Testing EmailJS cloud integration.
3. Click **SEND ENROLLMENT REQUEST**.
4. You will see:
   > *"Thank you! Your seat reservation request has been sent to our admissions desk at instituteoftradingtricks@gmail.com."*
5. Check your inbox at **`instituteoftradingtricks@gmail.com`**. You should see the test email within a few seconds!

---

## Form Parameter Reference

Here is the exact list of parameter variables that the Contact Us form transmits to your EmailJS template:

| Parameter Variable | Description | Example Value |
|---|---|---|
| `{{to_email}}` | Destination inbox | `instituteoftradingtricks@gmail.com` |
| `{{from_name}}` | Student's full name | `Muhammad Ali` |
| `{{phone}}` | Contact phone / WhatsApp | `0307 7330777` |
| `{{from_email}}` | Student's email | `student@example.com` |
| `{{course}}` | Course selected from dropdown | `Pro Trading Course (Advanced)` |
| `{{message}}` | Inquirer's message or experience | `I want to join the upcoming weekend batch.` |
| `{{time_stamp}}` | Local submission timestamp | `10/21/2026, 8:45 PM` |
| `{{reply_to}}` | Used by EmailJS for direct reply | `student@example.com` |

---

## Troubleshooting & Tips

### 1. Error: `The Public Key is invalid` or `Service ID not found`
- Verify that your keys in `.env.local` match exactly with no extra spaces or quotes.
- Remember to restart `npm run dev` after changing `.env.local`.

### 2. Emails are going to Spam
- In Gmail, open the first received email in Spam, click **Report not spam**, or add `instituteoftradingtricks@gmail.com` to your contacts.

### 3. Re-authorizing Gmail
- If you change your Google account password in the future, visit EmailJS **Email Services**, click on your Gmail service, and click **Re-authorize**.
