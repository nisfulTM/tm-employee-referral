# apps/referral_app/management/commands/seed_users.py
import csv
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed users from a CSV file (without duplicating existing users)'

    def handle(self, *args, **kwargs):
        csv_file =  'apps/referral_app/files/users.csv'

        created, skipped = 0, 0

        with open(csv_file, newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                username = row['username'].strip()
                email = row['email'].strip()

                if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
                    self.stdout.write(self.style.WARNING(f"Skipped existing user: {username}"))
                    skipped += 1
                    continue

                user = User(
                    username=username,
                    email=email,
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    emp_code=row['emp_code'],
                    is_staff=row['is_staff'],
                    type=row['type'].lower() if 'type' in row else 'employee',
                )
                user.set_password(row['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user: {username}"))
                created += 1

        self.stdout.write(self.style.SUCCESS(f"\nDone. Created: {created}, Skipped: {skipped}"))
