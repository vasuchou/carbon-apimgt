/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Utility class for Publisher application
 */
class Utils {

    /**
     * Get JavaScript accessible cookies saved in browser, by giving the cooke name.
     * @param {String} name : Name of the cookie which need to be retrived
     * @returns {String|null} : If found a cookie with given name , return its value,Else null value is returned
     */
    static getCookie(name) {
        //Append environment name to cookie
        let environmentName = "_" + Utils.getEnvironment().label;

        let pairs = document.cookie.split(";");
        let cookie = null;
        for (let pair of pairs) {
            pair = pair.split("=");
            let cookie_name = pair[0].trim();
            let value = encodeURIComponent(pair[1]);
            if (cookie_name === name + environmentName) {
                cookie = value;
                break;
            }
        }
        return cookie;
    }

    /**
     * Delete a browser cookie given its name
     * @param {String} name : Name of the cookie which need to be deleted
     */
    static delete_cookie(name, path) {
        //Environment name is appended to the cookie name
        document.cookie = `${name}_${Utils.getEnvironment().label}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }

    /**
     * Set a cookie with given name and value assigned to it. Cookies can be only set to the same origin,
     * which the script is running
     * @param {String} name : Name of the cookie which need to be set
     * @param {String} value : Value of the cookie, expect it to be URLEncoded
     * @param {number} validityPeriod :  (Optional) Validity period of the cookie in seconds
     * @param {String} path : Path which needs to set the given cookie
     * @param {boolean} secured : secured parameter is set
     */
    static setCookie(name, value, validityPeriod, path = "/", secured = true) {
        let expiresDirective = "";
        const securedDirective = secured ? "; Secure" : "";
        if (validityPeriod) {
            const date = new Date();
            date.setTime(date.getTime() + validityPeriod * 1000);
            expiresDirective = "; expires=" + date.toUTCString();
        }

        document.cookie = `${name}_${Utils.getEnvironment().label}=${value}; path=${path}${expiresDirective}${securedDirective}`;
    }

    /**
     * Given an object returns whether the object is empty or not
     * @param {Object} object : Any JSON object
     * @returns {boolean}
     */
    static isEmptyObject(object) {
        return Object.keys(object).length === 0 && object.constructor === Object
    }

    static getEnvironment() {
        let environmentData = localStorage.getItem(Utils.CONST.LOCALSTORAGE_ENVIRONMENT);
        if (!environmentData) {
            return Utils.CONST.DEFAULT_ENVIRONMENT;
        }

        return JSON.parse(environmentData);
    }

    static setEnvironment(environment) {
        if(!environment){
            environment = Utils.CONST.DEFAULT_ENVIRONMENT;
        }

        if(!environment.host){
            environment.host = location.host;
        }
        localStorage.setItem(Utils.CONST.LOCALSTORAGE_ENVIRONMENT, JSON.stringify(environment));
    }

    static getAppLoginURL(){
        return Utils.CONST.PROTOCOL + Utils.getEnvironment().host + Utils.CONST.LOGIN + Utils.CONST.CONTEXT_PATH;
    }

    static getAppLogoutURL(){
        return Utils.CONST.PROTOCOL + Utils.getEnvironment().host + Utils.CONST.LOGOUT + Utils.CONST.CONTEXT_PATH;
    }

    static getLoginTokenPath(){
        return Utils.CONST.PROTOCOL + Utils.getEnvironment().host + Utils.CONST.LOGIN_TOKEN_PATH + Utils.CONST.CONTEXT_PATH;
    }

    static getSwaggerURL() {
        return "https://" + Utils.getEnvironment().host + Utils.CONST.SWAGGER_YAML;
    }
}

Utils.CONST = {
    LOCALSTORAGE_ENVIRONMENT: 'environment',
    DEFAULT_ENVIRONMENT: {label: 'Default', host: location.host, loginTokenPath: '/login/token'},
    LOGIN: '/login/login',
    LOGOUT: '/login/logout',
    LOGIN_TOKEN_PATH: '/login/token',
    SWAGGER_YAML: '/api/am/publisher/v1.0/apis/swagger.yaml',
    PROTOCOL: 'https://',
    CONTEXT_PATH: '/publisher'
};

export default Utils;