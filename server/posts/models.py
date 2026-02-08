from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils import timezone



class PostCategory(models.TextChoices):
    FRONTEND = 'frontend', 'Frontend'
    BACKEND = 'backend', 'Backend'
    FULLSTACK = 'fullstack', 'Fullstack'
    DESIGN = 'design', 'Design'
    BLOCKCHAIN = 'blockchain', 'Blockchain'
        
class Blog(models.Model):

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="blogs", null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_date = models.DateTimeField(blank=True, null=True)
    is_draft = models.BooleanField(default=True)
    category = models.CharField(max_length=50, choices=PostCategory.choices, default=PostCategory.BACKEND)
    featured_image = models.ImageField(upload_to="blog_images", blank=True, null=True)

    class Meta:
        ordering = ["-published_date"]
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['published_date']),
        ]


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        base_slug = slugify(self.title)
        slug = base_slug
        num = 1
        while Blog.objects.filter(slug=slug).exists():
            slug = f'{base_slug}-{num}'
            num += 1
        self.slug = slug


        if not self.is_draft and self.published_date is None:
            self.published_date = timezone.now()

        super().save(*args, **kwargs)