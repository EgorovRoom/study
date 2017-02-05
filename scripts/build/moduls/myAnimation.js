define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Модуль с ф-циями анимирования
     *
     */
    ;
    var anim;
    (function (anim) {
        /**Анимация предупреждения
         * @param paper - холст Рафаэля
         * @param koef - коэффициент соотношения ширины экрана
         * @param point - координата точки
         * @param speed - скорость посылки
         * @returns boolean вернёт true, когда анимация завершится
         */
        function animateWarning(paper, koef, point, speed) {
            if (speed === void 0) { speed = 1000; }
            var circleMail = paper.circle(point.x, point.y, 12 * koef).attr({ stroke: "#aa0033" });
            circleMail.animate({
                //насколько изменится
                r: 0
            }, speed, function () { circleMail.remove(); });
            return true;
        }
        anim.animateWarning = animateWarning;
        /** Запускает посылку из точки в точку
         * @param paper - холст Рафаэля
         * @param koef - коэффициент соотношения ширины экрана
         * @param prefPointXY - координаты предыдущей точки
         * @param curPointXY - координаты текущей точки
         * @param speed - скорость движения частиц
         * @return возврат true, когда анимация завершится
         */
        function startParcel(paper, koef, prefPointXY, curPointXY, speed) {
            if (speed === void 0) { speed = 1000; }
            var circleMail = paper.circle(prefPointXY.x, prefPointXY.y, 1 + 4 * koef).attr({ stroke: "#00aa77", fill: "#00aa77" });
            //пока этот параметр false, не можем выйти из ф-ции
            circleMail.animate({
                //насколько изменится
                cx: curPointXY.x,
                cy: curPointXY.y,
            }, speed, function () { circleMail.remove(); });
            return true;
        }
        anim.startParcel = startParcel;
        ;
    })(anim || (anim = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = anim;
});
//# sourceMappingURL=myAnimation.js.map