import os
import uuid
import io
import time
import smtplib
import pandas as pd
from datetime import datetime, timedelta, timezone
from typing import List, Optional

# --- Imports para o E-mail ---
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# --- Imports para o FastAPI e Segurança ---
from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt
import sqlite3

# --- Imports para o Banco de Dados MySQL ---
from sqlalchemy import create_engine, text

# --- Carregamento de Configurações ---
load_dotenv()

# --- Constantes de Segurança e Configs ---
SECRET_KEY = os.getenv("SECRET_KEY", "sua-chave-secreta-padrao-trocar-em-producao")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
LEAD_LIMIT_FULL_PROCESS = 50
LEAD_LIMIT_SAMPLE = 5

# --- Configuração do Banco de Dados de Autenticação (SQLite) ---
AUTH_DATABASE_URL = "local_database.db"

def get_auth_db_connection():
    conn = sqlite3.connect(AUTH_DATABASE_URL, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def create_auth_tables():
    conn = get_auth_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            hashed_password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# --- Configuração do Banco de Dados de Leads (MySQL) ---
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
engine = None
if all([DB_USER, DB_PASSWORD, DB_HOST, DB_NAME]):
    db_connection_str = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    engine = create_engine(db_connection_str)
else:
    print("ALERTA: Credenciais do banco de dados MySQL não encontradas no .env")

# --- Modelos Pydantic ---
class User(BaseModel): id: int; email: EmailStr
class UserInDB(User): hashed_password: str
class UserCreate(BaseModel): email: EmailStr; password: str
class Token(BaseModel): access_token: str; token_type: str
class LeadGenerationRequest(BaseModel): niche: str; region: str; quantity: int; criteria: str; include_keywords: Optional[str] = None; exclude_keywords: Optional[str] = None

# --- Funções de Segurança e Usuário (Unificadas) ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user(email: str) -> Optional[UserInDB]:
    conn = get_auth_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user_row = cursor.fetchone()
    conn.close()
    if user_row:
        return UserInDB(**dict(user_row))
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user(email=email)
    if user is None:
        raise credentials_exception
    return user

# --- LÓGICA DA TAREFA EM BACKGROUND ---
def generate_leads_worker(user_email: str, request_data: dict, task_id: str):
    # ... (Sua função worker continua aqui, sem alterações necessárias) ...
    # ... Ela já usa o `engine` corretamente, então está segura. ...
    pass # Removido para encurtar, mas seu código completo entra aqui.


# --- INICIALIZAÇÃO DO APP FASTAPI ---
app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_auth_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINTS DA API ---

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/register")
def register_user(user: UserCreate):
    if get_user(user.email):
        raise HTTPException(status_code=400, detail="Email já registrado")
    
    hashed_password = get_password_hash(user.password)
    conn = get_auth_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (email, hashed_password) VALUES (?, ?)", (user.email, hashed_password))
    conn.commit()
    conn.close()
    return {"message": "Usuário registrado com sucesso"}


@app.post("/api/search", response_model=List[dict])
async def search_and_generate_leads(
    request: LeadGenerationRequest, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    if not engine:
        raise HTTPException(status_code=503, detail="Serviço de banco de dados indisponível.")

    task_id = str(uuid.uuid4())
    user_email = current_user.email
    print(f"Pedido de {user_email} recebido. ID da tarefa: {task_id}")
    
    background_tasks.add_task(generate_leads_worker, user_email, request.dict(), task_id)
    
    print(f"Buscando amostra de {LEAD_LIMIT_SAMPLE} leads para {user_email}...")
    
    query = text("""
        SELECT nome_final as name, correio_eletronico as contact, municipio_nome, uf 
        FROM estabelecimentos 
        WHERE municipio_nome = :region AND nome_final LIKE :niche 
        LIMIT :limit
    """)
    params = {"region": request.region, "niche": f"%{request.niche}%", "limit": LEAD_LIMIT_SAMPLE}
    
    try:
        with engine.connect() as connection:
            result = connection.execute(query, params)
            sample_leads = [dict(row._mapping) for row in result]
    except Exception as e:
        print(f"Erro ao buscar amostra: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar dados no banco de dados.")

    return sample_leads