export default (app) => {
  app.post(
    `/tenant/:tenantId/prodline`,
    require('./prodlineCreate').default,
  );
  app.put(
    `/tenant/:tenantId/prodline/:id`,
    require('./prodlineUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/prodline/import`,
    require('./prodlineImport').default,
  );
  app.delete(
    `/tenant/:tenantId/prodline`,
    require('./prodlineDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/prodline/autocomplete`,
    require('./prodlineAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/prodline`,
    require('./prodlineList').default,
  );
  app.get(
    `/tenant/:tenantId/prodline/:id`,
    require('./prodlineFind').default,
  );
};