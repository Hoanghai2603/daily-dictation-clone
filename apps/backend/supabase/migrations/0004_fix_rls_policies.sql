-- Allow authenticated users (admins) to insert/update/delete topics
CREATE POLICY "Admins can insert topics" ON topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update topics" ON topics
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete topics" ON topics
  FOR DELETE USING (auth.role() = 'authenticated');

-- Also make sure exercises table has write policies!
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view exercises" ON exercises
  FOR SELECT USING (true);
  
CREATE POLICY "Admins can insert exercises" ON exercises
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update exercises" ON exercises
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete exercises" ON exercises
  FOR DELETE USING (auth.role() = 'authenticated');
