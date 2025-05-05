from django.db import models
from django.contrib.auth.models import User
import os
import uuid


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


def reference_file_path(instance, filename):
    """Generate a unique file path for uploaded reference files"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('reference_files', str(instance.prd.id), filename)


class ProjectReference(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('meeting_notes', 'Meeting Notes'),
        ('requirement_doc', 'Requirement Document'),
        ('sample_app', 'Sample App'),
        ('similar_app', 'Similar App'),
        ('website', 'Website'),
        ('article', 'Article'),
        ('api_doc', 'API Documentation'),
        ('design_doc', 'Design Document'),
        ('user_feedback', 'User Feedback'),
        ('market_research', 'Market Research'),
        ('other', 'Other'),
    ]
    
    SOURCE_TYPE_CHOICES = [
        ('file', 'File Upload'),
        ('url', 'External URL'),
        ('text', 'Text Input'),
    ]
    
    name = models.CharField(max_length=200)
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPE_CHOICES, default='text')
    content = models.TextField(blank=True)  # For text content or URL
    file = models.FileField(upload_to=reference_file_path, blank=True, null=True)  # For file uploads
    extracted_text = models.TextField(blank=True)  # Extracted text from files or URLs
    analyzed = models.BooleanField(default=False)  # Whether this reference has been analyzed by AI
    analysis_summary = models.TextField(blank=True)  # AI-generated summary
    uploaded_at = models.DateTimeField(auto_now_add=True)
    prd = models.ForeignKey('PRD', on_delete=models.CASCADE, related_name='references')

    def __str__(self):
        return self.name
    
    def file_extension(self):
        if self.file:
            return os.path.splitext(self.file.name)[1].lower()
        return None


class PRD(models.Model):
    title = models.CharField(max_length=200)
    client_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    project_overview = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_prds')
    
    # New fields for AI processing state
    reference_data_processed = models.BooleanField(default=False)
    ai_processing_status = models.CharField(max_length=50, default='not_started')
    combined_knowledge_base = models.TextField(blank=True)  # Processed data from all references
    
    def __str__(self):
        return self.title
