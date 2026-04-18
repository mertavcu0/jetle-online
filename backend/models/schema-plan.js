/**
 * Production database blueprint (PostgreSQL recommended).
 *
 * users
 * - id (uuid, pk)
 * - full_name, email (unique), password_hash
 * - phone, city, district
 * - role (user|admin|store), profile_type, is_active
 * - created_at, updated_at
 * Indexes: unique(email), idx_users_role, idx_users_active
 *
 * listings
 * - id (uuid, pk), owner_id (fk -> users.id)
 * - category, subcategory, title, description
 * - price, status (draft|pending|approved|rejected|passive)
 * - phone
 * - location_city, location_district, location_address, location_lat, location_lng
 * - specs_jsonb
 * - featured, showcase, urgent, highlight
 * - featured_until, showcase_until
 * - moderation_note, created_at, updated_at
 * Indexes: idx_listings_owner, idx_listings_status, idx_listings_category, idx_listings_doping_priority(showcase, featured, created_at desc)
 *
 * listing_media
 * - id (uuid, pk), listing_id (fk -> listings.id)
 * - media_type (image|video), storage_key, public_url, mime, size_bytes
 * - is_cover, sort_order, created_at
 * Indexes: idx_listing_media_listing, idx_listing_media_cover
 *
 * favorites
 * - id (uuid, pk), user_id (fk), listing_id (fk), created_at
 * Indexes: unique(user_id, listing_id), idx_favorites_listing
 *
 * messages
 * - id (uuid, pk), conversation_id (uuid), listing_id (fk)
 * - sender_id (fk), receiver_id (fk), body, is_read, created_at
 * Indexes: idx_messages_conversation_created, idx_messages_receiver_unread
 *
 * complaints
 * - id (uuid, pk), listing_id (fk), reporter_id (fk nullable), reason, details
 * - status (open|reviewing|resolved|dismissed), reviewer_id (fk nullable)
 * - created_at, updated_at
 * Indexes: idx_complaints_status, idx_complaints_listing
 *
 * packages
 * - id (uuid, pk), code, name, package_type, price_minor, currency, duration_days
 * - features_jsonb, is_active, created_at, updated_at
 * Indexes: unique(code), idx_packages_active
 *
 * doping_purchases
 * - id (uuid, pk), user_id (fk), listing_id (fk), package_id (fk nullable)
 * - doping_type (featured|showcase|urgent|highlight), payment_status
 * - starts_at, ends_at, created_at
 * Indexes: idx_doping_listing_active(listing_id, ends_at), idx_doping_user
 *
 * ads_banners
 * - id (uuid, pk), title, slot, media_url, target_url, is_active, starts_at, ends_at
 * Indexes: idx_ads_slot_active(slot, is_active)
 *
 * sessions_auth_tokens
 * - id (uuid, pk), user_id (fk), token_hash, token_type (refresh|session), expires_at, revoked_at, created_at
 * Indexes: idx_tokens_user, idx_tokens_expiry, idx_tokens_hash(unique)
 */

module.exports = {};
