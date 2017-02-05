define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Модуль с ф-циями анимирования
     *
     * @module
     */
    ;
    var check;
    (function (check) {
        /**ф-ция для подсчёта расстояний до объектов
         * @param pointOld предыдущая точка
         * @param pointCur текущая точка
         * @param pointMinus положение отрицательной энергии
         * @param pointNeedEnergy точка приёмника
         * @returns listDist расстояние до предыдущей точки,расстояние до отрицательной энергии,расстояние до приёмника
         */
        function info(pointOld, pointCur, pointMinus, pointNeedEnergy) {
            //расстояние между двумя точками (текущей и предыдущей)
            var DistanceOtC = 0;
            //расстояние между двумя точками (текущей и отрицательной энергией)
            var DistanceOtM = 0;
            //расстояние между двумя точками (текущей и приёмником)
            var DistanceOtG = 0;
            //массив, куда впишем три расстояния DistanceOtC,DistanceOtM,DistanceOtG
            var listDist = [0, 0, 0];
            //разницы координат между текущей точкой и предыдущей
            var deltaXOtC = Math.round(Math.abs(pointOld.x - pointCur.x));
            var deltaYOtC = Math.round(Math.abs(pointOld.y - pointCur.y));
            var sumsqrt = deltaYOtC * deltaYOtC + deltaXOtC * deltaXOtC;
            DistanceOtC = Math.round(Math.sqrt(sumsqrt));
            listDist[0] = DistanceOtC;
            //разницы координат между текущей точкой и отрцательной энегией
            var deltaXOtM = Math.round(Math.abs(pointMinus.x - pointCur.x));
            var deltaYOtM = Math.round(Math.abs(pointMinus.y - pointCur.y));
            DistanceOtM = Math.round(Math.sqrt(deltaYOtM * deltaYOtM + deltaXOtM * deltaXOtM));
            listDist[1] = DistanceOtM;
            //разницы координат между текущей точкой и приёмников
            var deltaXOtG = Math.round(Math.abs(pointNeedEnergy.x - pointCur.x));
            var deltaYOtG = Math.round(Math.abs(pointNeedEnergy.y - pointCur.y));
            DistanceOtG = Math.round(Math.sqrt(deltaYOtG * deltaYOtG + deltaXOtG * deltaXOtG));
            listDist[2] = DistanceOtG;
            return listDist;
        }
        check.info = info;
        /** Сопротивление холста мешает переносить энергию без потерь - ф-ция расчитывает потери
         * @param dist значение расстояния между точками
         * @param k коэффициент ширины экрана
         * @returns x возвращает коэффцициент сопротивления
         */
        function take_Rkoef(dist, k) {
            //Точки фиксации
            var pA = 90 * k;
            var pB = 170 * k;
            var pC = 205 * k;
            var pD = 250 * k;
            var x = 0;
            var d = parseFloat(dist.toFixed(1));
            if (d > pD)
                return x;
            if ((d >= 0) && (d <= pA))
                x = (1 - d / 1500 / k);
            if (d > pA && d <= pB)
                x = (1.15 - d / 375 / k);
            if (d > pB && d <= pC)
                x = (2.25 - d / 110 / k);
            if (d > pC && d <= pD)
                x = (1.25 - d / 250 / k);
            return x.toFixed(4);
        }
        check.take_Rkoef = take_Rkoef;
        /** Сопротивление холста мешает переносить энергию без потерь - ф-ция расчитывает потери
         * @param dist значение расстояния между точками
         * @param k коэффициент ширины экрана
         * @returns x возвращает коэффцициент сопротивления
         */
        function take_RkoefToEnd(dist, k) {
            //Точки фиксации
            var pA = 90 * k;
            var pB = 100 * k;
            var pC = 110 * k;
            var pD = 120 * k;
            var x = 0;
            var d = dist.toFixed(1);
            if (d > pD)
                return x;
            if ((d >= 0) && (d <= pA))
                x = (1 - d / 1500 / k);
            if (d > pA && d <= pB)
                x = (1.15 - d / 375 / k);
            if (d > pB && d <= pC)
                x = (1.20 - d / 310 / k);
            if (d > pC && d <= pD)
                x = (1.25 - d / 250 / k);
            return x.toFixed(4);
        }
        check.take_RkoefToEnd = take_RkoefToEnd;
        /**Расчёт эффекта отрицательной энергии
         * @param dist значение расстояния между точками
         * @param k коэффициент ширины экрана
         * @param atom минимальная посылка
         * @returns x возвращает коэффцициент сопротивления
         */
        function take_koefToMinusEnergy(dist, k, atom) {
            //Точки фиксации
            var pA = 40 * k;
            var pB = 80 * k;
            var pC = 100 * k;
            var pD = 140 * k;
            var x = 0;
            var d = dist.toFixed(1);
            if (d > pD)
                return x;
            if ((d >= 0) && (d <= pA))
                x = 0.2 * atom;
            if (d > pA && d <= pB)
                x = 0.1 * atom;
            if (d > pB && d <= pC)
                x = 0.04 * atom;
            if (d > pC && d <= pD)
                x = 0.00 * atom;
            return x.toFixed(4);
        }
        check.take_koefToMinusEnergy = take_koefToMinusEnergy;
        /**Провести проверку на наличие меньших значений, чем атомарные, в каждой точке
         * @param atomMail атомарное значение энергитической посылки
         * @param index - последний занятый элемент списка объектов игры
         * @returns boolean - отсутствие значений, меньших атомарных в каждой точке
         */
        function forAllIndexGoIf(atomMail, index) {
            var i = index;
            for (i; i >= 0; i -= 3) {
                //возьмём текст точки
                var textById = document.getElementById("t" + i / 3).innerHTML;
                //получим значение, хранящееся внутри
                var valueTextById = parseFloat(textById);
                if (valueTextById > atomMail)
                    return false;
            }
            return true;
        }
        check.forAllIndexGoIf = forAllIndexGoIf;
        /**Проверка на конец игры
         * @param atomMail атомарное значение энергитической посылки
         * @param index последний занятый элемент списка объектов игры
         * @returns boolean закончена ли игра
         */
        function isFinished(atomMail, index, speed) {
            if (speed === void 0) { speed = 1000; }
            //проверяем все точки, если в каждой точке значение меньше атомарного, игра закончена
            var boolValue = forAllIndexGoIf(atomMail, index);
            var timerId = setTimeout(function justf() {
                boolValue = forAllIndexGoIf(atomMail, index);
            }, speed);
            return boolValue;
        }
        check.isFinished = isFinished;
        /**
         * Проверка на победу/поражение
         * @returns boolean победа или поражение
         */
        function isWin() {
            //возьмём текст точки
            var textById = document.getElementById('container').innerHTML;
            //получим значение, хранящееся внутри
            var valueTextById = parseFloat(textById);
            if (valueTextById > 65) {
                alert("Победа!");
                return true;
            }
            alert("Вы проиграли!");
            return false;
        }
        check.isWin = isWin;
    })(check || (check = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = check;
});
//# sourceMappingURL=myChecks.js.map