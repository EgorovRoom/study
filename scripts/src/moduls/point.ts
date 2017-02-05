/**
 * Модуль класса точек двухмерной плоскости
 * 
 * @module
 */
;

/**
 * Класс точек двухмерной плоскости
 */
class Point
{
	/**
	 * Координата по оси абсцисс
	 */
	public x: number;
	/**
	 * Координата по оси ординат
	 */
	public y: number;
	/**
	 * Класс точек двухмерной плоскости
	 * 
	 * @param x Координата по оси абсцисс
	 * @param y Координата по оси ординат
	 */
	public constructor( x: number, y: number )
	{
		this.x = x;
		this.y = y;
	}
}
/**
 * Модуль
 */
export {
	Point as default,
};