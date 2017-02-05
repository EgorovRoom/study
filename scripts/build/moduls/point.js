define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Модуль класса точек двухмерной плоскости
     *
     * @module
     */
    ;
    /**
     * Класс точек двухмерной плоскости
     */
    var Point = (function () {
        /**
         * Класс точек двухмерной плоскости
         *
         * @param x Координата по оси абсцисс
         * @param y Координата по оси ординат
         */
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Point;
});
//# sourceMappingURL=point.js.map