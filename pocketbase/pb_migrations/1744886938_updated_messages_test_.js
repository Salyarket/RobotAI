/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819309504")

  // update collection data
  unmarshal({
    "name": "messages_pb"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819309504")

  // update collection data
  unmarshal({
    "name": "messages_test"
  }, collection)

  return app.save(collection)
})
