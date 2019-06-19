CREATE TABLE ebooks (show_name VARCHAR(255), season VARCHAR(255), language VARCHAR(255), book VARCHAR(255), customer VARCHAR(255), country VARCHAR(255), month VARCHAR(255), year VARCHAR(255), copies INT, price DOUBLE, gross DOUBLE, royalty VARCHAR(255), net DOUBLE);

CREATE TABLE ios_apps ( month VARCHAR(255), year VARCHAR(255), num_copies INT, price DOUBLE, gross DOUBLE, royalty VARCHAR(255), net DOUBLe);

CREATE TABLE albums (sales_period VARCHAR(255), date VARCHAR(255), store_name VARCHAR(255), country VARCHAR(255), artist VARCHAR(255), relese_type VARCHAR(255), release_title VARCHAR(255), song_title VARCHAR(255), label VARCHAR(255), upc INT, optional_upc INT, song_id VARCHAR(255), optional_isrc VARCHAR(255), sales_type VARCHAR(255), units_sold INT, unit_price DOUBLE, net_sales DOUBLE, sales_currency VARCHAR(255), exchange_rate DOUBLE, total_earned DOUBLE, total_curency VARCHAR(255));
ALTER TABLE albums ADD month VARCHAR(255);
ALTER TABLE albums ADD year VARCHAR(255);
update albums set date = STR_TO_DATE(date, '%m/%d/%Y');
update albums set year = SUBSTRING(date, 1, 4);
update albums set month = MONTHNAME(date);
 

CREATE TABLE youtube_akili_en (report_date VARCHAR(255), estimated_revenue DOUBLE, estimated_red_revenue DOUBLE, estimated_ad_revenue DOUBLE, playback_based_cpm DOUBLE, estimated_monetized_playbacks DOUBLE);
DELETE FROM youtube_akili_en WHERE report_date='month';
DELETE FROM youtube_akili_en WHERE report_date='Total';
ALTER TABLE youtube_akili_en ADD month VARCHAR(255);
ALTER TABLE youtube_akili_en ADD year VARCHAR(255);
ALTER TABLE youtube_akili_en ADD dt datetime;
UPDATE youtube_akili_en SET year = SUBSTRING(report_date, 1, 4);
UPDATE youtube_akili_en SET report_date=CONCAT(report_date, '-01');
UPDATE youtube_akili_en SET dt=CONVERT(report_date, DATE);
UPDATE youtube_akili_en SET month=MONTHNAME(dt);


CREATE TABLE youtube_akili_sw (report_date VARCHAR(255), estimated_revenue DOUBLE, estimated_red_revenue DOUBLE, estimated_ad_revenue DOUBLE, playback_based_cpm DOUBLE, estimated_monetized_playbacks DOUBLE);
DELETE FROM youtube_akili_sw WHERE report_date='month';
DELETE FROM youtube_akili_sw WHERE report_date='Total';
ALTER TABLE youtube_akili_sw ADD month VARCHAR(255);
ALTER TABLE youtube_akili_sw ADD year VARCHAR(255);
ALTER TABLE youtube_akili_sw ADD dt datetime;
UPDATE youtube_akili_sw SET year = SUBSTRING(report_date, 1, 4);
UPDATE youtube_akili_sw SET report_date=CONCAT(report_date, '-01');
UPDATE youtube_akili_sw SET dt=CONVERT(report_date, DATE);
UPDATE youtube_akili_sw SET month=MONTHNAME(dt);

CREATE TABLE youtube_ubongo_en (report_date VARCHAR(255), estimated_revenue DOUBLE, estimated_red_revenue DOUBLE, estimated_ad_revenue DOUBLE, playback_based_cpm DOUBLE, estimated_monetized_playbacks DOUBLE);
DELETE FROM youtube_ubongo_en WHERE report_date='month';
DELETE FROM youtube_ubongo_en WHERE report_date='Total';
ALTER TABLE youtube_ubongo_en ADD month VARCHAR(255);
ALTER TABLE youtube_ubongo_en ADD year VARCHAR(255);
ALTER TABLE youtube_ubongo_en ADD dt datetime;
UPDATE youtube_ubongo_en SET year = SUBSTRING(report_date, 1, 4);
UPDATE youtube_ubongo_en SET report_date=CONCAT(report_date, '-01');
UPDATE youtube_ubongo_en SET dt=CONVERT(report_date, DATE);
UPDATE youtube_ubongo_en SET month=MONTHNAME(dt);

CREATE TABLE youtube_ubongo_sw (report_date VARCHAR(255), estimated_revenue DOUBLE, estimated_red_revenue DOUBLE, estimated_ad_revenue DOUBLE, playback_based_cpm DOUBLE, estimated_monetized_playbacks DOUBLE);
DELETE FROM youtube_ubongo_sw WHERE report_date='month';
DELETE FROM youtube_ubongo_sw WHERE report_date='Total';
ALTER TABLE youtube_ubongo_sw ADD month VARCHAR(255);
ALTER TABLE youtube_ubongo_sw ADD year VARCHAR(255);
ALTER TABLE youtube_ubongo_sw ADD dt datetime;
UPDATE youtube_ubongo_sw SET year = SUBSTRING(report_date, 1, 4);
UPDATE youtube_ubongo_sw SET report_date=CONCAT(report_date, '-01');
UPDATE youtube_ubongo_sw SET dt=CONVERT(report_date, DATE);
UPDATE youtube_ubongo_sw SET month=MONTHNAME(dt);

CREATE TABLE printful (sale_date VARCHAR(255), order_num VARCHAR(255), payment_instrument VARCHAR(255), status VARCHAR(255), products DOUBLE, discount DOUBLE, shipping DOUBLE, digitization DOUBLE, branding DOUBLE, tax DOUBLE, vat DOUBLE, total DOUBLE);
ALTER TABLE printful ADD dt datetime;
UPDATE printful SET dt=STR_TO_DATE(sale_date, '%d-%b-%y');
ALTER TABLE printful ADD month VARCHAR(255);
ALTER TABLE printful ADD year VARCHAR(255);
UPDATE printful SET month=MONTHNAME(dt);
UPDATE printful SET year=YEAR(dt);
UPDATE printful SET order_num=SUBSTRING(order_num, 7);

CREATE TABLE shopify (sale_date VARCHAR(255), type VARCHAR(255), order_num VARCHAR(255), card_brand VARCHAR(255), card_source VARCHAR(255), payout_status VARCHAR(255), payout_date VARCHAR(255), available_date VARCHAR(255), amount DOUBLE, fee DOUBLE, net DOUBLE);
DELETE FROM shopify WHERE sale_date='Transaction Date';
DELETE FROM shopify WHERE type='transfer_failure';
ALTER TABLE shopify ADD dt datetime;
UPDATE shopify SET sale_date=SUBSTRING(sale_date, 1, 10);
UPDATE shopify SET dt=STR_TO_DATE(sale_date, '%Y-%m-%d');
ALTER TABLE shopify ADD month VARCHAR(255);
ALTER TABLE shopify ADD year VARCHAR(255);
UPDATE shopify SET month=MONTHNAME(sale_date);
UPDATE shopify SET year=YEAR(dt);
UPDATE shopify set order_num=SUBSTRING(order_num, 2);


