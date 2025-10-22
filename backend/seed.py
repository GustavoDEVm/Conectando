#!/usr/bin/env python3
# ============================================================================
# SEED.PY - Script para popular o banco de dados com dados iniciais
# ============================================================================
# Este script adiciona usuários e serviços de exemplo no banco de dados
# para facilitar o teste da aplicação.
# ============================================================================

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from models import User, Service
from auth import hash_password
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Conexão com MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


async def seed_database():
    """
    Popula o banco de dados com dados iniciais.
    """
    print("🌱 Iniciando seed do banco de dados...")
    
    # ========================================================================
    # LIMPAR DADOS EXISTENTES (OPCIONAL - CUIDADO EM PRODUÇÃO!)
    # ========================================================================
    print("🗑️  Limpando dados existentes...")
    await db.users.delete_many({})
    await db.services.delete_many({})
    await db.bookings.delete_many({})
    
    # ========================================================================
    # CRIAR USUÁRIOS
    # ========================================================================
    print("👥 Criando usuários...")
    
    # Usuário regular
    user1 = User(
        email="tomoli9706@ampdial.com",
        hashed_password=hash_password("12345678"),
        name="tomoli9706",
        phone="(22) 22222-2222",
        cpf="234.567.891-00",
        address="teste",
        birthdate="2000-11-11",
        role="user"
    )
    await db.users.insert_one(user1.model_dump())
    print(f"✅ Usuário criado: {user1.email}")
    
    # Organizador
    user2 = User(
        email="kaxafec531@datoinf.com",
        hashed_password=hash_password("09876543"),
        name="kaxafec531",
        phone="(11) 98765-4321",
        cpf="123.456.789-00",
        address="Rua Exemplo, 123",
        birthdate="1990-05-15",
        role="organizer"
    )
    await db.users.insert_one(user2.model_dump())
    print(f"✅ Organizador criado: {user2.email}")
    
    # ========================================================================
    # CRIAR SERVIÇOS
    # ========================================================================
    print("🎯 Criando serviços...")
    
    services = [
        {
            "name": "Corte de Cabelo Solidário",
            "type": "Beleza",
            "description": "Corte de cabelo gratuito para pessoas em situação de vulnerabilidade",
            "photo": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400",
            "organizer_id": user2.id,
            "availability_days": ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
            "time_slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
            "location": "Local não especificado",
            "active": True
        },
        {
            "name": "Dentista",
            "type": "Saúde",
            "description": "Consulta odontológica gratuita e tratamentos básicos",
            "photo": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
            "organizer_id": user2.id,
            "availability_days": ["Terça-feira", "Quinta-feira"],
            "time_slots": ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"],
            "location": "Local não especificado",
            "active": True
        },
        {
            "name": "Aula de Informática",
            "type": "Educação",
            "description": "Aulas básicas de informática e inclusão digital",
            "photo": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
            "organizer_id": user2.id,
            "availability_days": ["Segunda-feira", "Quarta-feira"],
            "time_slots": ["10:00", "14:00", "16:00"],
            "location": "Centro Comunitário",
            "active": True
        },
        {
            "name": "Distribuição de Alimentos",
            "type": "Assistência Social",
            "description": "Distribuição de cestas básicas para famílias necessitadas",
            "photo": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
            "organizer_id": user2.id,
            "availability_days": ["Sábado"],
            "time_slots": ["09:00", "10:00", "11:00"],
            "location": "Praça Central",
            "active": True
        },
        {
            "name": "Consulta Jurídica",
            "type": "Jurídico",
            "description": "Orientação jurídica gratuita para questões básicas",
            "photo": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
            "organizer_id": user2.id,
            "availability_days": ["Sexta-feira"],
            "time_slots": ["09:00", "10:00", "11:00", "14:00", "15:00"],
            "location": "Escritório Comunitário",
            "active": True
        },
        {
            "name": "Apoio Psicológico",
            "type": "Saúde",
            "description": "Atendimento psicológico gratuito individual",
            "photo": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
            "organizer_id": user2.id,
            "availability_days": ["Terça-feira", "Quinta-feira"],
            "time_slots": ["09:00", "10:00", "11:00", "14:00", "15:00"],
            "location": "Clínica Social",
            "active": True
        }
    ]
    
    for service_data in services:
        service = Service(**service_data)
        await db.services.insert_one(service.model_dump())
        print(f"✅ Serviço criado: {service.name}")
    
    print("\n" + "="*60)
    print("🎉 Seed concluído com sucesso!")
    print("="*60)
    print("\n📋 CREDENCIAIS DE TESTE:\n")
    print("👤 USUÁRIO:")
    print(f"   Email: {user1.email}")
    print("   Senha: 12345678\n")
    print("👨‍💼 ORGANIZADOR:")
    print(f"   Email: {user2.email}")
    print("   Senha: 09876543\n")
    print("="*60)


if __name__ == "__main__":
    asyncio.run(seed_database())
    client.close()
