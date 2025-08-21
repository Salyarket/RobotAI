/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819309504")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2451084799",
    "hidden": false,
    "id": "relation2324571881",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "conversation",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819309504")

  // remove field
  collection.fields.removeById("relation2324571881")

  return app.save(collection)
})
