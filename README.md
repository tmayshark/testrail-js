testrail-js
===========

Incomplete js wrapper for testrail v2 api.

Provides the minimum API calls necessary to log results in an existing project for basic workflows. A later version of
this package will be complete with the testrail API.

Returns results of all calls as promises, using q.

Expects the following env vars to be set:
TESTRAIL_URL = http://some/server/path/testrail/api/v2/
TESTRAIL_USER = username for a user with permissions to add/edit/delete results, suites, cases, projects
TESTRAIL_PASSWORD = user's password
TESTRAIL_DEFAULT_PROJECT = numeric ID of project to use by default

