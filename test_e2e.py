import json
import sqlite3
from fastapi.testclient import TestClient
from api.main import app, get_db, init_db

init_db()
client = TestClient(app)

print("=== 1. TESTE HEALTH ===")
r = client.get("/health")
print("Health:", r.status_code, r.json())
assert r.status_code == 200

print("\n=== 2. TESTE REGISTRO ===")
reg_payload = {"email": "consultor.teste@empresa.com.br", "password": "SenhaSegura123!"}
r = client.post("/register", json=reg_payload)
print("Register:", r.status_code, r.json())
assert r.status_code in [200, 400]

print("\n=== 3. TESTE LOGIN ===")
r = client.post("/login", data={"username": "consultor.teste@empresa.com.br", "password": "SenhaSegura123!"})
print("Login:", r.status_code)
assert r.status_code == 200
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("\n=== 4. TESTE BUSCA COM ZERO-TRUST ===")
search_payload = {
    "niche": "Engenharia Solar",
    "region": "Montes Claros",
    "quantity": 5,
    "criteria": "Sem anúncios ativos",
    "probe_live_social": False,
}
r = client.post("/search", json=search_payload, headers=headers)
print("Search:", r.status_code)
assert r.status_code == 200
leads = r.json()
print(f"Total de leads retornados: {len(leads)}")
assert len(leads) > 0
for idx, l in enumerate(leads):
    keys = list(l.keys())
    print(f"Lead #{idx+1} | Chaves: {keys}")
    assert keys[-1] == "link_referencia", f"link_referencia não é a última coluna! {keys}"
    print(f"  Nome: {l.get('name')}")
    print(f"  Veracidade: {l.get('veracity_status')} (Score: {l.get('veracity_score')})")
    print(f"  link_referencia: {l.get('link_referencia')}")

print("\n=== 5. TESTE HISTÓRICO FORENSE ===")
r = client.get("/search-history", headers=headers)
print("History:", r.status_code, f"{len(r.json())} buscas encontradas")
assert r.status_code == 200

print("\n=== 6. TESTE PERFIL ===")
r = client.get("/profile", headers=headers)
print("Get Profile:", r.status_code, r.json())
assert r.status_code == 200

r = client.put(
    "/profile",
    json={
        "company_name": "Sousza Consultoria",
        "company_services": "Engenharia de Dados e IA",
        "phone": "38999999999",
    },
    headers=headers,
)
print("Update Profile:", r.status_code, r.json())
assert r.status_code == 200

print("\n=== 7. TESTE CONTATO ===")
r = client.post(
    "/contact",
    json={
        "name": "Alex Souza",
        "email": "alex@sousza.com",
        "message": "Solicitação de proposta corporativa.",
    },
)
print("Contact:", r.status_code, r.json())
assert r.status_code == 200

print("\n=== 8. TESTE AUDITORIA INSTAGRAM SSR ===")
r = client.post("/verify-social", json={"handle_or_url": "instagram"})
print("Verify Social Instagram:", r.status_code, r.json())
assert r.status_code == 200
assert r.json().get("reference_url") == "https://www.instagram.com/instagram/"

print("\n>>> TODOS OS 8 TESTES DO BACKEND ZERO-TRUST PASSARAM COM 100% DE SUCESSO! <<<")
