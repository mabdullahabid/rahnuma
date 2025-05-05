from ninja import Schema
from typing import List, Optional
from datetime import datetime
from pydantic import AnyHttpUrl, validator

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
    content_type: str  # e.g., "meeting_notes", "requirement_doc", "website"
    source_type: str  # e.g., "file", "url", "text"
    content: Optional[str] = None  # Text content or URL
    file: Optional[str] = None  # File path or URL
    extracted_text: Optional[str] = None
    analysis_summary: Optional[str] = None
    analyzed: bool
    uploaded_at: datetime

class ProjectReferenceResponseSchema(ProjectReferenceSchema):
    """Schema for returning reference details including file URL if applicable"""
    file_url: Optional[str] = None
    file_extension: Optional[str] = None

class PRDSchema(Schema):
    id: Optional[int] = None
    title: str
    client_name: str
    created_at: datetime
    updated_at: datetime
    project_overview: str
    reference_data_processed: bool
    ai_processing_status: str
    roles: List[RoleSchema] = []
    categories: List[CategorySchema] = []
    references: List[ProjectReferenceResponseSchema] = []

# Request and Response schemas
class PRDCreateSchema(Schema):
    title: str
    client_name: Optional[str] = ""
    project_overview: Optional[str] = ""

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

# Reference upload schemas
class ReferenceUrlsSchema(Schema):
    urls: List[str]
    
    @validator('urls')
    def validate_urls(cls, urls):
        if not urls:
            raise ValueError("At least one URL must be provided")
        
        # Basic URL format validation
        for url in urls:
            if not url.startswith(('http://', 'https://')):
                raise ValueError(f"Invalid URL format: {url}")
        
        return urls

class ReferenceUrlResponseSchema(Schema):
    id: int
    url: str
    name: str
    status: str

class ReferenceFileResponseSchema(Schema):
    id: int
    name: str
    file_url: str
    file_extension: str
    status: str