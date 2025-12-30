-- AI-generated herb locations table
-- Stores predicted locations where herbs can be found based on climate and botanical data
CREATE TABLE IF NOT EXISTS public.ai_herb_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    common_name TEXT NOT NULL,
    latin_name TEXT,
    location TEXT NOT NULL, -- Format: "latitude,longitude"
    region_name TEXT NOT NULL,
    climate_type TEXT,
    elevation_range TEXT,
    suitable_conditions TEXT,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_herb_locations_common_name ON public.ai_herb_locations(common_name);
CREATE INDEX IF NOT EXISTS idx_ai_herb_locations_created_at ON public.ai_herb_locations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_herb_locations_climate_type ON public.ai_herb_locations(climate_type);

-- Enable Row Level Security
ALTER TABLE public.ai_herb_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone to read AI-generated locations
CREATE POLICY "AI locations are publicly readable" ON public.ai_herb_locations
    FOR SELECT
    USING (true);

-- Only authenticated users can insert AI locations (via API)
CREATE POLICY "Authenticated users can insert AI locations" ON public.ai_herb_locations
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Optional: Allow authenticated users to update their AI-generated locations
CREATE POLICY "Authenticated users can update AI locations" ON public.ai_herb_locations
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

-- Optional: Allow authenticated users to delete AI locations
CREATE POLICY "Authenticated users can delete AI locations" ON public.ai_herb_locations
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.ai_herb_locations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
