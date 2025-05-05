from django.contrib import admin
from .models import (
    PRD, 
    Role, 
    Category, 
    Feature, 
    FeatureAcceptanceCriteria, 
    ProjectReference
)

@admin.register(PRD)
class PRDAdmin(admin.ModelAdmin):
    list_display = ('title', 'client_name', 'created_at', 'created_by')
    search_fields = ('title', 'client_name')
    list_filter = ('created_at', 'ai_processing_status')

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'prd')
    search_fields = ('name',)
    list_filter = ('prd',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'prd')
    search_fields = ('name',)
    list_filter = ('prd',)

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'priority', 'estimate_hours')
    search_fields = ('title',)
    list_filter = ('priority', 'category')

@admin.register(FeatureAcceptanceCriteria)
class FeatureAcceptanceCriteriaAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'feature')
    search_fields = ('description',)
    list_filter = ('feature',)

@admin.register(ProjectReference)
class ProjectReferenceAdmin(admin.ModelAdmin):
    list_display = ('name', 'content_type', 'source_type', 'prd', 'uploaded_at', 'analyzed')
    search_fields = ('name',)
    list_filter = ('content_type', 'source_type', 'analyzed', 'uploaded_at')
