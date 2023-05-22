export default (app) => {
  app.post(
    `/tenant/:tenantId/p-r-o-d-u-c-tunit`,
    require('./pRODUCTunitCreate').default,
  );
  app.put(
    `/tenant/:tenantId/p-r-o-d-u-c-tunit/:id`,
    require('./pRODUCTunitUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/p-r-o-d-u-c-tunit/import`,
    require('./pRODUCTunitImport').default,
  );
  app.delete(
    `/tenant/:tenantId/p-r-o-d-u-c-tunit`,
    require('./pRODUCTunitDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/p-r-o-d-u-c-tunit/autocomplete`,
    require('./pRODUCTunitAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/p-r-o-d-u-c-tunit`,
    require('./pRODUCTunitList').default,
  );
  app.get(
    `/tenant/:tenantId/p-r-o-d-u-c-tunit/:id`,
    require('./pRODUCTunitFind').default,
  );
};
