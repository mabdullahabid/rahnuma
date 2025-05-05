from django.db import models
from django.contrib.auth.models import User


class Role(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    prd = models.ForeignKey('PRD', on_delete=models.CASCADE, related_name='roles')

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    prd = models.ForeignKey('PRD', on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name


class Feature(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='features')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    estimate_hours = models.FloatField(default=0)

    def __str__(self):
        return self.title


class FeatureAcceptanceCriteria(models.Model):
    description = models.TextField()
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE, related_name='acceptance_criteria')

    def __str__(self):
        return f"Criteria for {self.feature.title}"


class ProjectReference(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('meeting_notes', 'Meeting Notes'),
        ('requirement_doc', 'Requirement Document'),
        ('sample_app', 'Sample App'),
        ('similar_app', 'Similar App'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    content = models.TextField()  # Can store text content or file path
    uploaded_at = models.DateTimeField(auto_now_add=True)
    prd = models.ForeignKey('PRD', on_delete=models.CASCADE, related_name='references')

    def __str__(self):
        return self.name


class PRD(models.Model):
    title = models.CharField(max_length=200)
    client_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    project_overview = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_prds')
    
    def __str__(self):
        return self.title
