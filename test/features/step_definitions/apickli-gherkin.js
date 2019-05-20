/*
 Copyright 2017 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/* eslint new-cap: "off", no-invalid-this: "off" */

'use strict';

const prettyJson = require('prettyjson');

const stepContext = {};

const prettyPrintJson = function (json) {
    //noinspection JSAnnotator
    const output = {
        stepContext,
        testOutput: json
    };

    return prettyJson.render(output, {
        noColor: true
    });
};

const callbackWithAssertion = function (callback, assertion) {
    if (assertion.success) {
        callback();
    } else {
        callback(prettyPrintJson(assertion));
    }
};

module.exports = function () {
    this.Before(function (scenarioResult, callback) {
        // https://github.com/cucumber/cucumber-js/issues/891
        // stepContext.step = step.getName;
        // stepContext.scenario = scenario.getName;

        callback();
    });

    this.Given(/^I set (.*) header to (.*)$/, function (headerName, headerValue, callback) {
        this.apickli.addRequestHeader(headerName, headerValue);
        callback();
    });

    this.Given(/^I set cookie to (.*)$/, function (cookie, callback) {
        this.apickli.addCookie(cookie);
        callback();
    });

    this.Given(/^I set headers to$/, function (headers, callback) {
        this.apickli.setHeaders(headers.hashes());
        callback();
    });

    this.Given(/^I set body to (.*)$/, function (bodyValue, callback) {
        this.apickli.setRequestBody(bodyValue);
        callback();
    });

    this.Given(/^I pipe contents of file (.*) to body$/, function (file, callback) {
        this.apickli.pipeFileContentsToRequestBody(file, function (error) {
            if (error) {
                callback(new Error(error));
            }

            callback();
        });
    });

    this.Given(/^I set query parameters to$/, function (queryParameters, callback) {
        this.apickli.setQueryParameters(queryParameters.hashes());
        callback();
    });

    this.Given(/^I set form parameters to$/, function (formParameters, callback) {
        this.apickli.setFormParameters(formParameters.hashes());
        callback();
    });

    this.Given(/^I have basic authis.thentication credentials (.*) and (.*)$/, function (username, password, callback) {
        this.apickli.addHttpBasicAuthorizationHeader(username, password);
        callback();
    });

    this.When(/^I GET (.*)$/, function (resource, callback) {
        this.apickli.get(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }

            callback();
        });
    });

    this.When(/^I POST to (.*)$/, function (resource, callback) {
        this.apickli.post(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }

            callback();
        });
    });

    this.When(/^I PUT (.*)$/, function (resource, callback) {
        this.apickli.put(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }

            callback();
        });
    });

    this.When(/^I DELETE (.*)$/, function (resource, callback) {
        this.apickli.delete(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }

            callback();
        });
    });

    this.When(/^I PATCH (.*)$/, function (resource, callback) {
        this.apickli.patch(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }

            callback();
        });
    });

    this.When(/^I request OPTIONS for (.*)$/, function (resource, callback) {
        this.apickli.options(resource, function (error, response) {
            if (error) {
                callback(new Error(error));
            }

            callback();
        });
    });

    this.Then(/^response header (.*) should exist$/, function (header, callback) {
        const assertion = this.apickli.assertResponseContainsHeader(header);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response header (.*) should not exist$/, function (header, callback) {
        const assertion = this.apickli.assertResponseContainsHeader(header);
        assertion.success = !assertion.success;
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body should be valid (xml|json)$/, function (contentType, callback) {
        const assertion = this.apickli.assertResponseBodyContentType(contentType);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response code should be (.*)$/, function (responseCode, callback) {
        const assertion = this.apickli.assertResponseCode(responseCode);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response code should not be (.*)$/, function (responseCode, callback) {
        const assertion = this.apickli.assertResponseCode(responseCode);
        assertion.success = !assertion.success;
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response header (.*) should be (.*)$/, function (header, expression, callback) {
        const assertion = this.apickli.assertHeaderValue(header, expression);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response header (.*) should not be (.*)$/, function (header, expression, callback) {
        const assertion = this.apickli.assertHeaderValue(header, expression);
        assertion.success = !assertion.success;
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body should contain (.*)$/, function (expression, callback) {
        const assertion = this.apickli.assertResponseBodyContainsExpression(expression);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body should not contain (.*)$/, function (expression, callback) {
        const assertion = this.apickli.assertResponseBodyContainsExpression(expression);
        assertion.success = !assertion.success;
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body path (.*) should be ((?!of type).*)$/, function (path, value, callback) {
        const assertion = this.apickli.assertPathInResponseBodyMatchesExpression(path, value);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body path (.*) should not be ((?!of type).+)$/, function (path, value, callback) {
        const assertion = this.apickli.assertPathInResponseBodyMatchesExpression(path, value);
        assertion.success = !assertion.success;
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body path (.*) should be of type array$/, function (path, callback) {
        const assertion = this.apickli.assertPathIsArray(path);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body path (.*) should be of type array with length (.*)$/, function (path, length, callback) {
        const assertion = this.apickli.assertPathIsArrayWithLength(path, length);
        callbackWithAssertion(callback, assertion);
    });

    this.Then(/^response body should be valid according to schema file (.*)$/, function (schemaFile, callback) {
        this.apickli.validateResponseWithSchema(schemaFile, function (assertion) {
            callbackWithAssertion(callback, assertion);
        });
    });

    this.Then(/^response body should be valid according to openapi description (.*) in file (.*)$/, function (definitionName, swaggerSpecFile, callback) {
        this.apickli.validateResponseWithSwaggerSpecDefinition(definitionName, swaggerSpecFile, function (assertion) {
            callbackWithAssertion(callback, assertion);
        });
    });

    this.Then(/^I store the value of body path (.*) as access token$/, function (path, callback) {
        this.apickli.setAccessTokenFromResponseBodyPath(path);
        callback();
    });

    this.When(/^I set bearer token$/, function (callback) {
        this.apickli.setBearerToken();
        callback();
    });

    this.Given(/^I store the raw value (.*) as (.*) in scenario scope$/, function (value, variable, callback) {
        this.apickli.storeValueInScenarioScope(variable, value);
        callback();
    });

    this.Then(/^I store the value of response header (.*) as (.*) in global scope$/, function (headerName, variableName, callback) {
        this.apickli.storeValueOfHeaderInGlobalScope(headerName, variableName);
        callback();
    });

    this.Then(/^I store the value of body path (.*) as (.*) in global scope$/, function (path, variableName, callback) {
        this.apickli.storeValueOfResponseBodyPathInGlobalScope(path, variableName);
        callback();
    });

    this.Then(/^I store the value of response header (.*) as (.*) in scenario scope$/, function (name, variable, callback) {
        this.apickli.storeValueOfHeaderInScenarioScope(name, variable);
        callback();
    });

    this.Then(/^I store the value of body path (.*) as (.*) in scenario scope$/, function (path, variable, callback) {
        this.apickli.storeValueOfResponseBodyPathInScenarioScope(path, variable);
        callback();
    });

    this.Then(/^value of scenario variable (.*) should be (.*)$/, function (variableName, variableValue, callback) {
        if (this.apickli.assertScenarioVariableValue(variableName, variableValue)) {
            callback();
        } else {
            callback(new Error('value of variable ' + variableName + ' isn\'t equal to ' + variableValue));
        }
    });
};
