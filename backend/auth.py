# ============================================================================
# AUTH.PY - Utilitários de autenticação e segurança
# ============================================================================
# Este arquivo contém funções para:
# - Hash de senhas
# - Verificação de senhas
# - Criação e validação de tokens JWT
# ============================================================================

from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os

# ============================================================================
# CONFIGURAÇÕES
# ============================================================================

# Chave secreta para assinar os tokens JWT
# Em produção, isso deve vir de uma variável de ambiente
SECRET_KEY = os.getenv("SECRET_KEY", "sua-chave-secreta-muito-segura-mude-em-producao")
ALGORITHM = "HS256"  # Algoritmo de criptografia
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # Token expira em 7 dias

# Contexto para hash de senhas usando bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================================================================
# FUNÇÕES DE HASH DE SENHA
# ============================================================================

def hash_password(password: str) -> str:
    """
    Cria um hash seguro da senha usando bcrypt.
    
    Args:
        password: Senha em texto plano
        
    Returns:
        Hash da senha
        
    Exemplo:
        >>> hash_password("minha_senha_123")
        '$2b$12$...'
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica se a senha em texto plano corresponde ao hash.
    
    Args:
        plain_password: Senha em texto plano
        hashed_password: Hash da senha armazenado
        
    Returns:
        True se a senha corresponder, False caso contrário
        
    Exemplo:
        >>> verify_password("minha_senha_123", hash_armazenado)
        True
    """
    return pwd_context.verify(plain_password, hashed_password)


# ============================================================================
# FUNÇÕES DE TOKEN JWT
# ============================================================================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Cria um token JWT com os dados fornecidos.
    
    Args:
        data: Dicionário com os dados a serem incluídos no token
        expires_delta: Tempo de expiração customizado (opcional)
        
    Returns:
        Token JWT assinado
        
    Exemplo:
        >>> create_access_token({"sub": "user@example.com"})
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    """
    to_encode = data.copy()
    
    # Define o tempo de expiração
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Adiciona a expiração aos dados do token
    to_encode.update({"exp": expire})
    
    # Cria e retorna o token assinado
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    Verifica e decodifica um token JWT.
    
    Args:
        token: Token JWT a ser verificado
        
    Returns:
        Dicionário com os dados do token se válido, None caso contrário
        
    Exemplo:
        >>> verify_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        {'sub': 'user@example.com', 'exp': 1234567890}
    """
    try:
        # Tenta decodificar o token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # Token inválido ou expirado
        return None


def get_user_from_token(token: str) -> Optional[str]:
    """
    Extrai o ID/email do usuário de um token JWT.
    
    Args:
        token: Token JWT
        
    Returns:
        ID/email do usuário se o token for válido, None caso contrário
        
    Exemplo:
        >>> get_user_from_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        'user@example.com'
    """
    payload = verify_token(token)
    if payload:
        return payload.get("sub")
    return None
