from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import logging
from django.db.models import Q
from django.utils import timezone

from apps.referral_app.models import CustomUser

logger = logging.getLogger(__name__)

class EmailActions:
    
    @staticmethod
    def send_referral_notification(referral):
        """
        Send referral notification email after submission
        """
        try:
            hr_emails = CustomUser.objects.filter(
                Q(is_active=True) & Q(type=CustomUser.TypeChoices.hr) 
            ).values_list('email', flat=True)

            context = {
                'employee_name': referral.referred_by.get_full_name(),
                'employee_id': referral.referred_by.emp_code,
                'employee_email': referral.referred_by.email,
                'candidate_name': referral.fullname,
                'position': referral.role if referral.role else 'General Application',
                'department': referral.department if referral.department else 'N/A',
                'submission_date': referral.created_at.strftime('%B %d, %Y at %I:%M %p'),
                'candidate_email': getattr(referral, 'email', ''),
                'candidate_phone': getattr(referral, 'phone_number', ''),
                'resume_attached': bool(getattr(referral, 'resume', None)),
                'dashboard_url': f"test/referrals/{referral.id}",
            }
            
            html_content = render_to_string('emails/referral_notification.html', context)
            
            text_content = f"""
                New Referral Submitted

                Employee: {context['employee_name']} ({context['employee_id']})
                Candidate: {context['candidate_name']}
                Position: {context['position']}
                Department: {context['department']}
                Submitted: {context['submission_date']}

                {"Resume attached" if context['resume_attached'] else "No resume attached"}

                View details: {context['dashboard_url']}
                        """.strip()
            
            subject = f"New Referral: {referral.fullname} for {context['position']}"
            
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email="Referral Submitted",
                to=hr_emails
            )
            
            msg.attach_alternative(html_content, "text/html")
            
            if hasattr(referral, 'resume') and referral.resume:
                try:
                    msg.attach_file(referral.resume.path)
                except Exception as e:
                    logger.warning(f"Could not attach resume: {str(e)}")
            
            msg.send()
            logger.info(f"Referral notification sent successfully for ID: {referral.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send referral email: {str(e)}")
            return False


    @staticmethod
    def send_status_update_notification(referral, updated_by_user=None, status_message=None):
        """
        Send status update notification email to the referring employee
        """
        try:
            referring_employee = referral.referred_by
            if not referring_employee or not referring_employee.email:
                logger.warning(f"No referring employee or email found for referral ID: {referral.id}")
                return False

            context = {
                'employee_name': referring_employee.get_full_name(),
                'candidate_name': referral.fullname,
                'position': referral.role if referral.role else 'General Application',
                'department': referral.department if referral.department else 'N/A',
                'new_status': referral.status,
                'new_status_display': referral.get_status_display(),
                'referral_id': referral.id,
                'submission_date': referral.created_at.strftime('%B %d, %Y'),
                'update_date': timezone.now().strftime('%B %d, %Y at %I:%M %p'),
                'updated_by': updated_by_user.get_full_name() if updated_by_user else 'HR Team',
                'status_message': status_message,
                'dashboard_url': f"your-domain/referrals/{referral.id}",
                'referral_bonus': referral.status == 'hired',
            }

            # Render HTML content
            html_content = render_to_string('emails/referral_status_update.html', context)

            # Plain text fallback
            status_messages = {
                'received': 'Your referral has been received and is under initial review.',
                'shortlisted': 'Great news! Your referral has been shortlisted for the next round.',
                'onhold': 'Your referral is currently on hold. We will notify you of any updates.',
                'hired': 'Congratulations! Your referral has been hired. Thank you for bringing excellent talent to our team.',
                'rejected': 'While your referral was not selected for this position, we appreciate your effort in helping us find great talent.'
            }

            status_description = status_messages.get(referral.status, 'Your referral status has been updated.')

            text_content = f"""
                Referral Status Update

                Hello {context['employee_name']},

                Your referral has been updated:

                Candidate: {context['candidate_name']}
                Position: {context['position']}
                Department: {context['department']}
                New Status: {context['new_status_display']}
                Updated: {context['update_date']}
                {"Updated by: " + context['updated_by'] if updated_by_user else ""}

                {status_description}

                {"Additional Notes: " + status_message if status_message else ""}

                View full details: {context['dashboard_url']}

                Thank you for your continued support in our referral program.

                Best regards,
                HR Team
                        """.strip()

            # Create email subject based on status
            subject_prefixes = {
                'received': '📨 Referral Received',
                'shortlisted': '🌟 Referral Shortlisted',
                'onhold': '⏸️ Referral On Hold',
                'hired': '🎉 Referral Hired',
                'rejected': '📋 Referral Update'
            }

            subject_prefix = subject_prefixes.get(referral.status, '📋 Referral Status Update')
            subject = f"{subject_prefix}: {referral.fullname} - {context['position']}"

            # Create and send email
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=["suhail.ts@terrificminds.com"]
            )

            msg.attach_alternative(html_content, "text/html")
            msg.send()

            logger.info(f"Status update notification sent successfully for referral ID: {referral.id} to {referring_employee.email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send status update email for referral ID {referral.id}: {str(e)}")
            return False