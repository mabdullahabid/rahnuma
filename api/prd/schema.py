from ninja import Schema
from typing import List, Optional
from datetime import datetime

class RoleSchema(Schema):
    id: Optional[int] = None
    name: str
    description: str

class FeatureAcceptanceCriteriaSchema(Schema):
    id: Optional[int] = None
    description: str

class FeatureSchema(Schema):
    id: Optional[int] = None
    title: str
    description: str
    category: str
    priority: str
    estimate_hours: float = 0
    acceptance_criteria: List[FeatureAcceptanceCriteriaSchema] = []

class CategorySchema(Schema):
    id: Optional[int] = None
    name: str
    description: str
    features: List[FeatureSchema] = []

class ProjectReferenceSchema(Schema):
    id: Optional[int] = None
    name: str
    content_type: str  # e.g., "meeting_notes", "requirement_doc", "sample_app"
    content: str  # This could be text content or a reference to a file
    uploaded_at: datetime

class PRDSchema(Schema):
    id: Optional[int] = None
    title: str
    client_name: str
    created_at: datetime
    updated_at: datetime
    project_overview: str
    roles: List[RoleSchema] = []
    categories: List[CategorySchema] = []
    references: List[ProjectReferenceSchema] = []

# Request and Response schemas
class PRDCreateSchema(Schema):
    title: str
    client_name: str
    project_overview: str

class PRDUpdateSchema(Schema):
    title: Optional[str] = None
    client_name: Optional[str] = None
    project_overview: Optional[str] = None

class PRDListResponseSchema(Schema):
    id: int
    title: str
    client_name: str
    created_at: datetime
    updated_at: datetime