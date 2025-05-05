from ninja import Router
from ninja.pagination import paginate
from typing import List

from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import PRD, Role, Category, Feature, FeatureAcceptanceCriteria, ProjectReference
from .schema import (
    PRDSchema, PRDCreateSchema, PRDUpdateSchema, PRDListResponseSchema,
    RoleSchema, CategorySchema, FeatureSchema, FeatureAcceptanceCriteriaSchema,
    ProjectReferenceSchema
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
    return prd

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
    return prd

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
    
    return feature

# Project Reference Endpoints
@router.post("/{prd_id}/references", response=ProjectReferenceSchema)
def add_reference(request, prd_id: int, payload: ProjectReferenceSchema):
    prd = get_object_or_404(PRD, id=prd_id)
    reference = ProjectReference.objects.create(
        name=payload.name,
        content_type=payload.content_type,
        content=payload.content,
        prd=prd
    )
    return reference

@router.get("/{prd_id}/references", response=List[ProjectReferenceSchema])
def list_references(request, prd_id: int):
    return ProjectReference.objects.filter(prd_id=prd_id)