import random
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.utils import timezone
from faker import Faker
from posts.models import Blog, PostCategory

User = get_user_model()

# Seeder metadata tag to distinguish seeded data from production data
SEEDER_TAG = ""


class Command(BaseCommand):
    help = """
    Seed the database with dummy data for development.
    
    Usage:
        python manage.py seed_data              # Create seed data
        python manage.py seed_data --reset      # Reset and remove seeded data
    """

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset and remove all seeded data (only removes data marked as seeded)',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.reset_seeded_data()
        else:
            self.create_seeded_data()

    def reset_seeded_data(self):
        """Remove only seeded data, keep production data intact"""
        self.stdout.write(
            self.style.WARNING('⚠️  Resetting seeded data...\n')
        )

        try:
            # Delete seeded users (but keep superusers)
            seeded_users = User.objects.filter(email__contains=SEEDER_TAG)
            user_count = seeded_users.count()
            seeded_users.delete()
            
            # Delete seeded blogs
            seeded_blogs = Blog.objects.filter(title__contains=SEEDER_TAG)
            blog_count = seeded_blogs.count()
            seeded_blogs.delete()

            # Clean up seed marker from remaining blogs
            Blog.objects.filter(title__startswith=f"[{SEEDER_TAG}]").delete()

            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Reset complete!\n'
                    f'   • Deleted {user_count} seeded users\n'
                    f'   • Deleted {blog_count} seeded blogs'
                )
            )

        except Exception as e:
            raise CommandError(f'Error resetting seeded data: {str(e)}')

    def create_seeded_data(self):
        """Create seeded dummy data"""
        
        # Check if data already exists
        if self._data_already_seeded():
            self.stdout.write(
                self.style.WARNING(
                    '\n⚠️  Seeded data already exists!\n'
                    'Run with --reset flag to clear existing data:\n'
                    '   python manage.py seed_data --reset'
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS('🌱 Starting data seeding...\n')
        )

        try:
            # Create seeded data
            admin_users = self._create_admin_users()
            regular_users = self._create_regular_users()
            all_users = admin_users + regular_users
            
            blogs = self._create_blogs(all_users)

            # Print summary
            self._print_summary(admin_users, regular_users, blogs)

        except Exception as e:
            raise CommandError(f'Error seeding data: {str(e)}')

    def _data_already_seeded(self):
        """Check if seeded data already exists"""
        return User.objects.filter(email__contains=SEEDER_TAG).exists()

    def _create_admin_users(self):
        """Create admin/superuser accounts"""
        self.stdout.write('👤 Creating admin users...')
        
        admin_users = []
        admin_credentials = [
            {
                'username': 'admin',
                'email': f'admin-{SEEDER_TAG}@scribo.dev',
                'first_name': 'Admin',
                'last_name': 'User',
                'bio': 'Platform administrator',
                'job_title': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'username': 'demo_admin',
                'email': f'admin2-{SEEDER_TAG}@scribo.dev',
                'first_name': 'Demo',
                'last_name': 'Admin',
                'bio': 'Demo admin account for testing',
                'job_title': 'Demo Admin',
                'is_staff': True,
                'is_superuser': True,
            },
        ]

        for admin_data in admin_credentials:
            # Check if user with seeded email already exists
            if User.objects.filter(email=admin_data['email']).exists():
                user = User.objects.get(email=admin_data['email'])
                admin_users.append(user)
                self.stdout.write(
                    f'   ⚠️  Skipped (already exists): {admin_data["username"]}'
                )
                continue
            
            # Check if username already exists (skip if does)
            if User.objects.filter(username=admin_data['username']).exists():
                existing_user = User.objects.get(username=admin_data['username'])
                admin_users.append(existing_user)
                self.stdout.write(
                    f'   ⚠️  Using existing: {admin_data["username"]}'
                )
                continue
            
            password = 'TestPassword123@'  # Default test password
            user = User.objects.create_superuser(
                username=admin_data['username'],
                email=admin_data['email'],
                password=password,
                first_name=admin_data['first_name'],
                last_name=admin_data['last_name'],
            )
            user.bio = admin_data['bio']
            user.job_title = admin_data['job_title']
            
            # Assign random profile picture
            profile_pic = self._get_random_profile_picture()
            if profile_pic:
                user.profile_picture = profile_pic
            
            user.save()
            admin_users.append(user)
            
            self.stdout.write(
                f'   ✓ Created admin: {admin_data["username"]} '
                f'(email: {admin_data["email"]}, password: {password})'
            )

        return admin_users

    def _create_regular_users(self, count=8):
        """Create regular user accounts"""
        self.stdout.write(f'\n👥 Creating {count} regular users...')
        
        faker = Faker()
        regular_users = []
        social_platforms = ['facebook', 'youtube', 'instagram', 'twitter', 'linkedin']

        for i in range(count):
            first_name = faker.first_name()
            last_name = faker.last_name()
            username = faker.user_name()
            
            # Ensure unique username
            while User.objects.filter(username=username).exists():
                username = faker.user_name()

            email = f'user{i}-{SEEDER_TAG}@scribo.dev'
            password = 'TestPassword123@'  # Default test password

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )

            # Add bio
            user.bio = faker.text(max_nb_chars=120)
            
            # Add job title
            user.job_title = faker.job()
            
            # Add random profile picture
            profile_pic = self._get_random_profile_picture()
            if profile_pic:
                user.profile_picture = profile_pic
            
            # Add random social links (50% chance for each)
            if random.choice([True, False]):
                user.facebook = f'https://facebook.com/{username}'
            if random.choice([True, False]):
                user.youtube = f'https://youtube.com/@{username}'
            if random.choice([True, False]):
                user.instagram = f'https://instagram.com/{username}'
            if random.choice([True, False]):
                user.twitter = f'https://twitter.com/{username}'
            if random.choice([True, False]):
                user.linkedin = f'https://linkedin.com/in/{username}'

            user.save()
            regular_users.append(user)
            
            self.stdout.write(f'   ✓ Created user: {username}')

        return regular_users

    def _create_blogs(self, users, count=12):
        """Create blog posts"""
        self.stdout.write(f'\n📝 Creating {count} blog posts...')
        
        faker = Faker()
        blogs = []
        categories = [choice[0] for choice in PostCategory.choices]

        for i in range(count):
            author = random.choice(users)
            category = random.choice(categories)
            
            # Generate title with seeder tag
            title = f"[{SEEDER_TAG}] {faker.sentence(nb_words=6)}"
            
            # Generate realistic content
            content = '\n\n'.join([faker.paragraph(nb_sentences=8) for _ in range(4)])
            
            # Random publish status (70% published, 30% draft)
            is_draft = random.random() > 0.7
            
            # Create blog
            blog = Blog(
                title=title,
                content=content,
                author=author,
                category=category,
                is_draft=is_draft,
            )
            
            # Set published date if not draft
            if not is_draft:
                # Random date within last 60 days
                days_ago = random.randint(1, 60)
                blog.published_date = timezone.now() - timezone.timedelta(days=days_ago)
            
            # Set created and updated dates
            blog.created_at = timezone.now() - timezone.timedelta(
                days=random.randint(1, 60)
            )
            
            # Add featured image
            featured_image = self._get_random_blog_image()
            if featured_image:
                blog.featured_image = featured_image
            
            blog.save()
            blogs.append(blog)
            
            status = '📌 DRAFT' if is_draft else '✅ PUBLISHED'
            self.stdout.write(
                f'   ✓ Created blog: "{title[:50]}..." '
                f'by {author.username} {status}'
            )

        return blogs

    def _get_random_profile_picture(self):
        """Get random profile picture from seed_images/avatar"""
        try:
            seed_avatar_path = Path(__file__).resolve().parent.parent.parent.parent / 'media' / 'seed_images' / 'avatar'
            
            if not seed_avatar_path.exists():
                return None
            
            avatar_files = list(seed_avatar_path.glob('*'))
            if not avatar_files:
                return None
            
            random_avatar = random.choice(avatar_files)
            relative_path = f'seed_images/avatar/{random_avatar.name}'
            
            return relative_path
        except Exception:
            return None

    def _get_random_blog_image(self):
        """Get random blog featured image from seed_images/blogs"""
        try:
            seed_blogs_path = Path(__file__).resolve().parent.parent.parent.parent / 'media' / 'seed_images' / 'blogs'
            
            if not seed_blogs_path.exists():
                return None
            
            blog_files = list(seed_blogs_path.glob('*'))
            if not blog_files:
                return None
            
            random_blog_image = random.choice(blog_files)
            relative_path = f'seed_images/blogs/{random_blog_image.name}'
            
            return relative_path
        except Exception:
            return None

    def _print_summary(self, admin_users, regular_users, blogs):
        """Print a summary of seeded data"""
        self.stdout.write('\n' + '=' * 70)
        self.stdout.write(self.style.SUCCESS('✅ SEEDING COMPLETE!'))
        self.stdout.write('=' * 70 + '\n')

        # Users summary
        self.stdout.write(self.style.SUCCESS('👤 ADMIN ACCOUNTS:'))
        for user in admin_users:
            self.stdout.write(
                f'   • Username: {user.username}\n'
                f'     Email: {user.email}\n'
                f'     Password: TestPassword123@\n'
            )

        self.stdout.write(self.style.SUCCESS('👥 REGULAR USERS:'))
        self.stdout.write(f'   • Total created: {len(regular_users)}\n')

        # Blogs summary
        self.stdout.write(self.style.SUCCESS('📝 BLOGS:'))
        published = sum(1 for b in blogs if not b.is_draft)
        drafts = len(blogs) - published
        self.stdout.write(
            f'   • Total created: {len(blogs)}\n'
            f'   • Published: {published}\n'
            f'   • Drafts: {drafts}\n'
        )

        # Statistics
        self.stdout.write(self.style.SUCCESS('📊 STATISTICS:'))
        self.stdout.write(
            f'   • Total Users: {len(admin_users) + len(regular_users)}\n'
            f'   • Total Blogs: {len(blogs)}\n'
        )

        # Reset instructions
        self.stdout.write(self.style.WARNING('🔄 TO RESET SEEDED DATA:'))
        self.stdout.write('   python manage.py seed_data --reset\n')

        self.stdout.write(self.style.WARNING('⚠️  IMPORTANT:'))
        self.stdout.write('   • All seeded data is marked with [SEEDED_DATA_2026] tag\n')
        self.stdout.write('   • Reset only removes seeded data, production data is safe\n')
        self.stdout.write('   • Default password for all accounts: TestPassword123@\n')
        self.stdout.write('=' * 70)
