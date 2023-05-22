const models = [
  require('./tenant').default,
  require('./auditLog').default,
  require('./settings').default,
  require('./user').default,
  require('./produr').default,
  require('./unit').default,
  require('./family').default,
  require('./prodline').default,
  require('./zap').default,
  require('./linedoc').default,
  require('./config').default,
  require('./configTable').default,
  require('./prodtype').default,
  require('./product').default,
  require('./pRODUCTline').default,
  require('./pRODUCTunit').default,
  require('./planning').default,
];

export default function init(database) {
  for (let model of models) {
    model(database);
  }

  return database;
}

export async function createCollections(database) {
  for (let model of models) {
    await model(database).createCollection();
  }

  return database;
}
