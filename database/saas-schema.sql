-- Multi-tenant SaaS schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants (companies/organizations)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    plan VARCHAR(50) NOT NULL DEFAULT 'founder',
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users within tenants
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member',
    auth0_user_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations (multi-tenant)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    participant_name VARCHAR(255) NOT NULL,
    participant_company VARCHAR(255),
    participant_email VARCHAR(255),
    participant_phone VARCHAR(50),
    content TEXT NOT NULL,
    conversation_type VARCHAR(50) NOT NULL,
    source_platform VARCHAR(50),
    external_id VARCHAR(255), -- For webhook integrations
    ai_insights JSONB,
    deal_stage VARCHAR(50),
    deal_value NUMERIC(12,2),
    sentiment VARCHAR(20),
    urgency VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prospects (enriched data)
CREATE TABLE prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    title VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    budget_range VARCHAR(100),
    decision_maker BOOLEAN DEFAULT FALSE,
    lead_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    config JSONB,
    last_sync TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking for billing
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    count INTEGER DEFAULT 1,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversations_tenant_participant ON conversations(tenant_id, participant_name);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_prospects_tenant_company ON prospects(tenant_id, company);
CREATE INDEX idx_usage_logs_tenant_date ON usage_logs(tenant_id, date);

-- Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (ensure tenant isolation)
CREATE POLICY tenant_isolation_conversations ON conversations
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_prospects ON prospects
    FOR ALL TO authenticated  
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID); 