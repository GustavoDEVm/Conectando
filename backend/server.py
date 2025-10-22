# ============================================================================
# SERVER.PY - Servidor principal da API Conectando
# ============================================================================
# Este é o arquivo principal do backend que define todas as rotas da API
# para gerenciar usuários, serviços e agendamentos.
# ============================================================================

from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from models import (
    User, UserCreate, UserLogin, UserResponse,
    Service, ServiceCreate,
    Booking, BookingCreate, BookingUpdate, BookingWithDetails,
    Token
)
from auth import hash_password, verify_password, create_access_token, get_user_from_token

# ============================================================================
# CONFIGURAÇÃO INICIAL
# ============================================================================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Conexão com MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Criar app FastAPI
app = FastAPI(title="Conectando API", version="1.0.0")

# Criar router com prefixo /api
api_router = APIRouter(prefix="/api")

# Segurança JWT
security = HTTPBearer()


# ============================================================================
# FUNÇÕES AUXILIARES
# ============================================================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Obtém o usuário atual a partir do token JWT.
    Usado como dependência em rotas protegidas.
    """
    token = credentials.credentials
    user_email = get_user_from_token(token)
    
    if not user_email:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    
    user = await db.users.find_one({"email": user_email})
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return User(**user)


# ============================================================================
# ROTAS DE AUTENTICAÇÃO
# ============================================================================

@api_router.post("/auth/register", response_model=Token, tags=["Autenticação"])
async def register(user_data: UserCreate):
    """
    Registra um novo usuário no sistema.
    
    - **email**: Email único do usuário
    - **password**: Senha (será hasheada)
    - **name**: Nome completo
    - **role**: "user" ou "organizer" (padrão: "user")
    """
    # Verifica se o email já existe
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Cria o novo usuário com senha hasheada
    user_dict = user_data.model_dump(exclude={"password"})
    user_dict["hashed_password"] = hash_password(user_data.password)
    
    new_user = User(**user_dict)
    
    # Salva no banco
    await db.users.insert_one(new_user.model_dump())
    
    # Cria token de acesso
    access_token = create_access_token({"sub": new_user.email})
    
    # Retorna token e dados do usuário
    user_response = UserResponse(**new_user.model_dump())
    return Token(access_token=access_token, user=user_response)


@api_router.post("/auth/login", response_model=Token, tags=["Autenticação"])
async def login(credentials: UserLogin):
    """
    Faz login no sistema.
    
    - **email**: Email do usuário
    - **password**: Senha
    
    Retorna um token JWT válido por 7 dias.
    """
    # Busca o usuário pelo email
    user = await db.users.find_one({"email": credentials.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    # Verifica a senha
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    # Cria token de acesso
    access_token = create_access_token({"sub": user["email"]})
    
    # Retorna token e dados do usuário
    user_obj = User(**user)
    user_response = UserResponse(**user_obj.model_dump())
    return Token(access_token=access_token, user=user_response)


# ============================================================================
# ROTAS DE USUÁRIOS
# ============================================================================

@api_router.get("/users/me", response_model=UserResponse, tags=["Usuários"])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Retorna as informações do usuário logado.
    Requer autenticação.
    """
    return UserResponse(**current_user.model_dump())


@api_router.put("/users/me", response_model=UserResponse, tags=["Usuários"])
async def update_user_profile(
    updates: dict,
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza o perfil do usuário logado.
    
    Campos atualizáveis: name, phone, cpf, address, birthdate
    """
    # Remove campos que não podem ser atualizados
    allowed_fields = ["name", "phone", "cpf", "address", "birthdate"]
    filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
    
    if not filtered_updates:
        raise HTTPException(status_code=400, detail="Nenhum campo válido para atualizar")
    
    # Atualiza no banco
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": filtered_updates}
    )
    
    # Busca e retorna o usuário atualizado
    updated_user = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user)


# ============================================================================
# ROTAS DE SERVIÇOS
# ============================================================================

@api_router.get("/services", response_model=List[Service], tags=["Serviços"])
async def get_all_services(active_only: bool = True):
    """
    Lista todos os serviços disponíveis.
    
    - **active_only**: Se True, retorna apenas serviços ativos (padrão: True)
    """
    query = {"active": True} if active_only else {}
    services = await db.services.find(query).to_list(1000)
    return [Service(**service) for service in services]


@api_router.get("/services/{service_id}", response_model=Service, tags=["Serviços"])
async def get_service(service_id: str):
    """
    Obtém detalhes de um serviço específico.
    """
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return Service(**service)


@api_router.post("/services", response_model=Service, tags=["Serviços"])
async def create_service(
    service_data: ServiceCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo serviço.
    Apenas organizadores podem criar serviços.
    """
    # Verifica se o usuário é organizador
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Apenas organizadores podem criar serviços")
    
    # Cria o serviço
    new_service = Service(**service_data.model_dump(), organizer_id=current_user.id)
    await db.services.insert_one(new_service.model_dump())
    
    return new_service


@api_router.get("/services/organizer/my-services", response_model=List[Service], tags=["Serviços"])
async def get_my_services(current_user: User = Depends(get_current_user)):
    """
    Lista os serviços criados pelo organizador logado.
    Apenas para organizadores.
    """
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Apenas organizadores têm acesso")
    
    services = await db.services.find({"organizer_id": current_user.id}).to_list(1000)
    return [Service(**service) for service in services]


@api_router.put("/services/{service_id}", response_model=Service, tags=["Serviços"])
async def update_service(
    service_id: str,
    updates: dict,
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza um serviço.
    Apenas o organizador que criou o serviço pode atualizá-lo.
    """
    # Busca o serviço
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    # Verifica se o usuário é o dono do serviço
    if service["organizer_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar este serviço")
    
    # Atualiza
    await db.services.update_one({"id": service_id}, {"$set": updates})
    
    # Retorna serviço atualizado
    updated_service = await db.services.find_one({"id": service_id})
    return Service(**updated_service)


@api_router.delete("/services/{service_id}", tags=["Serviços"])
async def delete_service(
    service_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Deleta (desativa) um serviço.
    Apenas o organizador que criou o serviço pode deletá-lo.
    """
    # Busca o serviço
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    
    # Verifica permissão
    if service["organizer_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para deletar este serviço")
    
    # Desativa ao invés de deletar
    await db.services.update_one({"id": service_id}, {"$set": {"active": False}})
    
    return {"message": "Serviço deletado com sucesso"}


# ============================================================================
# ROTAS DE AGENDAMENTOS
# ============================================================================

@api_router.post("/bookings", response_model=Booking, tags=["Agendamentos"])
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo agendamento.
    Usuários podem agendar serviços disponíveis.
    """
    # Verifica se o serviço existe
    service = await db.services.find_one({"id": booking_data.service_id, "active": True})
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado ou inativo")
    
    # Cria o agendamento
    new_booking = Booking(**booking_data.model_dump(), user_id=current_user.id)
    await db.bookings.insert_one(new_booking.model_dump())
    
    return new_booking


@api_router.get("/bookings/my-bookings", response_model=List[BookingWithDetails], tags=["Agendamentos"])
async def get_my_bookings(current_user: User = Depends(get_current_user)):
    """
    Lista os agendamentos do usuário logado.
    Retorna os agendamentos com detalhes do serviço.
    """
    bookings = await db.bookings.find({"user_id": current_user.id}).to_list(1000)
    
    # Popula com detalhes do serviço
    result = []
    for booking in bookings:
        booking_obj = Booking(**booking)
        service = await db.services.find_one({"id": booking["service_id"]})
        
        booking_with_details = BookingWithDetails(
            **booking_obj.model_dump(),
            service=Service(**service) if service else None
        )
        result.append(booking_with_details)
    
    return result


@api_router.get("/bookings/organizer/all", response_model=List[BookingWithDetails], tags=["Agendamentos"])
async def get_organizer_bookings(current_user: User = Depends(get_current_user)):
    """
    Lista todos os agendamentos dos serviços do organizador.
    Apenas para organizadores.
    """
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="Apenas organizadores têm acesso")
    
    # Busca serviços do organizador
    services = await db.services.find({"organizer_id": current_user.id}).to_list(1000)
    service_ids = [s["id"] for s in services]
    
    # Busca agendamentos desses serviços
    bookings = await db.bookings.find({"service_id": {"$in": service_ids}}).to_list(1000)
    
    # Popula com detalhes
    result = []
    for booking in bookings:
        booking_obj = Booking(**booking)
        service = await db.services.find_one({"id": booking["service_id"]})
        user = await db.users.find_one({"id": booking["user_id"]})
        
        booking_with_details = BookingWithDetails(
            **booking_obj.model_dump(),
            service=Service(**service) if service else None,
            user=UserResponse(**user) if user else None
        )
        result.append(booking_with_details)
    
    return result


@api_router.put("/bookings/{booking_id}", response_model=Booking, tags=["Agendamentos"])
async def update_booking(
    booking_id: str,
    updates: BookingUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza um agendamento (status, rating, etc).
    Usuários podem atualizar seus próprios agendamentos.
    """
    # Busca o agendamento
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    # Verifica permissão
    if booking["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar este agendamento")
    
    # Atualiza apenas campos não-None
    update_dict = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_dict:
        await db.bookings.update_one({"id": booking_id}, {"$set": update_dict})
    
    # Retorna agendamento atualizado
    updated_booking = await db.bookings.find_one({"id": booking_id})
    return Booking(**updated_booking)


@api_router.delete("/bookings/{booking_id}", tags=["Agendamentos"])
async def cancel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Cancela um agendamento.
    """
    # Busca o agendamento
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    # Verifica permissão
    if booking["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para cancelar este agendamento")
    
    # Atualiza status para cancelado
    await db.bookings.update_one({"id": booking_id}, {"$set": {"status": "cancelled"}})
    
    return {"message": "Agendamento cancelado com sucesso"}


# ============================================================================
# ROTA DE HEALTH CHECK
# ============================================================================

@api_router.get("/", tags=["Sistema"])
async def health_check():
    """
    Verifica se a API está funcionando.
    """
    return {
        "status": "ok",
        "message": "Conectando API está funcionando!",
        "version": "1.0.0"
    }


# ============================================================================
# CONFIGURAÇÃO FINAL
# ============================================================================

# Incluir o router no app
app.include_router(api_router)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Evento de shutdown
@app.on_event("shutdown")
async def shutdown_db_client():
    """
    Fecha a conexão com o MongoDB ao desligar o servidor.
    """
    client.close()
    logger.info("MongoDB connection closed")
