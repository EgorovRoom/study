//экспортируем ф-ции анимаций и проверок
import Anim from './moduls/myAnimation';
import Check from './moduls/myChecks';
import Point from './moduls/point';
declare let Raphael: any;
/**запуск игры*/
function game():void{
    /**коэффициент увеличения размера*/
    const koef:number = screen.width/1100;
    /**Базовые значения ширины и высоты изображений положительной энергии и приёмника*/
    const   baseWidthEnergy:number = 73*koef,
            baseHeightEnergy = 66*koef;  
    /**Половины базовых значений ширины и высоты изображений положительной энергии и приёмника*/
    const   HalfBaseWidthEnergy:number = baseWidthEnergy/2,
            HalfBaseHeightEnergy = baseHeightEnergy/2;
    /**Значение ширины и высоты изображения отрицательной энергии (не видно на экране)*/
    const   minusWidthEnergy:number = 40,
            minusHeightEnergy = 36;
    /**взять высоту текущего экрана браузера пользователя*/
    const   h:number = offsetPosition(document.getElementById('main')) + 5;
    /**желаемый размер поля*/
    const   widthSizePaper:number = document.documentElement.clientWidth/2,
            heightSizePaper = ((screen.height - h)/2.5);
    /**вспомогательные расчёты */
    const   addTrOST:number = document.getElementById('addTr').offsetLeft,
            text0OST = document.getElementById('text0').offsetLeft + 200;
    /**взять ширину текущего экрана браузера пользователя*/
    const   w:number =  ( addTrOST > text0OST )
                        ? addTrOST
                        : text0OST
                        ;
    /**холст */
    const   paper = Raphael(w, h, widthSizePaper, heightSizePaper);
    /**границы поля */
    const   myfill = paper.rect(0, 0, widthSizePaper, heightSizePaper).attr('stroke', '#000000');

    //Расчитаем положения, куда поместить элементы игры:
    /**положение от центра по вертикали с учётом высоты элементов*/
    const   centerHeightPaper:number = heightSizePaper/2 - HalfBaseHeightEnergy;
    /**Сдвиг от края для положительной энергии и приёмника*/
    const   LeftShift:number = 10,
            RightShift = widthSizePaper - 10 - baseWidthEnergy;
    //помещаем исходные элементы на поле
    /**картинка положительной энергии*/
    const   svgUpEnergy = paper.image('svg/upEnergy.svg',LeftShift,centerHeightPaper,baseWidthEnergy,baseHeightEnergy);
    /**картинка приёмника энергии*/
    const   svgNeedEnergy = paper.image('svg/needEnergy.svg',RightShift,centerHeightPaper,baseWidthEnergy,baseHeightEnergy);

    /**объект, содержащий все точки игры*/
    const listAllPoint:any = new Object();

    /**центр положительной энергии по х*/
    const CenterUpEnergyWidth:number = LeftShift + HalfBaseWidthEnergy;
    /**центр приёмника энергии по х*/
    const CenterNeedEnergyWidth:number = RightShift + HalfBaseWidthEnergy;
    /**центр положительной энергии по у*/
    const CenterUpEnergyHeight:number = centerHeightPaper + HalfBaseHeightEnergy;
    /**центр приёмника энергии по у*/
    const CenterNeedEnergyHeight:number = centerHeightPaper + HalfBaseHeightEnergy;

    /**центр положительной энергии */
    const CenterPlusEnergy:Point = new Point(CenterUpEnergyWidth,CenterUpEnergyHeight);
    /**центр приёмника */
    const CenterContainer:Point = new Point(CenterNeedEnergyWidth,CenterNeedEnergyHeight);
    /**координаты центра отрицательной энергии*/
    let centerMinusEnergy:Point = randomPoint(widthSizePaper,heightSizePaper);

    /**картинка отрицательной энергии*/
    //const   svgDownEnergy = paper.image("svg/downEnergy.svg",centerMinusEnergy[0],centerMinusEnergy[1],minusWidthEnergy,minusHeightEnergy);

    //добавим в объект listAllPoint исходные элементы
    listAllPoint[0] = CenterPlusEnergy;
    listAllPoint.end = CenterContainer;

    /**текст под картинкой положительной энергии*/
    const   textUpEnergy = paper.text(CenterUpEnergyWidth,centerHeightPaper + baseHeightEnergy + 10*koef,'+ энергия').attr({ "font-size": 10*koef });
    /**текст под картинкой приёмника*/
    const   textNeedEnergy = paper.text(CenterNeedEnergyWidth,centerHeightPaper + baseHeightEnergy + 10*koef,'приёмник').attr({ "font-size": 10*koef });
    document.getElementById('t0').innerHTML='100';
    document.getElementById('container').innerHTML='0';

    /**текущая точка*/
    let pointCur:Point = new Point(0,0);
    /**определитель "спешащего товарища"*/
    let onlyOneClickToAddWHileNotSet:boolean = true;
    /**индекс точки и объекта на холсте Рафаэля*/
    let indexGS:number = 0;
    /**список объектов на холсте Рафаэля*/
    const globalSet:Array<any> = [];
    /**холст для объектов Рафаэля*/
    const mySet = paper.set();
    /**
    * Объект имеющий 
    ключ: index,
    value: array - массив дистанций
        [0] - расстояние до предыдущей точки; 
        [1] - расстояние до отрицательной энергии; 
        [2] - расстояние до приёмника;
    * в ListDistance[0] - забит нулями
    */
    const listDistance:any = new Object();
    listDistance[0] = [0,0,0];

    /**опишем, как будут перемещаться объекты
     * lx изменение положения мыши в данный момент времени по х
     * ly изменение положения мыши в данный момент времени по х
     * ox положение мыши в момент захвата по х
     * oy положение мыши в момент захвата по y
     */
    Raphael.st.draggable = function(this:any):void {
        let me = this,
            lx = 0,
            ly = 0,
            ox = 0,
            oy = 0,
            moveFnc = function(dx:number, dy:number) {
                lx = dx + ox;  // изменяем значение трансформации по x
                ly = dy + oy;  // делаем тоже самое для y
                me.transform('t' + lx + ',' + ly);
            },
            startFnc = function() {},
            endFnc = function() {
                ox = lx;
                oy = ly;
                pointCur.x = ox;
                pointCur.y = oy;
            };
        this.drag(moveFnc, startFnc, endFnc); 
    }
    //Кнопка добавления транспорта
    const buttonAddTr = document.getElementById('addTr') as HTMLButtonElement
    //Кнопка установки транспорта
    const buttonSetTr = document.getElementById('setTr') as HTMLButtonElement
    //Кнопка удаления последнего транспорта
    const buttonDelTr = document.getElementById('delTr') as HTMLButtonElement
    //Кнопка перезапуска игры
    const buttonReplay = document.getElementById('replay') as HTMLButtonElement
    //Описание событий

    //появится кружок(транспорт), способный к перемещению
    buttonAddTr.onclick = function( event: MouseEvent):void {
        if (indexGS < 60){
            if (onlyOneClickToAddWHileNotSet === true){
                onlyOneClickToAddWHileNotSet = false;
                const circleP = paper.circle(widthSizePaper/2,heightSizePaper/2,12*koef).attr('fill', '#f00000');
                mySet.push(circleP);
                mySet.draggable();
            }
        }
    }
    //установим кружок(транспорт), чтобы связать с предыдущей точкой
    buttonSetTr.onclick = function( event: MouseEvent):void {
        if (onlyOneClickToAddWHileNotSet === false) {
            onlyOneClickToAddWHileNotSet = true;
            //взять координаты текущего расположения транспорта
            const pointOld = new Point(listAllPoint[indexGS/3].x,listAllPoint[indexGS/3].y);
            pointCur.x += widthSizePaper/2;
            pointCur.y += heightSizePaper/2;
            //нарисовать транспорт
            globalSet[indexGS] = paper.circle(pointCur.x,pointCur.y,12*koef).attr('fill', '#000000');
            //переводим индекс к следующему объекту
            indexGS++;
            //нарисовать линию от точки к новому кругу
            globalSet[indexGS] = paper.path(`M ${pointOld.x} ${pointOld.y} L ${pointCur.x} ${pointCur.y}`).attr({opacity: 0.2});
            indexGS++;
            //написать текст на новом круге
            globalSet[indexGS] = paper.text(pointCur.x,pointCur.y + 17*koef,`T${ (indexGS+1)/3 }`).attr({ "font-size": 10*koef });
            indexGS++;
            document.getElementById(`t${ indexGS/3 }`).innerHTML='0';
            document.getElementById(`text${ indexGS/3 }`).innerHTML='T'+indexGS/3;
            listDistance[indexGS/3] = Check.info(pointOld,pointCur,centerMinusEnergy,CenterContainer);
            //отчистим кружок из канваса mySet
            mySet.remove();
            //добавим точку в список точек (indexGS всегда кратен 3 здесь)
            listAllPoint[indexGS/3] = pointCur;
            //назначить текущей точке значение 0;
            pointCur = new Point(0,0);
        }
    }
    //удалим транспорт
    buttonDelTr.onclick = function(event: MouseEvent):void {
        if (indexGS > 0) {
            globalSet[indexGS-1].remove();
            globalSet[indexGS-2].remove();
            globalSet[indexGS-3].remove();
            document.getElementById(`t${ indexGS/3 }`).innerHTML='';
            document.getElementById(`text${ indexGS/3 }`).innerHTML='';
            //удалим из списка точек последнюю точку
            delete listAllPoint[indexGS/3];
            delete listDistance[indexGS/3];
            indexGS-=3;
       }
    }
    //атомарный размер посылки
    const atom:number = 1;
    //скорость посылки между транспортами
    const speed:number = 1000;
    //replay
    buttonReplay.onclick = function(event: MouseEvent):void {
        //just f5
    }
    //отправка посылок
    let timerId:any = setTimeout(function tick():void {
        goAllParcel(paper,koef,indexGS,listAllPoint,listDistance,atom,speed);
        timerId = setTimeout(tick, speed/2);
    }, speed*3);
    //проверка на завершённость игры
    let timerEnd:any = setTimeout(function tick():void {
        if (Check.isFinished(atom,indexGS,speed*3) === true){
            if (Check.isWin() === true){
                //timerId.clearTimeout(tick);
                //timerEnd.clearTimeout();
            }
        } else {
            timerEnd = setTimeout(tick, speed*5);
        }
    }, speed*5);
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
function CanITransferMyEnergyForContainer(paper:any,koef:number,index:number,listAllPoint:any,listDistance:any,atomMail=1,speed:number): boolean{
    //проверка на передачу приёмнику
    if (index >= 3){
        //возьмём текст предыдущей точки
        let textByIdCurrent:string = document.getElementById(`t${ index/3 }`).innerHTML;
        const valueTextByIdCurrent:number = parseFloat(textByIdCurrent);
        //если есть что послать
        if (valueTextByIdCurrent - atomMail >= 0){
            let textByIdContainer:string = document.getElementById('container').innerHTML;
            const valueTextByIdContainer:number = parseFloat(textByIdContainer);
            const distanceToContainer = listDistance[index/3];
            const resistance:number = Check.take_Rkoef(distanceToContainer[2],koef);
            //если дистанция позволительная, то передать
            if (resistance > 0){
                //когда проиграется анимация - запустить тело if
                if (Anim.startParcel(paper,koef,listAllPoint[index/3],listAllPoint.end,speed*2) === true) {
                    textByIdCurrent = document.getElementById(`t${ index/3 }`).innerHTML = (valueTextByIdCurrent - atomMail).toFixed(4);
                    textByIdContainer = document.getElementById('container').innerHTML = (valueTextByIdContainer + atomMail*(resistance)).toFixed(4);
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
function CanITransferMyEnergyForNextTransport(paper:any,koef:number,i:number,listAllPoint:any,listDistance:any,atomMail=1): number{
    //возьмём предыдущую точку
    const prefPoint:Point = listAllPoint[i/3 - 1];
    //возьмём текущую точку
    const curPoint:Point = listAllPoint[i/3];
    //возьмём текст предыдущей точки
    const textByIdOld:string = document.getElementById(`t${ i/3 - 1 }`).innerHTML;
    const valueTextByIdOld:number = parseFloat(textByIdOld);
    //снимаем значение текущей точки
    let textByIdCur:string = document.getElementById(`t${ i/3 }`).innerHTML;
    let valueTextByIdCur:number = parseFloat(textByIdCur);
    //есть значение отличное от нуля у предыдущей точки, то делаем
    if (valueTextByIdOld - atomMail >= 0){
        //когда посылка будет доставлена
        if (Anim.startParcel(paper,koef,prefPoint,curPoint) === true){
            document.getElementById(`t${ i/3 - 1 }`).innerHTML = (valueTextByIdOld - atomMail).toFixed(4);
            //формируем коэффициент сопротивления
            const distance:number[] = listDistance[i/3];
            const resistance:number = Check.take_Rkoef(distance[0],koef);
            textByIdCur = document.getElementById(`t${ i/3 }`).innerHTML = (valueTextByIdCur + atomMail*(resistance)).toFixed(4);
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
function drainEnergy(
    paper:any,
    koef:number,
    i:number,
    listAllPoint:any,
    listDistance:any,
    valueTextByIdCur:number,
    atomMail:number,
    speed=1000
    ): void{
        const distanceToMinus:number[] = listDistance[i/3];
        const leavingEnergy:number = Check.take_koefToMinusEnergy(distanceToMinus[1],koef,atomMail);
        if (leavingEnergy >= 0.1*atomMail){
            Anim.animateWarning(paper,koef,listAllPoint[i/3],speed);
        }
        if (valueTextByIdCur > -0.5)
            document.getElementById(`t${ i/3 }`).innerHTML = (valueTextByIdCur - leavingEnergy).toFixed(4);
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
function goAllParcel(paper:any,koef:number,index:number,listAllPoint:any,listDistance:any,atomMail=1,speed:number): void{
    let i:number = index;
    for (i; i >= 3; i-=3){
        let value:number = CanITransferMyEnergyForNextTransport(paper,koef,i,listAllPoint,listDistance,atomMail);
        const valueTextByIdCur:number = value;
        drainEnergy(paper,koef,i,listAllPoint,listDistance,valueTextByIdCur,atomMail,speed)
    }
    CanITransferMyEnergyForContainer(paper,koef,index,listAllPoint,listDistance,atomMail,speed);
}
/**Случайно выбрать место для точки на середине поля
 * @param wPaper ширина поля
 * @param hPaper высота поля
 * @returns point точка
 */
function randomPoint(wPaper:number,hPaper:number): Point{
    const   x:number = Math.random() * (0.46*wPaper) + 0.27*wPaper,
            y = Math.random() * (0.8*hPaper) + 0.1*hPaper,
            point:Point = new Point(x,y);
    return point;
}
/**Определяет высоту от начала окна браузера до элемента
 * @param элемент из html
 * @returns offsetTop высота от начала окна браузера до необходимого элемента
 */
function offsetPosition(element:any):number {
    let offsetTop = 0;
    do {
        offsetTop  += element.offsetTop;
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
function restartGame(
    index:number,
    widthSP:number,
    heightSP:number,
    globalSet:any,
    listAllPoint:any,
    listDistance:any
    ):Point {
        while (index >= 3){
            globalSet[index-1].remove();
            globalSet[index-2].remove();
            globalSet[index-3].remove();
            document.getElementById(`t${ index/3 }`).innerHTML='';
            document.getElementById(`text${ index/3 }`).innerHTML='';
            //удалим из списка точек последнюю точку
            delete listAllPoint[index/3];
            delete listDistance[index/3];
            index-=3;
        }
        index = 0;
        document.getElementById('t0').innerHTML='100';
        document.getElementById('container').innerHTML='0';
        return randomPoint(widthSP,heightSP);
}
game();