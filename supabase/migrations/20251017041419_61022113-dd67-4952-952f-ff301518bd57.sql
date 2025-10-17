-- Create storage bucket for CSV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('csv-files', 'csv-files', false);

-- Create table for CSV file metadata
CREATE TABLE IF NOT EXISTS public.csv_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  table_name TEXT NOT NULL,
  columns JSONB NOT NULL,
  row_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for BigQuery connections
CREATE TABLE IF NOT EXISTS public.bigquery_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id TEXT NOT NULL,
  dataset TEXT NOT NULL,
  credentials JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.csv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bigquery_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for csv_files
CREATE POLICY "Users can view their own CSV files"
  ON public.csv_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CSV files"
  ON public.csv_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CSV files"
  ON public.csv_files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CSV files"
  ON public.csv_files FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for bigquery_connections
CREATE POLICY "Users can view their own BigQuery connections"
  ON public.bigquery_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own BigQuery connections"
  ON public.bigquery_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BigQuery connections"
  ON public.bigquery_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BigQuery connections"
  ON public.bigquery_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Storage policies for CSV files
CREATE POLICY "Users can upload their own CSV files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'csv-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own CSV files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'csv-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own CSV files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'csv-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_csv_files_updated_at
  BEFORE UPDATE ON public.csv_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bigquery_connections_updated_at
  BEFORE UPDATE ON public.bigquery_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();