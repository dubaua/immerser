Но это нужно явно записать в docs/комменте:

“data-immerser root is controlled by Immerser. Do not put arbitrary markup into it. Only source solids and/or mask markup are supported. Immerser may write technical inline styles to root, masks, mask-inner and generated clones. Previous inline styles on these technical nodes are not restored after unbind.”

Для React это тоже ок: wrapper сам создаёт root/masks/inners по контракту и не будет туда совать левое. Клиентский контент живёт внутри mask-inner, и вот его Immerser не должен трогать.

ариа хиддены при существующей разметке - ответсвенность клиента

на ручные солиды разметить data-immerser-solid

валидации размазаны по дом и маркап контролллерам сейчас. нужно испсрапавить

возможно притащить планирование изменений дом по лейерам и затем батчево их накатывать.

нахуя assert mounted?

нужны методы для пакетной установки и обновления.

нужен метод для обновления опций

для пейджера просто будет отдельный компонент, который сам умеет все рисовать.
