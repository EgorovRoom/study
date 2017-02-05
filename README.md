# Игра - "Перенос энергии"

##Запуск:

1. Игра готова к использованию - откройте index.html

Для перекомпилирования:
1. Использовать cmd, перейти в папку scripts
2. Для сборки выполнить команду tsc
3. Откройте index.html

##Описание:

    Объекты игры:
        Положительная энергия (слева),
        Приёмник энергии (справа),
        Транспорт (круг, появляющийся при нажатии кнопок),
        Отрицательная энергия (игрок не видит её на экране).
    Задача:
        Довести энергию с помощью транспортов до приёмника.
    Как довести?
        При нажатии кнопки "добавить траспорт" 
            - появляется кружок, который нужно схватить и передвинуть в желаемое место
        При нажатии кнопки "установить транспорт"
            - Транспорт двигать больше нельзя, зато он получает энергию от предыдущего объекта на поле
            (первый транспорт получает энергию от объекта положительной энергии)
            - Чем дальше транспорт от предыдущего объекта, тем больше потерь при передаче энергии
            - Чем ближе транспорт к отрицательной энергии, тем больше сжигается энергии внутри транспорта
        При нажатии кнопки "удалить транспорт"
            - Транспорт, установленный последним, исчезнет вместе с энергией, которая находилась в транспорте
        При нажатии кнопки "перезапуск"
            - Игра будет обнулена и можно будет начать заново
    Сложность:
        Сложность игры в том, что:
            -   необходимо найти "золотую середину" расстояния, при котором меньше
                всего потерь энергии при передаче, а расстояние было бы существенным.
            -   непредсказуемое расположение отрицательной энергии и её невидимый
                эффект сжигания энергии.
            -   необходимость нажимать на кнопки при установке элементов,
                когда нужно быстро устранить транспорт.
    События:
        Мерцание транспорта - вы настолько близко к отрицательной энергии,
        что необходимо убрать этот транспорт, иначе вы останетесь без шансов на победу
        Победа - наступает при переносе >65% энергии в приёмник
        Поражение - наступает при недостаточном количестве энергии в приёмнике.

##Зависимости:

    "typescript": "^2.1.5",
    "raphael": "^2.2.7"