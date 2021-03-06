(function (graph) {

        function require(file) {
            function absRequire(relpath) {
                return require(graph[file].deps[relpath])
            }
            var exports = {};
            (function (require, exports, code) {
                eval(code)
            })(absRequire, exports, graph[file].code)
            return exports
        }
        require('./src/index.js')
    })({
    "./src/index.js": {
        "code": "\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nvar _minus = _interopRequireDefault(require(\"./minus.js\"));\n\nvar _test = _interopRequireDefault(require(\"./lib/test.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar num = (0, _add[\"default\"])(12, 21);\nvar num2 = (0, _minus[\"default\"])(21, 1);\n(0, _test[\"default\"])();\nconsole.log(num);\nconsole.log(num2);",
        "deps": {
            "./add.js": "./src\\add.js",
            "./minus.js": "./src\\minus.js",
            "./lib/test.js": "./src\\lib\\test.js"
        }
    },
    "./src\\add.js": {
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = _default;\n\nfunction _default(a, b) {\n  return a + b;\n}",
        "deps": {}
    },
    "./src\\minus.js": {
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = _default;\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nfunction _default(a, b) {\n  return a - b;\n}\n\nconsole.log(2222, (0, _add[\"default\"])(1, 2));",
        "deps": {
            "./add.js": "./src\\add.js"
        }
    },
    "./src\\lib\\test.js": {
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = _default;\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nfunction _default() {\n  console.log('test');\n}\n\n(0, _add[\"default\"])();",
        "deps": {
            "./add.js": "./src\\lib\\add.js"
        }
    },
    "./src\\lib\\add.js": {
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = _default;\n\nfunction _default() {\n  console.log('this is add in lib ');\n}",
        "deps": {}
    }
})