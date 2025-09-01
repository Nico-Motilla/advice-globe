import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to:', options.to)
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Password Reset - Advice Globe</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You have requested to reset your password for Advice Globe.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
      <p>If you did not request this password reset, please ignore this email.</p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <br>
      <p>Best regards,<br>Advice Globe Team</p>
    </body>
    </html>
  `

  const textContent = `
    Password Reset Request
    
    You have requested to reset your password for Advice Globe.
    
    Visit this link to reset your password: ${resetUrl}
    
    If you did not request this password reset, please ignore this email.
    
    This link will expire in 1 hour for security reasons.
    
    Best regards,
    Advice Globe Team
  `

  await sendEmail({
    to: email,
    subject: 'Password Reset - Advice Globe',
    text: textContent,
    html: htmlContent,
  })
}