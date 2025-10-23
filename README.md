# charity-management-system
 

## Project Overview
The **Charity Management System** is a web-based application that facilitates donations from donors and manages beneficiaries efficiently.  
Donors can contribute by specifying an amount and generating a **QR code** for payment. Beneficiaries can apply for help through a form, which is reviewed by the admin. Once approved, their details become visible publicly.

---

## Features
- Donors can **donate using QR code** generated based on the entered amount.  
- Beneficiaries can **apply for help** through a submission form.  
- Admin can **review and verify** beneficiary requests stored in a **temporary table**.  
- Approved beneficiaries are moved to a **permanent table** and displayed on the website.  
- Public can **view the list of verified beneficiaries**.  

---

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **Version Control:** Git, GitHub  
- **Other Tools:** Node Package Manager (NPM)  

---

## How It Works
1. **Donations:**  
   - Donor enters an amount → QR code is generated → completes the donation.  
2. **Beneficiary Application:**  
   - Applicant fills the help request form → data stored in a **temporary table**.  
3. **Admin Verification:**  
   - Admin reviews applications → clicks **Accept** for genuine requests → beneficiary data moves to **permanent table**.  
4. **Public Display:**  
   - Approved beneficiaries are visible publicly on the website.  

---

 
