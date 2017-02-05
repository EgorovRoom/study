/**
 * Модуль с ф-циями анимирования
 * 
 */
;
import Point from './point';
namespace anim{
    /**Анимация предупреждения
     * @param paper - холст Рафаэля
     * @param koef - коэффициент соотношения ширины экрана
     * @param point - координата точки
     * @param speed - скорость посылки
     * @returns boolean вернёт true, когда анимация завершится
     */
    export function animateWarning(paper:any,koef:number,point:Point,speed=1000):boolean{
        const circleMail = paper.circle(point.x,point.y,12*koef).attr({stroke: "#aa0033"});
        circleMail.animate({
            //насколько изменится
            r: 0
            },
            speed,
            function(){circleMail.remove()}
        );
        return true;
    }
    /** Запускает посылку из точки в точку
     * @param paper - холст Рафаэля
     * @param koef - коэффициент соотношения ширины экрана
     * @param prefPointXY - координаты предыдущей точки
     * @param curPointXY - координаты текущей точки
     * @param speed - скорость движения частиц
     * @return возврат true, когда анимация завершится
     */
    export function startParcel(paper:any, koef:number, prefPointXY:Point, curPointXY:Point, speed=1000):boolean {
        const circleMail = paper.circle(prefPointXY.x,prefPointXY.y,1+4*koef).attr({stroke: "#00aa77", fill: "#00aa77"});
        //пока этот параметр false, не можем выйти из ф-ции
        circleMail.animate({
            //насколько изменится
            cx: curPointXY.x,
            cy: curPointXY.y,
            },
            speed,
            function():void{circleMail.remove();}
        );
        return true;
    };
}
export {anim as default};