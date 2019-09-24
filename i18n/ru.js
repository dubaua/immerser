module.exports = {
  'document-title': 'иммерсер — джаваскрипт библиотека для перекрашивания фиксированных блоков по скроллу',
  immerser: 'иммерсер',
  'menu-link-reasoning': 'Зачем нужен иммерсер',
  'menu-link-how-to-use': 'Как пользоваться',
  'menu-link-how-it-works': 'Принцип работы',
  'menu-link-options': 'Настройки',
  'menu-link-possibilities': 'Возможности',
  'language-switcher': '<a href="/" class="language__link">english</a><span class="language__link language__link--active">по-русски</span>',
  github: 'гитхаб',
  copyright: '&copy; 2019 &mdash; Владимир Лысов, Челябинск, Россия',
  'custom-font-body-classname': 'font-cyrillic',
  'section-why-immerser': `
<h1>Зачем нужен иммерсер?</h1>
<p>
  Иногда дизайнеры создают сложную логику и&nbsp;фиксируют части интерфейса. А&nbsp;еще они красят разделы страницы в&nbsp;контрастные цвета. Как с&nbsp;этим справиться?
</p>
<p>
  Вам поможет иммерсер&nbsp;&mdash; джаваскрипт библиотека для замены фиксированных элементов при прокрутке страницы.
</p>
<p>
  Иммерсер вычисляет состояния один раз в&nbsp;момент инициализации.
  Затем он&nbsp;следит за&nbsp;позицией скролла и&nbsp;планирует перерисовку документа
  в&nbsp;следующем такте цикла событий через метод requestAnimationFrame.
  Скрипт изменяет свойство transform и&nbsp;это задействует графический ускоритель.
</p>
<p>
  Он&nbsp;не&nbsp;имеет зависимостей и&nbsp;написан на&nbsp;чистом джаваскрипте. Всего&nbsp;3.1кб в&nbsp;сжатии gzip.
</p>
`,

  'section-terms': `
<h1>Термины</h1>
<p>
<strong class="highlighter" data-highlighter="[data-immerser]">Корневой элемент иммерсера</strong>&nbsp;&mdash; это родительский контейнер для ваших фиксированных блоков.
<strong class="highlighter" data-highlighter="[data-immerser-solid], .emoji">Блоки</strong>
позиционированы абсолютно внутри корневого элемента. <strong class="highlighter" data-highlighter="[data-immerser-layer]">Слои</strong>&nbsp;&mdash; это разделы страницы, окрашенные в&nbsp;разные цвета. Еще вы&nbsp;наверняка захотите добавить <strong class="highlighter" data-highlighter="[data-immerser-pager]">навигацию</strong> по&nbsp;разделам, выделяющую активный раздел.
</p>
`,

  'section-install': `
<h1>Установка</h1>
<p>Через npm:</p>
<p>Через yarn:</p>
<p>Или подключив скрипт напрямую:</p>
`,

  'section-prepare-your-markup': `
<h1>Подготовьте разметку</h1>
<p>Сначала настройте свой фиксированный контейнер как корневой элемент иммерсера добавив атрибут <code>data-immerser</code></p>
<p>Затем расположите в&nbsp;нем абсолютно позиционированные дочерние элементы и&nbsp;добавьте каждому атрибут <code>data-immerser-solid="solid-id"</code> с&nbsp;идентификатором блока.</p>
<p>Добавьте каждому слою атрибут <code>data-immerser-layer</code>. Передайте конфигурацию в&nbsp;виде JSON в&nbsp;каждый слой с&nbsp;помощью атрибута
<code>data-immerser-layer-config='{"solid-id": "classname-modifier"}'</code>.
Также вы&nbsp;можете передать конфигурацию всех слоев массивом в&nbsp;параметре <code>solidClassnameArray</code> настроек.
Конфигурация должна содержать описание классов для блоков, когда они находятся поверх слоя.</p>
<p>Так&nbsp;же вы&nbsp;можете добавить элемент с&nbsp;атрибутом <code>data-immerser-pager</code> для создания навигации.</p>
`,

  'section-apply-styles': `
<h1>Примените стили</h1>
<p>
  Добавьте стили цвета текста и&nbsp;фона на&nbsp;ваши блоки и&nbsp;слои с&nbsp;помощью классов, переданных в&nbsp;дата-атрибут или настройки.
  В&nbsp;примере я использую <a href="https://ru.bem.info/methodology/">методология БЭМ</a>.
</p>
`,

  'section-initialize-immerser': `<h1>Инициализируйте иммерсер</h1>
<p>Добавьте иммерсер в&nbsp;код и&nbsp;создайте экземпляр с&nbsp;настройками.</p>
`,

  'callback-on-init': 'колбек после инициализации',
  'callback-on-bind': 'колбек после привязки к документу',
  'callback-on-unbind': 'колбек после отвязки от документа',
  'callback-on-destroy': 'колбек после уничтожения',
  'callback-on-active-layer-change': 'колбек после смены активного слоя',

  'section-how-it-works': `
<h1>Принцип работы</h1>
<p>Сначала иммерсер собирает информацию о&nbsp;слоях, блоках, окне и&nbsp;документе. Затем скрипт создает карту состояний для каждого слоя. Карта содержит размеры слоя, блоков и&nbsp;позиции их&nbsp;пересечений при скролле.</p>
<p>После сбора информации скрипт копирует все блоки в&nbsp;маскирующий контейнер и&nbsp;применяет к&nbsp;каждому классы переданные в&nbsp;настройках. Если вы&nbsp;добавили навигацию, то&nbsp;иммерсер создаст ссылки на&nbsp;каждый слой.</p>
<p>Затем иммерсер подписывается на&nbsp;события скролла документа и&nbsp;изменения размеров окна.</p>
<p>При скролле иммерсер двигает маскирующий контейнер так, чтобы показывать часть каждой группы блоков для каждого слоя под ними. При изменении размеров окна скрипт рассчитает карту состояний заново.</p>
`,

  'section-options': `
<h1>Настройки</h1>
<p>
  Вы&nbsp;можете передать настройки параметром функции конструктора или дата-атрибутом в&nbsp;документе.
  Дата-ататрибут обрабатывается последним, поэтому он&nbsp;переопределит настройки, переданные в&nbsp;конструктор.
</p>
`,

  option: 'параметр',
  type: 'тип',
  default: 'значение по умолчанию',
  description: 'описание',

  'option-solidClassnameArray':
    'Массив настроек слоев. Конфигурация, переданная в data-immerser-layer-config перезапишет эту настройку для соответствующего слоя.',
  'option-fromViewportWidth': 'Минимальная ширина окна для инициализации иммерсера',
  'option-pagerThreshold': 'Насколько должен следующий слой быть видим в окне, чтобы он стал активен в навигации',
  'option-hasToUpdateHash': 'Флаг, контролирующий обновление хеша страницы',
  'option-scrollAdjustThreshold':
    'Дистанция до&nbsp;верха или низа окна браузера в&nbsp;пикселях. Если текущая дистанция меньше переданного значения, то&nbsp;скрипт подстроит положение скролла.',
  'option-scrollAdjustDelay': 'Сколько ждать бездействия пользователя, чтобы начать подстройку скролла',
  'option-classnamePager': 'Имя класса навигации',
  'option-classnamePagerLink': 'Имя класса ссылки навигации',
  'option-classnamePagerLinkActive': 'Имя класса активной ссылки навигации',
  'option-onInit': 'Колбек после инициализации. Принимает единственный параметр — экземпляр иммерсера',
  'option-onBind': 'Колбек после привязки к документу. Принимает единственный параметр — экземпляр иммерсера',
  'option-onUnbind': 'Колбек после отвязки от документа. Принимает единственный параметр — экземпляр иммерсера',
  'option-onDestroy': 'Колбек после уничтожения. Принимает единственный параметр — экземпляр иммерсера',
  'option-onActiveLayerChange':
    'Колбек после смены активного слоя. Принимает первым параметром индекс следующего слоя, экземпляр иммерсера вторым',

  'section-custom-markup': `
<h1>Кастомная разметка</h1>
<p>
  Вы&nbsp;уже знаете, что иммерсер клонирует элементы.
  Подписчики событий и&nbsp;данные привязанные к&nbsp;нодам не&nbsp;клонируются вместе с&nbsp;элементом.
  К&nbsp;счастью, вы&nbsp;можете разметить иммерсер самостоятельно.
  Для этого разместите внутри корневого элемента маскирующие контейнеры для блоков по&nbsp;числу слоев.
  В&nbsp;таком случае скрипт не&nbsp;будет клонировать элементы
  и&nbsp;подписчики и&nbsp;реактивная логика останутся после инициализации.
  В&nbsp;примере на&nbsp;этой странице я&nbsp;создаю подписчик на&nbsp;клик по&nbsp;смайлу справа до&nbsp;иницализации.
</p>
`,

  'your-markup': 'ваша разметка',

  'section-hover-synchronizing': `
<h1>Синхронизация наведения</h1>
<p>
  Как упомянуто ранее, иммерсер клонирует узлы документа, чтобы добиться смены по&nbsp;скроллу.
  Получается, если вы&nbsp;наведете мышь на&nbsp;элемент, находящийся на&nbsp;границе слоев,
  то&nbsp;псевдоселектор <code>:hover</code> сработает только на&nbsp;одну часть.
  Если вы&nbsp;хотите, чтобы наведение сработало на&nbsp;все клоны элемента,
  просто задайте идентификатор наведения в&nbsp;атрибуте <code>data-immerser-synchro-hover="hoverId"</code>.
  При наведении мыши на&nbsp;такой элемент, ко&nbsp;всем его клонам добавится класс <code>_hover</code>.
  Стилизуйте по&nbsp;этому селектору вместе с&nbsp;псевдоселектором <code>:hover</code>, чтобы добиться нужного эффекта.
</p>
`,
};