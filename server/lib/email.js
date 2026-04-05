import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send invitation email to a new team member
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.invitationToken - Unique invitation token
 * @param {string} params.organizationName - Name of the organization
 * @param {string} params.inviterEmail - Email of the person sending the invitation
 * @param {string} params.role - Role being assigned (viewer, member, admin)
 */
export async function sendInvitationEmail({
  to,
  invitationToken,
  organizationName,
  inviterEmail,
  role,
}) {
  const invitationUrl = `${process.env.FRONTEND_URL}/invitation/${invitationToken}`;

  const roleDescriptions = {
    viewer: 'View transactions and reports',
    member: 'Manage your own transactions',
    admin: 'Manage all transactions and team members',
  };

  const roleDescription = roleDescriptions[role] || 'Access the finance tracker';

  try {
    const { data, error } = await resend.emails.send({
      from: 'Finance Tracker <onboarding@resend.dev>',
      to: [to],
      subject: `You've been invited to join ${organizationName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Team Invitation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Finance Tracker</h1>
            </div>

            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">You've been invited!</h2>

              <p style="font-size: 16px; color: #4b5563;">
                <strong>${inviterEmail}</strong> has invited you to join <strong>${organizationName}</strong> on Finance Tracker.
              </p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Role</p>
                <p style="margin: 8px 0 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${role.charAt(0).toUpperCase() + role.slice(1)}</p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${roleDescription}</p>
              </div>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${invitationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Accept Invitation</a>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${invitationUrl}" style="color: #667eea; word-break: break-all;">${invitationUrl}</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Invitation email sent successfully:', data);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
}
