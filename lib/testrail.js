'use strict';

var Client = require('node-rest-client').Client,
    q = require('q'),
    TESTRAIL_URL = process.env["TESTRAIL_URL"],
    AUTH = {user: process.env["TESTRAIL_USER"], password: process.env["TESTRAIL_PASSWORD"]},
    DEFAULT_PROJECT_ID = process.env["TESTRAIL_DEFAULT_PROJECT"],
    _ = require('lodash'),
    client = new Client(AUTH),
    accept = {
        headers:{"Content-Type":"application/json"}
    },

    getPromise = function(url) {
        var deferred = q.defer();
        console.log(TESTRAIL_URL + url);
        client.get(TESTRAIL_URL + url, accept, function(data, response){
            var parsed = JSON.parse(data);
            if (response.statusCode === 200) { deferred.resolve(parsed); }
            else { console.log(data);
                deferred.reject("received non-200 response"); }
        });
        return deferred.promise;
    },
    postPromise = function(url, params){
        var deferred = q.defer(),
        postArgs = _.merge(params, accept);
        console.log(TESTRAIL_URL + url, postArgs);
        client.post(TESTRAIL_URL + url, postArgs, function(data, response){
            var parsed = JSON.parse(data);
            if (response.statusCode === 200) { deferred.resolve(parsed); }
            else { deferred.reject("received non-200 response"); }
        });
        return deferred.promise;
    };

//PROJECT API CALLS
function getProject(projectId) {
    return getPromise('get_project/' + projectId);
};

function addProject(params) {
    return postPromise('add_project', params);
};

//SUITE API CALLS
function getSuite(suiteId) {
    return getPromise('get_suite/' + suiteId);
};

function getSuites(projectId){
    return getPromise('get_suites/' + projectId);
};

function addSuite(params){
    return postPromise('add_suite/' + projectId, params);
};

//CASE API CALLS
function getCase(caseId){
    return getPromise('get_case/' + caseId);
};

function getCases(projectId, suiteId, sectionId){
    if ((typeof(suiteID) !== 'undefined') && (typeof(sectionId) !== 'undefined')){
        return getPromise('get_cases/' + projectId + '&suite_id=' + suiteId + '&section_id' + sectionId);
    }
    else {
        return getPromise('get_cases/' + projectId + '&suite_id=' + suiteId);
    }
};

function addCase(sectionId, params){
    return postPromise('add_case/' + sectionId, params);
};

//RESULT API CALLS
function addResultForCase(runId,caseId){
    return postPromise('add_result_for_case/' + runId + '/' + caseId, params);
};

//RUN API CALLS
function getRuns(projectId) {
    return getPromise('get_runs/' + projectId);
};

function addRun(projectId, params) {
    return postPromise('add_run/' + projectId, params)
};

function closeRun(runId) {
    return postPromise('close_run/' + runId);
};

//PLAN API CALLS
function getPlans(projectId){
    return getPromise('get_plans/' + projectId);

};

function getPlan(planId){
    return getPromise('get_plan/' + planId);
};

function addPlan(projectId, params){
    return postPromise('add_plan/' + projectId, params);
};

function addPlanEntry(planId, params){
    return postPromise('add_plan_entry/' + planId, params);

};

//SECTION API CALLS
function getSections(projectId = DEFAULT_PROJECT_ID, suiteId){
    return getPromise('get_sections/' + projectId + '&suite_id=' + suiteId)
};

function addSection(projectId = DEFAULT_PROJECT_ID, params){
    return postPromise('add_section/' + projectId, params)
};

//COMPOUND API CALLS

function findTestPlan(planName, project){
    return getPlans(project).then(function(plans){
       return _.find(plans, function(plan){ return plan.name === planName; });
    });
};

function getAllTestCases(projectId){
    var cases = [];
    var deferred = q.defer();
    getSuites(projectId).then(function(suites){
        return q.all(_.map(suites, function(suite){
            return getCases(projectId, suite.id).then(function(currentCases){
                _.forEach(currentCases, function(kase){
                    cases.push(kase);
                });
            });
        }));
    }).then(function() {
           deferred.resolve(cases)
        });
    return deferred.promise;
};

function findTestCase(caseName, project){
    return getAllTestCases(project).then(function(cases){
        return _.find(cases, function(kase){ return kase.custom_steps === caseName; });
    });
};

function findSuite(suiteName){
    return getSuites(DEFAULT_PROJECT_ID).then(function(suites){
        return _.find(suites, function(suite){
           return suite.name === suiteName;
        });
    });
}

module.exports = {
    getProject: getProject,
    addProject: addProject,
    getSuite: getSuite,
    getSuites: getSuites,
    addSuite: addSuite,
    getCase: getCase,
    getCases: getCases,
    addCase: addCase,
    addResultForCase: addResultForCase,
    getRuns: getRuns,
    addRun: addRun,
    closeRun: closeRun,
    getPlans: getPlans,
    addPlan: addPlan,
    addPlanEntries: addPlanEntry,
    getSections: getSections,
    addSection: addSection,
    getPlan: getPlan,
    getAllTestCases: getAllTestCases,
    findTestCase: findTestCase,
    findSuite: findSuite
}