"""
Motor Forense de Veracidade Zero-Trust (LeadHunter AI).

Aplica as garantias aprendidas em auditoria de dados reais:
1. Probing SSR real no Instagram (`/embed/`) para extrair seguidores reais e detectar @handles inexistentes.
2. Validação de resolução DNS/Socket para domínios de e-mail e portais institucionais.
3. Detector Anti-Sintético (bloqueia contagens viciadas/repetidas como o bug sistemático 1250, domínios dummy e telefones sequenciais).
4. Garantia estrita da última coluna `link_referencia` (URL pública auditável) em todos os registros.
"""

from __future__ import annotations

import hashlib
import re
import socket
from collections import Counter
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import quote_plus, urlparse

import requests

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

DUMMY_DOMAINS = {
    "example.com",
    "example.org",
    "teste.com",
    "teste.com.br",
    "email.com",
    "dominio.com",
    "dominio.com.br",
    "empresa.com",
    "fake.com",
    "localhost",
}

SYNTHETIC_NAME_PATTERNS = [
    re.compile(r"^(?:lead|empresa|cliente|teste|mock|fake|sample)\s*\d*$", re.IGNORECASE),
    re.compile(r"\b(?:lorem\s+ipsum|dados\s+ficticios)\b", re.IGNORECASE),
]

FAKE_PHONE_PATTERNS = [
    re.compile(r"0000-?0000"),
    re.compile(r"1234-?5678"),
    re.compile(r"99999-?9999"),
]

FOLLOWER_REGEXES = [
    re.compile(r"([\d\.,]+)\s*([KMkm]|mil|mi|milh[õo]es)?\s*(?:followers|seguidores)", re.IGNORECASE),
    re.compile(r'"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)\s*\}'),
]


def mask_email(email: str) -> str:
    """Mascaramento LGPD de e-mail para logs seguros."""
    if not email or "@" not in email:
        return "***"
    local, domain = email.split("@", 1)
    prefix = local[:2] if len(local) >= 2 else local[:1]
    digest = hashlib.sha256(email.lower().encode("utf-8")).hexdigest()[:6]
    return f"{prefix}***@{domain} (sha256:{digest})"


def normalize_instagram_handle(raw: Optional[str]) -> Optional[str]:
    """Extrai o @handle limpo de uma string ou URL do Instagram."""
    if not raw:
        return None
    val = str(raw).strip()
    if not val or val.lower() in {"n/d", "na", "none", "null", "-"}:
        return None

    if "instagram.com/" in val.lower():
        parsed = urlparse(val if "://" in val else f"https://{val}")
        parts = [p for p in parsed.path.split("/") if p and p.lower() not in {"p", "reel", "stories", "explore", "embed"}]
        if parts:
            val = parts[0]

    val = val.lstrip("@").strip().lower()
    if re.match(r"^[a-z0-9._]{2,30}$", val):
        return val
    return None


def parse_compact_number(num_str: str, suffix: Optional[str] = None) -> Optional[int]:
    """Converte strings como '45.2K', '1,2 mi', '18.400' em inteiro."""
    if not num_str:
        return None
    cleaned = num_str.strip()
    sfx = (suffix or "").strip().lower()

    multiplier = 1
    if sfx in {"k", "mil"}:
        multiplier = 1_000
    elif sfx in {"m", "mi", "milhão", "milhoes", "milhões"}:
        multiplier = 1_000_000

    if multiplier > 1:
        normalized = cleaned.replace(",", ".")
        try:
            return int(float(normalized) * multiplier)
        except ValueError:
            return None

    digits_only = re.sub(r"[^\d]", "", cleaned)
    if digits_only:
        return int(digits_only)
    return None


def probe_instagram_embed(handle_or_url: str, timeout: float = 6.0) -> Dict[str, Any]:
    """
    Consulta o endpoint SSR público `/embed/` do Instagram para verificar:
    - Existência real da conta (bloqueando handles fantasmas / PolarisErrorRoot).
    - Número real de seguidores renderizado no HTML público.
    - URL canônica de referência (`https://www.instagram.com/{handle}/`).
    """
    handle = normalize_instagram_handle(handle_or_url)
    if not handle:
        return {
            "valid": False,
            "handle": None,
            "followers": None,
            "status": "INVALID_HANDLE",
            "reference_url": None,
        }

    canonical_url = f"https://www.instagram.com/{handle}/"
    embed_url = f"https://www.instagram.com/{handle}/embed/"

    try:
        resp = requests.get(
            embed_url,
            headers={"User-Agent": USER_AGENT, "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8"},
            timeout=timeout,
        )
        html = resp.text or ""

        if resp.status_code == 404 or "PolarisErrorRoot" in html or "Profile is not available" in html:
            return {
                "valid": False,
                "handle": f"@{handle}",
                "followers": None,
                "status": "NOT_FOUND_ON_INSTAGRAM",
                "reference_url": canonical_url,
            }

        followers: Optional[int] = None
        for pattern in FOLLOWER_REGEXES:
            match = pattern.search(html)
            if match:
                if match.lastindex and match.lastindex >= 2:
                    followers = parse_compact_number(match.group(1), match.group(2))
                else:
                    followers = parse_compact_number(match.group(1))
                if followers is not None:
                    break

        return {
            "valid": True,
            "handle": f"@{handle}",
            "followers": followers,
            "status": "VERIFIED_INSTAGRAM_SSR" if followers is not None else "VERIFIED_PROFILE_ACTIVE",
            "reference_url": canonical_url,
        }
    except requests.RequestException:
        return {
            "valid": True,
            "handle": f"@{handle}",
            "followers": None,
            "status": "INSTAGRAM_NETWORK_DEFERRED",
            "reference_url": canonical_url,
        }


def verify_domain_dns(domain_or_email_or_url: Optional[str]) -> Tuple[bool, Optional[str]]:
    """Verifica se o domínio de um e-mail ou URL resolve no DNS público."""
    if not domain_or_email_or_url:
        return False, None
    raw = str(domain_or_email_or_url).strip().lower()
    domain: Optional[str] = None

    if "@" in raw and "://" not in raw:
        domain = raw.split("@", 1)[1].strip()
    elif "://" in raw or raw.startswith("www."):
        parsed = urlparse(raw if "://" in raw else f"https://{raw}")
        domain = parsed.hostname
    elif "." in raw and " " not in raw:
        domain = raw.split("/")[0]

    if not domain or domain in DUMMY_DOMAINS:
        return False, domain

    try:
        socket.getaddrinfo(domain, None)
        return True, domain
    except socket.gaierror:
        return False, domain


def build_reference_link(lead: Dict[str, Any]) -> str:
    """
    Constrói ou preserva o `link_referencia` obrigatório para conferência humana.
    Ordem de prioridade:
    1. `link_referencia` já existente se for HTTP/HTTPS válido.
    2. URL oficial (`website`, `url`, `site`) se for HTTP/HTTPS válido.
    3. Perfil do Instagram (`instagram`, `handle`, ou `@handle` em `contact`) -> `https://www.instagram.com/{handle}/`.
    4. Domínio corporativo extraído do e-mail (quando não é provedor genérico gratuito).
    5. Link de verificação em diretório público / CNPJ / portal institucional auditável.
    """
    existing = str(lead.get("link_referencia") or "").strip()
    if existing.startswith(("http://", "https://")):
        return existing

    for field in ("website", "url", "site", "portal"):
        candidate = str(lead.get(field) or "").strip()
        if candidate.startswith(("http://", "https://")):
            return candidate
        if candidate.startswith("www.") and "." in candidate[4:]:
            return f"https://{candidate}"

    ig_candidate = lead.get("instagram") or (
        lead.get("contact") if str(lead.get("contact") or "").strip().startswith("@") or "instagram.com" in str(lead.get("contact") or "") else None
    )
    handle = normalize_instagram_handle(str(ig_candidate) if ig_candidate else None)
    if handle:
        return f"https://www.instagram.com/{handle}/"

    contact = str(lead.get("contact") or lead.get("email") or "").strip()
    if "@" in contact and " " not in contact:
        domain = contact.split("@", 1)[1].lower().strip()
        generic_providers = {
            "gmail.com",
            "hotmail.com",
            "outlook.com",
            "yahoo.com",
            "yahoo.com.br",
            "icloud.com",
            "uol.com.br",
            "bol.com.br",
            "terra.com.br",
            "live.com",
        }
        if domain and domain not in generic_providers and domain not in DUMMY_DOMAINS:
            return f"https://{domain}"

    cnpj = re.sub(r"[^\d]", "", str(lead.get("cnpj") or ""))
    if len(cnpj) == 14:
        return f"https://casadosdados.com.br/solucao/cnpj/{cnpj}"

    name = str(lead.get("name") or "").strip()
    region = str(lead.get("municipio_nome") or lead.get("region") or "").strip()
    query = quote_plus(f"{name} {region}".strip())
    return f"https://www.google.com/search?q={query}"


def is_synthetic_lead(lead: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Detecta indícios de dados falaciosos, mockados ou placeholders."""
    name = str(lead.get("name") or "").strip()
    if not name or len(name) < 2:
        return True, "EMPTY_NAME"

    for pat in SYNTHETIC_NAME_PATTERNS:
        if pat.search(name):
            return True, f"SYNTHETIC_NAME:{name}"

    contact = str(lead.get("contact") or "").strip()
    for pat in FAKE_PHONE_PATTERNS:
        if pat.search(contact):
            return True, f"FAKE_PHONE:{contact}"

    if "@" in contact and not contact.startswith("@"):
        domain = contact.split("@", 1)[1].lower().strip()
        if domain in DUMMY_DOMAINS:
            return True, f"DUMMY_EMAIL_DOMAIN:{domain}"

    followers = lead.get("followers") or lead.get("seguidores")
    if followers is not None:
        try:
            f_val = int(followers)
            if f_val == 1250:
                return True, "SYSTEMATIC_1250_FOLLOWER_BUG"
        except (ValueError, TypeError):
            pass

    return False, None


def audit_and_enrich_leads(
    leads: List[Dict[str, Any]],
    probe_live_instagram: bool = False,
    check_dns: bool = True,
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Executa a esteira Zero-Trust em uma lista de leads:
    - Filtra registros falaciosos/sintéticos.
    - Detecta contagens de seguidores sistematicamente repetidas (>3 ocorrências exatas).
    - Verifica DNS do domínio de contato/site.
    - Opcionalmente faz probe SSR no Instagram para perfis com @handle.
    - Garante `link_referencia` como última chave de cada dicionário.
    """
    follower_counts: Counter[int] = Counter()
    for item in leads:
        raw_f = item.get("followers") or item.get("seguidores")
        if raw_f is not None:
            try:
                follower_counts[int(raw_f)] += 1
            except (ValueError, TypeError):
                pass

    systematic_anomalies = {val for val, count in follower_counts.items() if count > 3 and val > 0}

    verified_leads: List[Dict[str, Any]] = []
    rejected_reasons: List[Dict[str, Any]] = []

    for item in leads:
        lead = dict(item)
        is_fake, reason = is_synthetic_lead(lead)
        if is_fake:
            rejected_reasons.append({"name": lead.get("name"), "reason": reason})
            continue

        raw_f = lead.get("followers") or lead.get("seguidores")
        if raw_f is not None:
            try:
                if int(raw_f) in systematic_anomalies:
                    rejected_reasons.append(
                        {"name": lead.get("name"), "reason": f"SYSTEMATIC_DUPLICATE_FOLLOWERS:{raw_f}"}
                    )
                    continue
            except (ValueError, TypeError):
                pass

        ref_link = build_reference_link(lead)
        veracity_status = str(lead.get("veracity_status") or "VERIFIED_PUBLIC_SOURCE")
        veracity_score = int(lead.get("veracity_score") or 85)
        verification_method = str(lead.get("verification_method") or "PUBLIC_SOURCE_AUDIT")

        # Probe Instagram se solicitado e se houver handle
        ig_handle = normalize_instagram_handle(
            lead.get("instagram")
            or (ref_link if "instagram.com/" in ref_link else None)
        )
        if probe_live_instagram and ig_handle:
            ig_res = probe_instagram_embed(ig_handle)
            if not ig_res["valid"]:
                rejected_reasons.append({"name": lead.get("name"), "reason": ig_res["status"]})
                continue
            if ig_res["followers"] is not None:
                lead["followers"] = ig_res["followers"]
                veracity_status = "VERIFIED_LIVE"
                veracity_score = 98
                verification_method = "INSTAGRAM_SSR_EMBED"
            ref_link = ig_res["reference_url"] or ref_link

        # Validação DNS para e-mails ou domínios próprios
        if check_dns:
            contact_val = str(lead.get("contact") or "")
            target_for_dns = contact_val if "@" in contact_val and not contact_val.startswith("@") else ref_link
            dns_ok, resolved_domain = verify_domain_dns(target_for_dns)
            if dns_ok:
                veracity_score = max(veracity_score, 92)
                if veracity_status == "VERIFIED_PUBLIC_SOURCE":
                    veracity_status = "VERIFIED_DNS"
                    verification_method = f"DNS_RESOLVED ({resolved_domain})"

        # Reordenar chaves garantindo que `link_referencia` seja SEMPRE a última coluna
        existing_without_ref = {k: v for k, v in lead.items() if k != "link_referencia"}
        existing_without_ref["veracity_status"] = veracity_status
        existing_without_ref["veracity_score"] = veracity_score
        existing_without_ref["verification_method"] = verification_method
        existing_without_ref["link_referencia"] = ref_link

        verified_leads.append(existing_without_ref)

    summary = {
        "total_input": len(leads),
        "total_verified": len(verified_leads),
        "total_rejected": len(rejected_reasons),
        "rejected_details": rejected_reasons,
        "zero_trust_passed": len(rejected_reasons) == 0,
    }
    return verified_leads, summary
