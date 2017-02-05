/**
 * Модуль с ф-циями анимирования
 * 
 * @module
 */
;
import Point from './point';
namespace check{
    /**ф-ция для подсчёта расстояний до объектов
     * @param pointOld предыдущая точка
     * @param pointCur текущая точка
     * @param pointMinus положение отрицательной энергии
     * @param pointNeedEnergy точка приёмника
     * @returns listDist расстояние до предыдущей точки,расстояние до отрицательной энергии,расстояние до приёмника
     */
    export function info(pointOld:Point,pointCur:Point,pointMinus:Point,pointNeedEnergy:Point):number[]{
        //расстояние между двумя точками (текущей и предыдущей)
        let DistanceOtC:number = 0;
        //расстояние между двумя точками (текущей и отрицательной энергией)
        let DistanceOtM:number = 0;
        //расстояние между двумя точками (текущей и приёмником)
        let DistanceOtG:number = 0;
        //массив, куда впишем три расстояния DistanceOtC,DistanceOtM,DistanceOtG
        const listDist:number[] = [0,0,0];
        //разницы координат между текущей точкой и предыдущей
        const deltaXOtC:number = Math.round(Math.abs(pointOld.x - pointCur.x));
        const deltaYOtC:number = Math.round(Math.abs(pointOld.y - pointCur.y));
        const sumsqrt:number = deltaYOtC*deltaYOtC + deltaXOtC*deltaXOtC;
        DistanceOtC = Math.round(Math.sqrt(sumsqrt));
        listDist[0] = DistanceOtC;
        //разницы координат между текущей точкой и отрцательной энегией
        const deltaXOtM:number = Math.round(Math.abs(pointMinus.x - pointCur.x));
        const deltaYOtM:number = Math.round(Math.abs(pointMinus.y - pointCur.y));
        DistanceOtM = Math.round(Math.sqrt(deltaYOtM*deltaYOtM + deltaXOtM*deltaXOtM));
        listDist[1] = DistanceOtM;
        //разницы координат между текущей точкой и приёмников
        const deltaXOtG:number = Math.round(Math.abs(pointNeedEnergy.x - pointCur.x));
        const deltaYOtG:number = Math.round(Math.abs(pointNeedEnergy.y - pointCur.y));
        DistanceOtG = Math.round(Math.sqrt(deltaYOtG*deltaYOtG + deltaXOtG*deltaXOtG));
        listDist[2] = DistanceOtG;
        return listDist;
    }
    /** Сопротивление холста мешает переносить энергию без потерь - ф-ция расчитывает потери
     * @param dist значение расстояния между точками
     * @param k коэффициент ширины экрана
     * @returns x возвращает коэффцициент сопротивления
     */
    export function take_Rkoef(dist:any,k:number):any{
        //Точки фиксации
        const pA:number = 90*k;
        const pB:number = 170*k;
        const pC:number = 205*k;
        const pD:number = 250*k;
        let x:number = 0;
        let d:number = parseFloat(dist.toFixed(1));
        if (d > pD) return x;
        if ((d >= 0) && (d <= pA)) x = (1 - d/1500/k);
        if (d > pA && d <= pB) x = (1.15 - d/375/k);
        if (d > pB && d <= pC) x = (2.25 - d/110/k);
        if (d > pC && d <= pD) x = (1.25 - d/250/k);
        return x.toFixed(4);
    }
    /** Сопротивление холста мешает переносить энергию без потерь - ф-ция расчитывает потери
     * @param dist значение расстояния между точками
     * @param k коэффициент ширины экрана
     * @returns x возвращает коэффцициент сопротивления
     */
    export function take_RkoefToEnd(dist:any,k:number):any{
        //Точки фиксации
        const pA:number = 90*k;
        const pB:number = 100*k;
        const pC:number = 110*k;
        const pD:number = 120*k;
        let x:number = 0;
        let d:number = dist.toFixed(1);
        if (d > pD) return x;
        if ((d >= 0) && (d <= pA)) x = (1 - d/1500/k);
        if (d > pA && d <= pB) x = (1.15 - d/375/k);
        if (d > pB && d <= pC) x = (1.20 - d/310/k);
        if (d > pC && d <= pD) x = (1.25 - d/250/k);
        return x.toFixed(4);
    }
    /**Расчёт эффекта отрицательной энергии
     * @param dist значение расстояния между точками
     * @param k коэффициент ширины экрана
     * @param atom минимальная посылка
     * @returns x возвращает коэффцициент сопротивления
     */
    export function take_koefToMinusEnergy(dist:any,k:number,atom:number):any{
        //Точки фиксации
        const pA:number = 40*k;
        const pB:number = 80*k;
        const pC:number = 100*k;
        const pD:number = 140*k;
        let x:number = 0;
        let d:number = dist.toFixed(1);
        if (d > pD) return x;
        if ((d >= 0) && (d <= pA)) x = 0.2*atom;
        if (d > pA && d <= pB) x = 0.1*atom;
        if (d > pB && d <= pC) x = 0.04*atom;
        if (d > pC && d <= pD) x = 0.00*atom;
        return x.toFixed(4);
    }
    /**Провести проверку на наличие меньших значений, чем атомарные, в каждой точке
     * @param atomMail атомарное значение энергитической посылки
     * @param index - последний занятый элемент списка объектов игры
     * @returns boolean - отсутствие значений, меньших атомарных в каждой точке
     */
    export function forAllIndexGoIf(atomMail:number,index:number):boolean{
        let i:number = index;
        for (i; i >= 0; i-=3){
            //возьмём текст точки
            let textById:string = document.getElementById(`t${ i/3 }`).innerHTML;
            //получим значение, хранящееся внутри
            const valueTextById:number = parseFloat(textById);
            if (valueTextById > atomMail)
                return false;
        }
        return true;
    }
    /**Проверка на конец игры
     * @param atomMail атомарное значение энергитической посылки
     * @param index последний занятый элемент списка объектов игры
     * @returns boolean закончена ли игра
     */
    export function isFinished(atomMail:number,index:number,speed=1000):boolean{
        //проверяем все точки, если в каждой точке значение меньше атомарного, игра закончена
        let boolValue:boolean = forAllIndexGoIf(atomMail,index);
        const timerId = setTimeout(
            function justf():void{
                boolValue = forAllIndexGoIf(atomMail,index);
            },
            speed
        )
        return boolValue;
    }
    /**
     * Проверка на победу/поражение
     * @returns boolean победа или поражение
     */
    export function isWin():boolean{
        //возьмём текст точки
        let textById:string = document.getElementById('container').innerHTML as string;
        //получим значение, хранящееся внутри
        const valueTextById:number = parseFloat(textById);
        if (valueTextById > 65){
            alert("Победа!");
            return true;
        }
        alert("Вы проиграли!");
        return false;
    }
}
/**
 * Модуль
 */
export {check as default};