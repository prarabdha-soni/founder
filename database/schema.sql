-- Create database schema
CREATE DATABASE lending_sales;

\c lending_sales;

-- Conversations table for structured data
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    participant_name VARCHAR(255) NOT NULL,
    participant_company VARCHAR(255),
    conversation_type VARCHAR(50) NOT NULL,
    deal_stage VARCHAR(50) NOT NULL,
    key_points JSONB,
    objections JSONB,
    next_steps JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal stages tracking
CREATE TABLE deal_stages (
    participant_name VARCHAR(255),
    participant_company VARCHAR(255),
    stage VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (participant_name, participant_company)
);

-- Indexes for performance
CREATE INDEX idx_conversations_participant ON conversations(participant_name);
CREATE INDEX idx_conversations_company ON conversations(participant_company);
CREATE INDEX idx_conversations_type ON conversations(conversation_type);
CREATE INDEX idx_conversations_stage ON conversations(deal_stage);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_deal_stages_updated_at ON deal_stages(updated_at);

-- Sample triggers for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 