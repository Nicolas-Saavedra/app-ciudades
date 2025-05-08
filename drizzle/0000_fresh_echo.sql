-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE INDEX IF NOT EXISTS "city_spatial_idx" ON "cities" USING gist ("point");
CREATE INDEX IF NOT EXISTS "restaurant_spatial_idx" ON "restaurants" USING gist ("point");
