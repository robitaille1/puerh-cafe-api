# PUERH / CAFE

## Live Link
https://puerh-cafe.netlify.com

## Client Link
https://github.com/robitaille1/puerh-cafe

## Summary
PUERH / CAFE is an application for tracking personal inventory for puerh tea. Many puerh tea drinkers accumulate many cakes throughout the years, and sometimes they can get lost in the shuffle. PUERH / CAFE aims to assist in keeping track of teas, as well as how they taste over time.


### Api Documentation

## /GET Collections

/collection
This endpoint will get all collections within the database.
Each collection has the fields `id, name`
example:
`{ "id": 17, "name": "newly purchased"}`

## /GET Teas

/tea
This endpoint will get all teas within the database.
Each tea has the fields `id, year, name, vendor, quantity, cost, link, collectionid`
example:
`{ "id": 1, "year": 2018, "name": "Dark Depths", "vendor": "Crimson Lotus Tea", "quantity": 200,"cost": 50, "link": "https://crimsonlotustea.com/collections/shou-ripe-puerh/products/2018-dark-depths-shou-ripe-puerh-free-shipping","collectionid": 1}`

## /GET Sessions

/session
This endpoint will get all sessions within the database.
Each session has the fields `id, name, quantity, parameters, notes, rating`
example:
`{ "id": 3, "name": "Dark Depths", "teaid": 1, "quantity": 10,"parameters": "Very hot fresh boiled water, 150ml yixing clay teapot. Steeps starting at 5 seconds. Kept the teapot as hot as possible", "notes": "Dark, viscous steeps that lasted for a long time. Almost had the consistency of coffee. Very long lasting flavours. Got maybe 20 steeps out of it.", "rating": 5}`

## /GET Collection/:id

/collection/:id
This endpoint will get the collection with the corresponding id.

## /GET Tea/:id

/tea/:id
This endpoint will get the tea with the corresponding id.

## /GET Session/:id

/session/:id
This endpoint will get the session with the corresponding id.

## /POST Collection

/collection
This endpoint will post a new collection to the database.

## /POST Tea

/tea
This endpoint will post a new tea to the database.

## /POST Session

/session
This endpoint will post a new session to the database.

## /DELETE Collection/:id

/collection/:id
This endpoint will delete the collection with the corresponding id.

## /DELETE Tea/:id

/tea/:id
This endpoint will delete the tea with the corresponding id.

## /DELETE Session/:id

/session/:id
This endpoint will delete the session with the corresponding id.


## /PATCH Tea/:id

/tea/:id
This endpoint will patch the tea with the corresponding id.

## /PATCH Session/:id

/session/:id
This endpoint will patch the session with the corresponding id.

## Tech Used
This application was made using:
React, Redux, Express, Node, PostgreSQL, JSX, CSS
