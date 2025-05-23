# Generated by Django 5.2 on 2025-05-05 20:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Feature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('priority', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')], default='medium', max_length=20)),
                ('estimate_hours', models.FloatField(default=0)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='features', to='prd.category')),
            ],
        ),
        migrations.CreateModel(
            name='FeatureAcceptanceCriteria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('feature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='acceptance_criteria', to='prd.feature')),
            ],
        ),
        migrations.CreateModel(
            name='PRD',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('client_name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('project_overview', models.TextField()),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_prds', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='category',
            name='prd',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='categories', to='prd.prd'),
        ),
        migrations.CreateModel(
            name='ProjectReference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('content_type', models.CharField(choices=[('meeting_notes', 'Meeting Notes'), ('requirement_doc', 'Requirement Document'), ('sample_app', 'Sample App'), ('similar_app', 'Similar App'), ('other', 'Other')], max_length=50)),
                ('content', models.TextField()),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('prd', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='references', to='prd.prd')),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('prd', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='roles', to='prd.prd')),
            ],
        ),
    ]
