const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendSellerApprovalEmail = async (seller) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: seller.email,
            subject: 'Your GadgetNest Seller Account Has Been Approved',
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Congratulations, ${seller.name}!</h2>
          <p>Your seller account on GadgetNest has been approved.</p>
          <p>You can now log in to your account and start listing your products.</p>
          <p>Thank you for joining our marketplace!</p>
          <p>Best regards,<br>The GadgetNest Team</p>
        </div>
      `
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Approval email sent:', info.messageId)
        return true
    } catch (error) {
        console.error('Error sending approval email:', error)
        return false
    }
}

const sendSellerSuspensionEmail = async (seller) => {
    console.log(seller.suspensionReason)
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: seller.email,
            subject: 'Your GadgetNest Seller Account Has Been Suspended',
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${seller.name},</h2>
          <p>Unfortunately, your seller account on GadgetNest has been suspended.</p>
          <p><strong>Reason:</strong> ${seller.suspensionReason || 'No specific reason provided'}</p>
          <p>If you believe this is a mistake or would like to appeal this decision, please contact our support team.</p>
          <p>Best regards,<br>The GadgetNest Team</p>
        </div>
      `
        }
        const info = await transporter.sendMail(mailOptions)
        console.log('Suspension email sent:', info.messageId)
        return true
    } catch (error) {
        console.error('Error sending suspension email:', error)
        return false
    }
}

const sendRegistrationEmail = async (seller) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: seller.email,
            subject: 'Your GadgetNest Seller Account Registration',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Thank you for registering, ${seller.name}!</h2>
                <p>Your seller account on GadgetNest has been received and is pending approval.</p>
                <p>Our admin team will review your application shortly. You'll receive another email once your account is approved.</p>
                <p>Best regards,<br>The GadgetNest Team</p>
              </div>
            `
        }
        const info = await transporter.sendMail(mailOptions);
        console.log('Registration email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending registration email:', error)
        return false
    }
}

module.exports = {
    sendSellerApprovalEmail,
    sendSellerSuspensionEmail,
    sendRegistrationEmail
}

