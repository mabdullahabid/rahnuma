from ninja import Router, UploadedFile, File
from ninja.pagination import paginate
from ninja.errors import HttpError
from typing import List, Dict, Any

from django.shortcuts import get_object_or_404
from django.db import transaction
from django.conf import settings
from django.core.files.storage import default_storage

import os
import uuid
import requests
from bs4 import BeautifulSoup
import PyPDF2
import docx

from .models import PRD, Role, Category, Feature, FeatureAcceptanceCriteria, ProjectReference
from .schema import (
    PRDSchema, PRDCreateSchema, PRDUpdateSchema, PRDListResponseSchema,
    RoleSchema, CategorySchema, FeatureSchema, FeatureAcceptanceCriteriaSchema,
    ProjectReferenceSchema, ProjectReferenceResponseSchema, ReferenceUrlsSchema,
    ReferenceUrlResponseSchema, ReferenceFileResponseSchema
)
from auth.auth import JWTAuth

router = Router(auth=JWTAuth())

# PRD Endpoints
@router.get("/", response=List[PRDListResponseSchema])
@paginate
def list_prds(request):
    return PRD.objects.all().order_by("-created_at")

@router.post("/", response=PRDSchema)
@transaction.atomic
def create_prd(request, payload: PRDCreateSchema):
    prd = PRD.objects.create(
        title=payload.title,
        client_name=payload.client_name,
        project_overview=payload.project_overview,
        created_by=request.auth
    )
    return prd

@router.get("/{prd_id}", response=PRDSchema)
def get_prd(request, prd_id: int):
    prd = get_object_or_404(PRD, id=prd_id)
    
    # Create a serializable copy of the PRD data
    prd_data = {
        "id": prd.id,
        "title": prd.title,
        "client_name": prd.client_name,
        "created_at": prd.created_at,
        "updated_at": prd.updated_at,
        "project_overview": prd.project_overview,
        "reference_data_processed": prd.reference_data_processed,
        "ai_processing_status": prd.ai_processing_status,
        "roles": list(prd.roles.all().values()),
        "categories": [],
        "references": []
    }
    
    # Process categories and features
    for category in prd.categories.all():
        category_data = {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "features": []
        }
        
        # Process features - ensure category is a string not an object
        for feature in category.features.all():
            feature_data = {
                "id": feature.id,
                "title": feature.title,
                "description": feature.description,
                "category": category.name,  # Convert Category object to string
                "priority": feature.priority,
                "estimate_hours": feature.estimate_hours,
                "acceptance_criteria": list(feature.acceptance_criteria.all().values("id", "description"))
            }
            category_data["features"].append(feature_data)
            
        prd_data["categories"].append(category_data)
    
    # Process references
    for ref in prd.references.all():
        ref_data = {
            "id": ref.id,
            "name": ref.name,
            "content_type": ref.content_type,
            "source_type": ref.source_type,
            "content": ref.content,
            "extracted_text": ref.extracted_text,
            "analysis_summary": ref.analysis_summary,
            "analyzed": ref.analyzed,
            "uploaded_at": ref.uploaded_at,
            "file_url": ref.file.url if ref.file else None,
            "file_extension": ref.file_extension() if ref.file else None
        }
        prd_data["references"].append(ref_data)
    
    return prd_data

@router.put("/{prd_id}", response=PRDSchema)
@transaction.atomic
def update_prd(request, prd_id: int, payload: PRDUpdateSchema):
    prd = get_object_or_404(PRD, id=prd_id)
    
    if payload.title:
        prd.title = payload.title
    if payload.client_name:
        prd.client_name = payload.client_name
    if payload.project_overview:
        prd.project_overview = payload.project_overview
    
    prd.save()
    
    # Create a serializable copy of the PRD data using the same approach as in get_prd
    prd_data = {
        "id": prd.id,
        "title": prd.title,
        "client_name": prd.client_name,
        "created_at": prd.created_at,
        "updated_at": prd.updated_at,
        "project_overview": prd.project_overview,
        "reference_data_processed": prd.reference_data_processed,
        "ai_processing_status": prd.ai_processing_status,
        "roles": list(prd.roles.all().values()),
        "categories": [],
        "references": []
    }
    
    # Process categories and features
    for category in prd.categories.all():
        category_data = {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "features": []
        }
        
        # Process features - ensure category is a string not an object
        for feature in category.features.all():
            feature_data = {
                "id": feature.id,
                "title": feature.title,
                "description": feature.description,
                "category": category.name,  # Convert Category object to string
                "priority": feature.priority,
                "estimate_hours": feature.estimate_hours,
                "acceptance_criteria": list(feature.acceptance_criteria.all().values("id", "description"))
            }
            category_data["features"].append(feature_data)
            
        prd_data["categories"].append(category_data)
    
    # Process references
    for ref in prd.references.all():
        ref_data = {
            "id": ref.id,
            "name": ref.name,
            "content_type": ref.content_type,
            "source_type": ref.source_type,
            "content": ref.content,
            "extracted_text": ref.extracted_text,
            "analysis_summary": ref.analysis_summary,
            "analyzed": ref.analyzed,
            "uploaded_at": ref.uploaded_at,
            "file_url": ref.file.url if ref.file else None,
            "file_extension": ref.file_extension() if ref.file else None
        }
        prd_data["references"].append(ref_data)
    
    return prd_data

@router.delete("/{prd_id}")
def delete_prd(request, prd_id: int):
    prd = get_object_or_404(PRD, id=prd_id)
    prd.delete()
    return {"success": True}

# Role Endpoints
@router.post("/{prd_id}/roles", response=RoleSchema)
def add_role(request, prd_id: int, payload: RoleSchema):
    prd = get_object_or_404(PRD, id=prd_id)
    role = Role.objects.create(
        name=payload.name,
        description=payload.description,
        prd=prd
    )
    return role

@router.get("/{prd_id}/roles", response=List[RoleSchema])
def list_roles(request, prd_id: int):
    return Role.objects.filter(prd_id=prd_id)

@router.put("/{prd_id}/roles/{role_id}", response=RoleSchema)
def update_role(request, prd_id: int, role_id: int, payload: RoleSchema):
    role = get_object_or_404(Role, id=role_id, prd_id=prd_id)
    role.name = payload.name
    role.description = payload.description
    role.save()
    return role

@router.delete("/{prd_id}/roles/{role_id}")
def delete_role(request, prd_id: int, role_id: int):
    role = get_object_or_404(Role, id=role_id, prd_id=prd_id)
    role.delete()
    return {"success": True}

# Category Endpoints
@router.post("/{prd_id}/categories", response=CategorySchema)
def add_category(request, prd_id: int, payload: CategorySchema):
    prd = get_object_or_404(PRD, id=prd_id)
    category = Category.objects.create(
        name=payload.name,
        description=payload.description,
        prd=prd
    )
    return category

@router.get("/{prd_id}/categories", response=List[CategorySchema])
def list_categories(request, prd_id: int):
    return Category.objects.filter(prd_id=prd_id)

@router.put("/{prd_id}/categories/{category_id}", response=CategorySchema)
def update_category(request, prd_id: int, category_id: int, payload: CategorySchema):
    category = get_object_or_404(Category, id=category_id, prd_id=prd_id)
    category.name = payload.name
    category.description = payload.description
    category.save()
    return category

@router.delete("/{prd_id}/categories/{category_id}")
def delete_category(request, prd_id: int, category_id: int):
    category = get_object_or_404(Category, id=category_id, prd_id=prd_id)
    category.delete()
    return {"success": True}

# Feature Endpoints
@router.post("/{prd_id}/categories/{category_id}/features", response=FeatureSchema)
@transaction.atomic
def add_feature(request, prd_id: int, category_id: int, payload: FeatureSchema):
    category = get_object_or_404(Category, id=category_id, prd_id=prd_id)
    
    feature = Feature.objects.create(
        title=payload.title,
        description=payload.description,
        category=category,
        priority=payload.priority,
        estimate_hours=payload.estimate_hours
    )
    
    # Create acceptance criteria for the feature
    for ac in payload.acceptance_criteria:
        FeatureAcceptanceCriteria.objects.create(
            description=ac.description,
            feature=feature
        )
    
    # Create a serializable response that converts category to string
    feature_data = {
        "id": feature.id,
        "title": feature.title,
        "description": feature.description,
        "category": category.name,  # Convert Category object to string
        "priority": feature.priority,
        "estimate_hours": feature.estimate_hours,
        "acceptance_criteria": []
    }
    
    # Add acceptance criteria to response
    for ac in feature.acceptance_criteria.all():
        feature_data["acceptance_criteria"].append({
            "id": ac.id,
            "description": ac.description
        })
    
    return feature_data

@router.get("/{prd_id}/categories/{category_id}/features", response=List[FeatureSchema])
def list_features(request, prd_id: int, category_id: int):
    """Get all features for a specific category"""
    category = get_object_or_404(Category, id=category_id, prd_id=prd_id)
    
    # Get all features for this category
    features = Feature.objects.filter(category=category)
    
    # Create a serializable response with category as string
    feature_list = []
    for feature in features:
        feature_data = {
            "id": feature.id,
            "title": feature.title,
            "description": feature.description,
            "category": category.name,  # Convert Category object to string
            "priority": feature.priority,
            "estimate_hours": feature.estimate_hours,
            "acceptance_criteria": []
        }
        
        # Add acceptance criteria to response
        for ac in feature.acceptance_criteria.all():
            feature_data["acceptance_criteria"].append({
                "id": ac.id,
                "description": ac.description
            })
        
        feature_list.append(feature_data)
    
    return feature_list

@router.put("/{prd_id}/categories/{category_id}/features/{feature_id}", response=FeatureSchema)
@transaction.atomic
def update_feature(request, prd_id: int, category_id: int, feature_id: int, payload: FeatureSchema):
    """Update a feature"""
    category = get_object_or_404(Category, id=category_id, prd_id=prd_id)
    feature = get_object_or_404(Feature, id=feature_id, category=category)
    
    # Update feature fields
    feature.title = payload.title
    feature.description = payload.description
    feature.priority = payload.priority
    feature.estimate_hours = payload.estimate_hours
    feature.save()
    
    # Update acceptance criteria
    # Delete existing criteria
    FeatureAcceptanceCriteria.objects.filter(feature=feature).delete()
    
    # Create new acceptance criteria
    for ac in payload.acceptance_criteria:
        FeatureAcceptanceCriteria.objects.create(
            description=ac.description,
            feature=feature
        )
    
    # Create a serializable response that converts category to string
    feature_data = {
        "id": feature.id,
        "title": feature.title,
        "description": feature.description,
        "category": category.name,  # Convert Category object to string
        "priority": feature.priority,
        "estimate_hours": feature.estimate_hours,
        "acceptance_criteria": []
    }
    
    # Add acceptance criteria to response
    for ac in feature.acceptance_criteria.all():
        feature_data["acceptance_criteria"].append({
            "id": ac.id,
            "description": ac.description
        })
    
    return feature_data

@router.delete("/{prd_id}/categories/{category_id}/features/{feature_id}")
def delete_feature(request, prd_id: int, category_id: int, feature_id: int):
    """Delete a feature"""
    category = get_object_or_404(Category, id=category_id, prd_id=prd_id)
    feature = get_object_or_404(Feature, id=feature_id, category=category)
    feature.delete()
    return {"success": True}

# Project Reference Endpoints
@router.post("/{prd_id}/references", response=ProjectReferenceResponseSchema)
def add_reference(request, prd_id: int, payload: ProjectReferenceSchema):
    prd = get_object_or_404(PRD, id=prd_id)
    reference = ProjectReference.objects.create(
        name=payload.name,
        content_type=payload.content_type,
        source_type=payload.source_type,
        content=payload.content,
        prd=prd
    )
    return reference

@router.get("/{prd_id}/references", response=List[ProjectReferenceResponseSchema])
def list_references(request, prd_id: int):
    references = ProjectReference.objects.filter(prd_id=prd_id)
    
    # Add file URLs to the response
    response_references = []
    for ref in references:
        ref_dict = {
            "id": ref.id,
            "name": ref.name,
            "content_type": ref.content_type,
            "source_type": ref.source_type,
            "content": ref.content,
            "extracted_text": ref.extracted_text,
            "analysis_summary": ref.analysis_summary,
            "analyzed": ref.analyzed,
            "uploaded_at": ref.uploaded_at,
            "file_url": ref.file.url if ref.file else None,
            "file_extension": ref.file_extension() if ref.file else None
        }
        response_references.append(ref_dict)
    
    return response_references

@router.delete("/{prd_id}/references/{reference_id}")
def delete_reference(request, prd_id: int, reference_id: int):
    """Delete a project reference"""
    reference = get_object_or_404(ProjectReference, id=reference_id, prd_id=prd_id)
    
    # If it's a file reference, delete the file too
    if reference.file:
        if default_storage.exists(reference.file.name):
            default_storage.delete(reference.file.name)
    
    # Delete the reference from the database
    reference.delete()
    
    return {"success": True}

# Function to extract text from different file types
def extract_text_from_file(file_path: str) -> str:
    """Extract text content from different file types"""
    file_ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_ext == '.pdf':
            # Process PDF
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text
        
        elif file_ext in ['.doc', '.docx']:
            # Process Word doc
            doc = docx.Document(file_path)
            return "\n".join([para.text for para in doc.paragraphs])
        
        elif file_ext in ['.txt', '.md', '.csv']:
            # Process text files
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
                return file.read()
        
        else:
            # Unsupported file format
            return f"File format {file_ext} not supported for text extraction."
    
    except Exception as e:
        return f"Error extracting text: {str(e)}"

# New File Upload Endpoint
@router.post("/{prd_id}/upload-references", response=List[ReferenceFileResponseSchema])
@transaction.atomic
def upload_reference_files(request, prd_id: int, files: List[UploadedFile] = File(...)):
    """Upload multiple reference files for a PRD"""
    prd = get_object_or_404(PRD, id=prd_id)
    response = []
    
    for file in files:
        # Generate a unique filename
        file_ext = os.path.splitext(file.name)[1].lower()
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        
        # Determine content type from file extension
        content_type = "other"
        if file_ext in ['.doc', '.docx', '.pdf', '.txt']:
            content_type = "requirement_doc"
        elif file_ext in ['.md']:
            content_type = "meeting_notes"
        elif file_ext in ['.csv', '.xlsx', '.xls']:
            content_type = "market_research"
        
        # Create the reference record
        reference = ProjectReference.objects.create(
            name=file.name,
            content_type=content_type,
            source_type="file",
            prd=prd
        )
        
        # Save the file
        file_path = os.path.join('prd_files', str(prd.id), unique_filename)
        file_path = default_storage.save(file_path, file)
        reference.file.name = file_path
        
        # Extract text from the file
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        extracted_text = extract_text_from_file(full_path)
        reference.extracted_text = extracted_text
        
        # Save changes
        reference.save()
        
        # Add to response
        response.append({
            "id": reference.id,
            "name": file.name,
            "file_url": reference.file.url,
            "file_extension": reference.file_extension(),
            "status": "uploaded"
        })
    
    # Update the PRD's AI processing status
    prd.ai_processing_status = "references_added"
    prd.save()
    
    return response

# URL Reference Processing
@router.post("/{prd_id}/add-reference-urls", response=List[ReferenceUrlResponseSchema])
@transaction.atomic
def add_reference_urls(request, prd_id: int, payload: ReferenceUrlsSchema):
    """Add reference URLs to a PRD"""
    prd = get_object_or_404(PRD, id=prd_id)
    response = []
    
    for url in payload.urls:
        try:
            # Fetch the web page
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            page = requests.get(url, headers=headers, timeout=10)
            page.raise_for_status()
            
            # Parse the HTML
            soup = BeautifulSoup(page.content, 'html.parser')
            
            # Try to get the title
            title_tag = soup.find('title')
            title = title_tag.text if title_tag else url
            
            # Extract text content and clean it
            body_text = soup.get_text(separator=' ', strip=True)
            
            # Create the reference
            reference = ProjectReference.objects.create(
                name=title[:200],  # Limit name to 200 chars
                content_type="website",
                source_type="url",
                content=url,
                extracted_text=body_text[:100000],  # Limit text size
                prd=prd
            )
            
            response.append({
                "id": reference.id,
                "name": title[:200],
                "url": url,
                "status": "processed"
            })
            
        except requests.RequestException as e:
            # Create a failed reference
            reference = ProjectReference.objects.create(
                name=f"Failed URL: {url[:190]}",  # Limit name to 200 chars
                content_type="website",
                source_type="url",
                content=url,
                extracted_text=f"Failed to process URL: {str(e)}",
                prd=prd
            )
            
            response.append({
                "id": reference.id,
                "name": f"Failed URL: {url[:190]}",
                "url": url,
                "status": "failed"
            })
    
    # Update the PRD's AI processing status
    prd.ai_processing_status = "references_added"
    prd.save()
    
    return response

# Add a new endpoint to start processing the references with an LLM
@router.post("/{prd_id}/analyze-references")
@transaction.atomic
def analyze_references(request, prd_id: int):
    """Analyze all references with AI and build a knowledge base"""
    prd = get_object_or_404(PRD, id=prd_id)
    
    # Update the PRD status to indicate processing has started
    prd.ai_processing_status = "processing"
    prd.save()
    
    try:
        # TODO: This would typically be done in a background task
        # For now, we'll return a placeholder response
        
        # Set a success response (in a real application, this would be done by the background task)
        prd.ai_processing_status = "completed"
        prd.reference_data_processed = True
        prd.save()
        
        return {"status": "Processing started", "message": "References are being analyzed in the background"}
    
    except Exception as e:
        # Mark as failed if there's an error
        prd.ai_processing_status = "failed"
        prd.save()
        raise HttpError(500, f"Failed to process references: {str(e)}")