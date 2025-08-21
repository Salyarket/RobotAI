/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819309504")

  // remove field
  collection.fields.removeById("text2324571881")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819309504")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2324571881",
    "max": 0,
    "min": 0,
    "name": "conversation",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
