import uuid
from fastapi import APIRouter, HTTPException
from models.schemas import IngestRequest, IngestResponse, SearchRequest, SearchResponse, SearchResult
from rag.pipeline import ingest_document, retrieve, get_kb_stats

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

SEED_DOCUMENTS = [
    {
        "title": "CMA Investment Funds Regulations — Article 44: Derivatives and Leverage",
        "content": """Article 44 of the CMA Investment Funds Regulations governs the use of financial derivatives
by investment funds licensed in Saudi Arabia. Public investment funds may use derivatives solely for hedging
purposes and must not use derivatives to create leverage beyond the fund's net asset value. The total exposure
from derivatives shall not exceed 100% of the fund's net asset value (NAV). Private investment funds may use
derivatives for both hedging and investment purposes, subject to disclosure in the fund's terms and conditions.
Fund managers must calculate global exposure daily using either the commitment approach or value-at-risk (VaR)
methodology. Breach of derivative limits must be reported to the board and CMA within 5 business days.
The CMA may suspend trading in a fund that systematically breaches Article 44 limits.""",
        "source": "CMA",
        "article_ref": "IFR Article 44",
        "tags": ["derivatives", "leverage", "investment funds", "CMA"],
    },
    {
        "title": "CMA Investment Funds Regulations — Article 58: Affiliated Transactions",
        "content": """Article 58 prohibits investment funds from entering into transactions with affiliated
parties without independent board approval. An affiliated party includes: the fund manager, its directors
and officers, entities controlling or controlled by the fund manager, and funds managed by the same manager.
Transactions with affiliated parties require: (1) approval by a majority of independent board members,
(2) an independent valuation by a qualified external party, and (3) disclosure to unit holders within
15 days of execution. Interfund lending between funds managed by the same manager constitutes an affiliated
transaction under Article 58. Penalties for violation include suspension of the fund manager's license
and financial penalties up to SAR 5 million per violation. CMA must be notified within 3 business days
of any affiliated transaction exceeding 5% of fund NAV.""",
        "source": "CMA",
        "article_ref": "IFR Article 58",
        "tags": ["affiliated transactions", "interfund lending", "governance", "CMA"],
    },
    {
        "title": "SAMA Basel III Liquidity Coverage Ratio (LCR) Requirements",
        "content": """The Saudi Central Bank (SAMA) requires all licensed banks to maintain a Liquidity
Coverage Ratio (LCR) of at least 100% as per Basel III implementation. The LCR is calculated as:
LCR = High Quality Liquid Assets (HQLA) / Net Cash Outflows over 30-day stress period × 100.
HQLA must consist of: Level 1 assets (cash, central bank reserves, sovereign bonds) with no haircut,
and Level 2 assets (agency securities, high-grade corporate bonds) with haircuts of 15–50%.
Level 2 assets cannot exceed 40% of total HQLA. Banks must report LCR monthly to SAMA.
If LCR falls below 100%, the bank must notify SAMA immediately and submit a remediation plan within
5 business days. SAMA may impose restrictions on dividend payments, share buybacks, and bonus payments
for banks with LCR below 100% for more than 30 consecutive days. The Net Stable Funding Ratio (NSFR)
must also be maintained at minimum 100% as a complementary metric.""",
        "source": "SAMA",
        "article_ref": "SAMA LCR Rule 2026",
        "tags": ["LCR", "HQLA", "liquidity", "Basel III", "SAMA"],
    },
    {
        "title": "SAMA AML/CFT Rules — Enhanced Due Diligence Requirements",
        "content": """SAMA AML/CFT Rules require financial institutions to apply Enhanced Due Diligence (EDD)
for high-risk customers, including: Politically Exposed Persons (PEPs), customers from high-risk
jurisdictions on FATF grey/black lists, customers involved in high-risk business activities (cash-intensive
businesses, money service businesses), and transactions above SAR 60,000 in a single transaction or
SAR 120,000 cumulatively within 30 days. EDD measures include: senior management approval for establishing
the relationship, enhanced ongoing monitoring with at least annual review, obtaining information on the
source of funds and source of wealth, and verification of beneficial ownership to the ultimate natural
person level. Beneficial owner threshold is 25% ownership or effective control. Customer due diligence
records must be retained for minimum 10 years. Suspicious transaction reports (STRs) must be filed with
the Financial Intelligence Unit (FIU) within 3 business days of detection. Tipping off the customer about
an STR filing is a criminal offense under Saudi AML Law Article 12.""",
        "source": "SAMA",
        "article_ref": "SAMA AML/CFT Rules Article 15",
        "tags": ["AML", "EDD", "KYC", "PEP", "SAMA", "FATF"],
    },
    {
        "title": "EU MiCA Title IV — Requirements for Crypto-Asset Service Providers",
        "content": """Markets in Crypto-Assets Regulation (MiCA) Title IV establishes the regulatory framework
for Crypto-Asset Service Providers (CASPs) operating in the EU. CASPs must obtain authorization from the
national competent authority of their home member state. Authorization requirements include: minimum initial
capital of EUR 50,000 to EUR 150,000 depending on the category of services, a clear governance structure
with fit-and-proper directors, a written business continuity plan, and a client asset segregation policy.
MiCA requires CASPs to: maintain client crypto-assets in segregated wallets, provide a detailed white paper
for any crypto-asset offering, apply AML/CFT procedures equivalent to those for traditional financial services,
and report market abuse (insider dealing, market manipulation) to regulators. Asset-referenced tokens (ARTs)
and e-money tokens (EMTs) face additional requirements including reserve backing and redemption rights.
The transition period for existing CASPs in member states with pre-MiCA national regimes ends December 30, 2026.
Saudi firms with EU clients may be subject to MiCA's extraterritorial provisions if providing services
to EU resident clients.""",
        "source": "FSDP",
        "article_ref": "MiCA Title IV",
        "tags": ["MiCA", "crypto", "digital assets", "CASP", "EU"],
    },
    {
        "title": "FSDP Financial Sector Development Program — Asset Management Targets",
        "content": """The Financial Sector Development Program (FSDP) is one of Saudi Vision 2030's key
programs, targeting the development of a diversified, advanced financial sector. Key FSDP targets for
asset management include: increasing assets under management in licensed investment funds to SAR 1.8 trillion
by 2030, increasing the percentage of institutional investment in equities to 80% of total market value,
and expanding the number of licensed asset management companies from 74 to over 100 by 2025. FSDP also
targets: listing 5 new government-related entities on Tadawul by 2025, increasing depth of the Saudi
Exchange with market capitalization exceeding SAR 12 trillion, and achieving index inclusion in MSCI,
FTSE Russell, and S&P DJI emerging market indices. Compliance officers must track FSDP milestones as
they directly affect licensing conditions and reporting requirements for asset managers.""",
        "source": "FSDP",
        "article_ref": "FSDP Asset Management Pillar",
        "tags": ["FSDP", "Vision 2030", "asset management", "Saudi Exchange"],
    },
    {
        "title": "Saudi Exchange (Tadawul) Disclosure and Market Conduct Rules",
        "content": """Saudi Exchange Rules for Disclosure and Transparency require listed companies and
their major shareholders to disclose material information within 1 business day of occurrence.
Material events requiring immediate disclosure include: changes in shareholding of 5% or more,
board member resignations or appointments, financial results deviating more than 30% from previous
period, rating agency actions, and any event that could affect the company's ability to continue as
a going concern. Short selling is permitted on Tadawul for eligible securities with approved securities
lending agreements. Insider trading prohibition: any person with access to material non-public information
must not trade until 48 hours after public disclosure. Market makers must maintain bid-ask spreads within
specified limits and provide minimum liquidity. For investment funds listed on Tadawul, NAV must be
published daily, and any breach of fund limits must be disclosed within 2 business days.""",
        "source": "Saudi Exchange",
        "article_ref": "Tadawul Market Rules 2024",
        "tags": ["Tadawul", "disclosure", "market conduct", "insider trading", "Saudi Exchange"],
    },
    {
        "title": "Fintech Saudi — Regulatory Sandbox and Licensing Framework",
        "content": """Fintech Saudi, under the auspices of SAMA and CMA, manages the regulatory sandbox
program enabling fintech companies to test innovative financial products under relaxed regulatory requirements
for a defined period (typically 6–12 months with possible extension to 18 months). Sandbox eligibility
criteria: the product must be genuinely innovative, must have a credible business model, must address
a real consumer or market need, and the company must demonstrate ability to comply with applicable laws.
During the sandbox period: customer limits apply (maximum 1,000 customers or SAR 10 million in transactions),
the fintech must obtain PI (Payment Institution) or PISP (Payment Initiation Service Provider) licensing
from SAMA for payments activities, and Investment-related fintechs must obtain CMA investment advisory or
crowdfunding licensing. After sandbox: full licensing application must be submitted within 3 months of
sandbox conclusion. Fintechs using AI/ML for credit scoring must demonstrate model explainability and
fairness testing under SAMA's Responsible AI guidelines published in 2025.""",
        "source": "Fintech Saudi",
        "article_ref": "Fintech Saudi Sandbox Rules 2025",
        "tags": ["fintech", "sandbox", "SAMA", "CMA", "licensing", "AI"],
    },
]

_seeded = False


async def seed_knowledge_base():
    global _seeded
    if _seeded:
        return
    for doc in SEED_DOCUMENTS:
        ingest_document(
            title=doc["title"],
            content=doc["content"],
            source=doc["source"],
            article_ref=doc.get("article_ref", ""),
            tags=doc.get("tags", []),
        )
    _seeded = True


@router.post("/ingest", response_model=IngestResponse)
async def ingest_document_endpoint(req: IngestRequest):
    result = ingest_document(
        title=req.title,
        content=req.content,
        source=req.source,
        article_ref=req.article_ref or "",
        tags=req.tags,
    )
    return IngestResponse(
        success=True,
        chunks_created=result["chunks_created"],
        document_id=result["document_id"],
    )


@router.post("/search", response_model=SearchResponse)
async def semantic_search(req: SearchRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    chunks = retrieve(req.query, top_k=req.top_k, source_filter=req.source_filter)
    results = [
        SearchResult(
            id=c["id"],
            title=c["title"],
            excerpt=c["text"][:400],
            source=c["source"],
            score=round(c["score"], 4),
            article_ref=c.get("article_ref") or None,
        )
        for c in chunks
    ]
    return SearchResponse(query=req.query, results=results, total=len(results))


@router.get("/stats")
async def knowledge_stats():
    stats = get_kb_stats()
    return {**stats, "sources": 6, "seeded": _seeded}
