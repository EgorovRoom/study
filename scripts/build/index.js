define(["require", "exports", "./moduls/myAnimation", "./moduls/myChecks", "./moduls/point"], function (require, exports, myAnimation_1, myChecks_1, point_1) {
    "use strict";
    /**запуск игры*/
    function game() {
        /**коэффициент увеличения размера*/
        var koef = screen.width / 1100;
        /**Базовые значения ширины и высоты изображений положительной энергии и приёмника*/
        var baseWidthEnergy = 73 * koef, baseHeightEnergy = 66 * koef;
        /**Половины базовых значений ширины и высоты изображений положительной энергии и приёмника*/
        var HalfBaseWidthEnergy = baseWidthEnergy / 2, HalfBaseHeightEnergy = baseHeightEnergy / 2;
        /**Значение ширины и высоты изображения отрицательной энергии (не видно на экране)*/
        var minusWidthEnergy = 40, minusHeightEnergy = 36;
        /**взять высоту текущего экрана браузера пользователя*/
        var h = offsetPosition(document.getElementById('main')) + 5;
        /**желаемый размер поля*/
        var widthSizePaper = document.documentElement.clientWidth / 2, heightSizePaper = ((screen.height - h) / 2.5);
        /**вспомогательные расчёты */
        var addTrOST = document.getElementById('addTr').offsetLeft, text0OST = document.getElementById('text0').offsetLeft + 200;
        /**взять ширину текущего экрана браузера пользователя*/
        var w = (addTrOST > text0OST)
            ? addTrOST
            : text0OST;
        /**холст */
        var paper = Raphael(w, h, widthSizePaper, heightSizePaper);
        /**границы поля */
        var myfill = paper.rect(0, 0, widthSizePaper, heightSizePaper).attr('stroke', '#000000');
        //Расчитаем положения, куда поместить элементы игры:
        /**положение от центра по вертикали с учётом высоты элементов*/
        var centerHeightPaper = heightSizePaper / 2 - HalfBaseHeightEnergy;
        /**Сдвиг от края для положительной энергии и приёмника*/
        var LeftShift = 10, RightShift = widthSizePaper - 10 - baseWidthEnergy;
        //помещаем исходные элементы на поле
        /**картинка положительной энергии*/
        var svgUpEnergy = paper.image('svg/upEnergy.svg', LeftShift, centerHeightPaper, baseWidthEnergy, baseHeightEnergy);
        /**картинка приёмника энергии*/
        var svgNeedEnergy = paper.image('svg/needEnergy.svg', RightShift, centerHeightPaper, baseWidthEnergy, baseHeightEnergy);
        /**объект, содержащий все точки игры*/
        var listAllPoint = new Object();
        /**центр положительной энергии по х*/
        var CenterUpEnergyWidth = LeftShift + HalfBaseWidthEnergy;
        /**центр приёмника энергии по х*/
        var CenterNeedEnergyWidth = RightShift + HalfBaseWidthEnergy;
        /**центр положительной энергии по у*/
        var CenterUpEnergyHeight = centerHeightPaper + HalfBaseHeightEnergy;
        /**центр приёмника энергии по у*/
        var CenterNeedEnergyHeight = centerHeightPaper + HalfBaseHeightEnergy;
        /**центр положительной энергии */
        var CenterPlusEnergy = new point_1.default(CenterUpEnergyWidth, CenterUpEnergyHeight);
        /**центр приёмника */
        var CenterContainer = new point_1.default(CenterNeedEnergyWidth, CenterNeedEnergyHeight);
        /**координаты центра отрицательной энергии*/
        var centerMinusEnergy = randomPoint(widthSizePaper, heightSizePaper);
        /**картинка отрицательной энергии*/
        //const   svgDownEnergy = paper.image("svg/downEnergy.svg",centerMinusEnergy[0],centerMinusEnergy[1],minusWidthEnergy,minusHeightEnergy);
        //добавим в объект listAllPoint исходные элементы
        listAllPoint[0] = CenterPlusEnergy;
        listAllPoint.end = CenterContainer;
        /**текст под картинкой положительной энергии*/
        var textUpEnergy = paper.text(CenterUpEnergyWidth, centerHeightPaper + baseHeightEnergy + 10 * koef, '+ энергия').attr({ "font-size": 10 * koef });
        /**текст под картинкой приёмника*/
        var textNeedEnergy = paper.text(CenterNeedEnergyWidth, centerHeightPaper + baseHeightEnergy + 10 * koef, 'приёмник').attr({ "font-size": 10 * koef });
        document.getElementById('t0').innerHTML = '100';
        document.getElementById('container').innerHTML = '0';
        /**текущая точка*/
        var pointCur = new point_1.default(0, 0);
        /**определитель "спешащего товарища"*/
        var onlyOneClickToAddWHileNotSet = true;
        /**индекс точки и объекта на холсте Рафаэля*/
        var indexGS = 0;
        /**список объектов на холсте Рафаэля*/
        var globalSet = [];
        /**холст для объектов Рафаэля*/
        var mySet = paper.set();
        /**
        * Объект имеющий
        ключ: index,
        value: array - массив дистанций
            [0] - расстояние до предыдущей точки;
            [1] - расстояние до отрицательной энергии;
            [2] - расстояние до приёмника;
        * в ListDistance[0] - забит нулями
        */
        var listDistance = new Object();
        listDistance[0] = [0, 0, 0];
        /**опишем, как будут перемещаться объекты
         * lx изменение положения мыши в данный момент времени по х
         * ly изменение положения мыши в данный момент времени по х
         * ox положение мыши в момент захвата по х
         * oy положение мыши в момент захвата по y
         */
        Raphael.st.draggable = function () {
            var me = this, lx = 0, ly = 0, ox = 0, oy = 0, moveFnc = function (dx, dy) {
                lx = dx + ox; // изменяем значение трансформации по x
                ly = dy + oy; // делаем тоже самое для y
                me.transform('t' + lx + ',' + ly);
            }, startFnc = function () { }, endFnc = function () {
                ox = lx;
                oy = ly;
                pointCur.x = ox;
                pointCur.y = oy;
            };
            this.drag(moveFnc, startFnc, endFnc);
        };
        //Кнопка добавления транспорта
        var buttonAddTr = document.getElementById('addTr');
        //Кнопка установки транспорта
        var buttonSetTr = document.getElementById('setTr');
        //Кнопка удаления последнего транспорта
        var buttonDelTr = document.getElementById('delTr');
        //Кнопка перезапуска игры
        var buttonReplay = document.getElementById('replay');
        //Описание событий
        //появится кружок(транспорт), способный к перемещению
        buttonAddTr.onclick = function (event) {
            if (indexGS < 60) {
                if (onlyOneClickToAddWHileNotSet === true) {
                    onlyOneClickToAddWHileNotSet = false;
                    var circleP = paper.circle(widthSizePaper / 2, heightSizePaper / 2, 12 * koef).attr('fill', '#f00000');
                    mySet.push(circleP);
                    mySet.draggable();
                }
            }
        };
        //установим кружок(транспорт), чтобы связать с предыдущей точкой
        buttonSetTr.onclick = function (event) {
            if (onlyOneClickToAddWHileNotSet === false) {
                onlyOneClickToAddWHileNotSet = true;
                //взять координаты текущего расположения транспорта
                var pointOld = new point_1.default(listAllPoint[indexGS / 3].x, listAllPoint[indexGS / 3].y);
                pointCur.x += widthSizePaper / 2;
                pointCur.y += heightSizePaper / 2;
                //нарисовать транспорт
                globalSet[indexGS] = paper.circle(pointCur.x, pointCur.y, 12 * koef).attr('fill', '#000000');
                //переводим индекс к следующему объекту
                indexGS++;
                //нарисовать линию от точки к новому кругу
                globalSet[indexGS] = paper.path("M " + pointOld.x + " " + pointOld.y + " L " + pointCur.x + " " + pointCur.y).attr({ opacity: 0.2 });
                indexGS++;
                //написать текст на новом круге
                globalSet[indexGS] = paper.text(pointCur.x, pointCur.y + 17 * koef, "T" + (indexGS + 1) / 3).attr({ "font-size": 10 * koef });
                indexGS++;
                document.getElementById("t" + indexGS / 3).innerHTML = '0';
                document.getElementById("text" + indexGS / 3).innerHTML = 'T' + indexGS / 3;
                listDistance[indexGS / 3] = myChecks_1.default.info(pointOld, pointCur, centerMinusEnergy, CenterContainer);
                //отчистим кружок из канваса mySet
                mySet.remove();
                //добавим точку в список точек (indexGS всегда кратен 3 здесь)
                listAllPoint[indexGS / 3] = pointCur;
                //назначить текущей точке значение 0;
                pointCur = new point_1.default(0, 0);
            }
        };
        //удалим транспорт
        buttonDelTr.onclick = function (event) {
            if (indexGS > 0) {
                globalSet[indexGS - 1].remove();
                globalSet[indexGS - 2].remove();
                globalSet[indexGS - 3].remove();
                document.getElementById("t" + indexGS / 3).innerHTML = '';
                document.getElementById("text" + indexGS / 3).innerHTML = '';
                //удалим из списка точек последнюю точку
                delete listAllPoint[indexGS / 3];
                delete listDistance[indexGS / 3];
                indexGS -= 3;
            }
        };
        //атомарный размер посылки
        var atom = 1;
        //скорость посылки между транспортами
        var speed = 1000;
        //replay
        buttonReplay.onclick = function (event) {
            //just f5
        };
        //отправка посылок
        var timerId = setTimeout(function tick() {
            goAllParcel(paper, koef, indexGS, listAllPoint, listDistance, atom, speed);
            timerId = setTimeout(tick, speed / 2);
        }, speed * 3);
        //проверка на завершённость игры
        var timerEnd = setTimeout(function tick() {
            if (myChecks_1.default.isFinished(atom, indexGS, speed * 3) === true) {
                if (myChecks_1.default.isWin() === true) {
                }
            }
            else {
                timerEnd = setTimeout(tick, speed * 5);
            }
        }, speed * 5);
    }
    /**Проверка на передачу приёмнику энергии
     * @param paper - холст Рафаэля
     * @param koef - коэффициент соотношения ширины экрана
     * @param index - последний занятый элемент списка объектов игры
     * @param listAllPoint - объект, содержащий все точки в игре
     * @param listDistance - три дистанции до +,-,0 E
     * @param atomMail - атомарное значение энергитической посылки
     * @param speed - скорость посылки
     */
    function CanITransferMyEnergyForContainer(paper, koef, index, listAllPoint, listDistance, atomMail, speed) {
        if (atomMail === void 0) { atomMail = 1; }
        //проверка на передачу приёмнику
        if (index >= 3) {
            //возьмём текст предыдущей точки
            var textByIdCurrent = document.getElementById("t" + index / 3).innerHTML;
            var valueTextByIdCurrent = parseFloat(textByIdCurrent);
            //если есть что послать
            if (valueTextByIdCurrent - atomMail >= 0) {
                var textByIdContainer = document.getElementById('container').innerHTML;
                var valueTextByIdContainer = parseFloat(textByIdContainer);
                var distanceToContainer = listDistance[index / 3];
                var resistance = myChecks_1.default.take_Rkoef(distanceToContainer[2], koef);
                //если дистанция позволительная, то передать
                if (resistance > 0) {
                    //когда проиграется анимация - запустить тело if
                    if (myAnimation_1.default.startParcel(paper, koef, listAllPoint[index / 3], listAllPoint.end, speed * 2) === true) {
                        textByIdCurrent = document.getElementById("t" + index / 3).innerHTML = (valueTextByIdCurrent - atomMail).toFixed(4);
                        textByIdContainer = document.getElementById('container').innerHTML = (valueTextByIdContainer + atomMail * (resistance)).toFixed(4);
                    }
                }
            }
        }
        return true;
    }
    /**Проверка на передачу энергии транспорту
     * @param paper - холст Рафаэля
     * @param koef - коэффициент соотношения ширины экрана
     * @param i - текущий элемент списка объектов игры
     * @param listAllPoint - объект, содержащий все точки в игре
     * @param listDistance - три дистанции до +,-,0 E
     * @param atomMail - атомарное значение энергитической посылки
     * @returns valueTextByIdCur значение текста текущей точки
     */
    function CanITransferMyEnergyForNextTransport(paper, koef, i, listAllPoint, listDistance, atomMail) {
        if (atomMail === void 0) { atomMail = 1; }
        //возьмём предыдущую точку
        var prefPoint = listAllPoint[i / 3 - 1];
        //возьмём текущую точку
        var curPoint = listAllPoint[i / 3];
        //возьмём текст предыдущей точки
        var textByIdOld = document.getElementById("t" + (i / 3 - 1)).innerHTML;
        var valueTextByIdOld = parseFloat(textByIdOld);
        //снимаем значение текущей точки
        var textByIdCur = document.getElementById("t" + i / 3).innerHTML;
        var valueTextByIdCur = parseFloat(textByIdCur);
        //есть значение отличное от нуля у предыдущей точки, то делаем
        if (valueTextByIdOld - atomMail >= 0) {
            //когда посылка будет доставлена
            if (myAnimation_1.default.startParcel(paper, koef, prefPoint, curPoint) === true) {
                document.getElementById("t" + (i / 3 - 1)).innerHTML = (valueTextByIdOld - atomMail).toFixed(4);
                //формируем коэффициент сопротивления
                var distance = listDistance[i / 3];
                var resistance = myChecks_1.default.take_Rkoef(distance[0], koef);
                textByIdCur = document.getElementById("t" + i / 3).innerHTML = (valueTextByIdCur + atomMail * (resistance)).toFixed(4);
                //изменяем значение value текущей точки
                valueTextByIdCur = parseFloat(textByIdCur);
            }
        }
        return valueTextByIdCur;
    }
    /**отток энергии для текущей точки
     * @param paper - холст Рафаэля
     * @param koef - коэффициент соотношения ширины экрана
     * @param i - текущий элемент списка объектов игры
     * @param listAllPoint - объект, содержащий все точки в игре
     * @param listDistance - три дистанции до +,-,0 E
     * @param valueTextByIdCur значение текста текущей точки
     * @param atomMail - атомарное значение энергитической посылки
     * @param speed - скорость посылки
     */
    function drainEnergy(paper, koef, i, listAllPoint, listDistance, valueTextByIdCur, atomMail, speed) {
        if (speed === void 0) { speed = 1000; }
        var distanceToMinus = listDistance[i / 3];
        var leavingEnergy = myChecks_1.default.take_koefToMinusEnergy(distanceToMinus[1], koef, atomMail);
        if (leavingEnergy >= 0.1 * atomMail) {
            myAnimation_1.default.animateWarning(paper, koef, listAllPoint[i / 3], speed);
        }
        if (valueTextByIdCur > -0.5)
            document.getElementById("t" + i / 3).innerHTML = (valueTextByIdCur - leavingEnergy).toFixed(4);
    }
    /**
     * Запускает посылки из точки в точку
     * @param paper - холст Рафаэля
     * @param koef - коэффициент соотношения ширины экрана
     * @param index - последний занятый элемент списка объектов игры
     * @param listAllPoint - объект, содержащий все точки в игре
     * @param listDistance - три дистанции до +,-,0 E
     * @param atomMail - атомарное значение энергитической посылки
     * @param speed - скорость посылки
     */
    function goAllParcel(paper, koef, index, listAllPoint, listDistance, atomMail, speed) {
        if (atomMail === void 0) { atomMail = 1; }
        var i = index;
        for (i; i >= 3; i -= 3) {
            var value = CanITransferMyEnergyForNextTransport(paper, koef, i, listAllPoint, listDistance, atomMail);
            var valueTextByIdCur = value;
            drainEnergy(paper, koef, i, listAllPoint, listDistance, valueTextByIdCur, atomMail, speed);
        }
        CanITransferMyEnergyForContainer(paper, koef, index, listAllPoint, listDistance, atomMail, speed);
    }
    /**Случайно выбрать место для точки на середине поля
     * @param wPaper ширина поля
     * @param hPaper высота поля
     * @returns point точка
     */
    function randomPoint(wPaper, hPaper) {
        var x = Math.random() * (0.46 * wPaper) + 0.27 * wPaper, y = Math.random() * (0.8 * hPaper) + 0.1 * hPaper, point = new point_1.default(x, y);
        return point;
    }
    /**Определяет высоту от начала окна браузера до элемента
     * @param элемент из html
     * @returns offsetTop высота от начала окна браузера до необходимого элемента
     */
    function offsetPosition(element) {
        var offsetTop = 0;
        do {
            offsetTop += element.offsetTop;
        } while (element = element.offsetParent);
        return offsetTop;
    }
    /**restart game
     * @param globalSet - список предметов на холсте
     * @param index - последний занятый элемент списка объектов игры
     * @param listAllPoint - объект, содержащий все точки в игре
     * @param listDistance - три дистанции до +,-,0 E
     * @param widthSP - ширина холста
     * @param heightSP - высота холста
     * @param onlyOneClickToAddWHileNotSet - позволит не создавать одновременно два транспорта
     * @returns место точки отрицательной энергии
     */
    function restartGame(index, widthSP, heightSP, globalSet, listAllPoint, listDistance) {
        while (index >= 3) {
            globalSet[index - 1].remove();
            globalSet[index - 2].remove();
            globalSet[index - 3].remove();
            document.getElementById("t" + index / 3).innerHTML = '';
            document.getElementById("text" + index / 3).innerHTML = '';
            //удалим из списка точек последнюю точку
            delete listAllPoint[index / 3];
            delete listDistance[index / 3];
            index -= 3;
        }
        index = 0;
        document.getElementById('t0').innerHTML = '100';
        document.getElementById('container').innerHTML = '0';
        return randomPoint(widthSP, heightSP);
    }
    game();
});
//# sourceMappingURL=index.js.map