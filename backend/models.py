# ============================================================================
# MODELS.PY - Modelos de dados para o MongoDB
# ============================================================================
# Este arquivo define as estruturas de dados (schemas) que serão usadas
# na aplicação Conectando para validar e organizar os dados.
# ============================================================================

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid


# ============================================================================
# MODELOS DE USUÁRIO
# ============================================================================

class UserBase(BaseModel):
    """
    Modelo base do usuário com campos comuns.
    Usado como base para outros modelos de usuário.
    """
    email: EmailStr  # Email validado automaticamente
    name: str
    phone: Optional[str] = None
    cpf: Optional[str] = None
    address: Optional[str] = None
    birthdate: Optional[str] = None
    role: str = "user"  # "user" ou "organizer"


class UserCreate(UserBase):
    """
    Modelo para criação de novo usuário (signup).
    Inclui a senha que será hasheada antes de salvar.
    """
    password: str


class UserLogin(BaseModel):
    """
    Modelo para login de usuário.
    Apenas email e senha são necessários.
    """
    email: EmailStr
    password: str


class User(UserBase):
    """
    Modelo completo do usuário armazenado no banco.
    Inclui ID e senha hasheada.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "usuario@exemplo.com",
                "name": "João Silva",
                "phone": "(11) 98765-4321",
                "role": "user"
            }
        }


class UserResponse(UserBase):
    """
    Modelo de resposta do usuário.
    Não inclui a senha (segurança).
    """
    id: str
    created_at: datetime


# ============================================================================
# MODELOS DE SERVIÇO
# ============================================================================

class ServiceBase(BaseModel):
    """
    Modelo base do serviço com campos comuns.
    """
    name: str
    type: str  # Tipo do serviço: Saúde, Educação, etc.
    description: str
    photo: Optional[str] = None  # URL da foto
    location: Optional[str] = "Local não especificado"
    availability_days: List[str] = []  # Dias da semana disponíveis
    time_slots: List[str] = []  # Horários disponíveis
    active: bool = True


class ServiceCreate(ServiceBase):
    """
    Modelo para criação de novo serviço.
    """
    pass


class Service(ServiceBase):
    """
    Modelo completo do serviço armazenado no banco.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    organizer_id: str  # ID do organizador que criou o serviço
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Corte de Cabelo Gratuito",
                "type": "Beleza",
                "description": "Corte de cabelo para pessoas em situação de vulnerabilidade",
                "organizer_id": "org-123",
                "active": True
            }
        }


# ============================================================================
# MODELOS DE AGENDAMENTO
# ============================================================================

class BookingBase(BaseModel):
    """
    Modelo base do agendamento.
    """
    service_id: str  # ID do serviço
    date: str  # Data do agendamento (formato: YYYY-MM-DD)
    time: str  # Horário do agendamento (formato: HH:MM)
    notes: Optional[str] = ""  # Observações do usuário


class BookingCreate(BookingBase):
    """
    Modelo para criação de novo agendamento.
    """
    pass


class Booking(BookingBase):
    """
    Modelo completo do agendamento armazenado no banco.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # ID do usuário que fez o agendamento
    status: str = "pending"  # pending, confirmed, completed, cancelled
    rating: Optional[int] = None  # Avaliação de 1 a 5
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "user-123",
                "service_id": "service-456",
                "date": "2025-10-20",
                "time": "10:00",
                "status": "pending"
            }
        }


class BookingUpdate(BaseModel):
    """
    Modelo para atualização de agendamento.
    Todos os campos são opcionais.
    """
    status: Optional[str] = None
    rating: Optional[int] = None
    notes: Optional[str] = None


# ============================================================================
# MODELO DE TOKEN JWT
# ============================================================================

class Token(BaseModel):
    """
    Modelo de resposta do token de autenticação.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse  # Informações do usuário


# ============================================================================
# MODELOS DE RESPOSTA COM POPULAÇÃO DE DADOS
# ============================================================================

class BookingWithDetails(Booking):
    """
    Agendamento com detalhes do serviço e usuário.
    Usado para respostas mais completas.
    """
    service: Optional[Service] = None
    user: Optional[UserResponse] = None
