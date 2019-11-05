BEGIN;

INSERT INTO users
    (username, password)
VALUES
  ('testuser', 'test');

INSERT INTO collections (name, userId) VALUES
  ('Ripe', '1'),
  ('Young Raw', '1'),
  ('Aged Raw', '1');

INSERT INTO teas (year, name, vendor, quantity, cost, link, collectionId) VALUES
    ('2018', 'Dark Depths', 'Crimson Lotus Tea', '200', '50', 'https://crimsonlotustea.com/collections/shou-ripe-puerh/products/2018-dark-depths-shou-ripe-puerh-free-shipping', '1'),
    ('2018', 'Spring Raw', 'White2Tea', '100', '13', 'https://white2tea.com/product/basics-puer-tea-sample-set/', '2'),
    ('2017', 'Autumn Raw', 'White2Tea', '100', '13', 'https://white2tea.com/product/basics-puer-tea-sample-set/', '2'),
    ('2018', 'Huangpian', 'White2Tea', '100', '13', 'https://white2tea.com/product/basics-puer-tea-sample-set/', '2'),
    ('2014', 'Aged Raw', 'White2Tea', '100', '13', 'https://white2tea.com/product/basics-puer-tea-sample-set/', '3'),
    ('2017', 'Waffles', 'White2Tea', '200', '18', 'https://white2tea.com/product/2017-waffles/', '1'),
    ('2006', 'Changtai Tian Xia Tong An "Gold Edition', 'Yunnan Sourcing', '400', '70', 'https://yunnansourcing.com/collections/aged-raw-pu-erh-tea/products/2006-changtai-tian-xia-tong-an-gold-edition-raw-pu-erh-tea', '3');


INSERT INTO sessions (name, teaId, quantity, parameters, notes, rating) VALUES
    ('Dark Depths', '1', '10', 'Very hot fresh boiled water, 150ml yixing clay teapot. Steeps starting at 5 seconds. Kept the teapot as hot as possible', 'Dark, viscous steeps that lasted for a long time. Almost had the consistency of coffee. Very long lasting flavours. Got maybe 20 steeps out of it.', '5'),
    ('Dark Depths', '1', '10', 'Very hot fresh boiled water, 150ml gaiwan. Started steeping at 5 seconds and incrementally increased from there.', 'Very dark and earthy. First few steeps were light, but it became much more full bodied after the 10 second steeps.', '4');

COMMIT;