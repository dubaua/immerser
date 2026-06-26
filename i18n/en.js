module.exports = {
  'language-code': 'en',
  'document-title': 'immerser — Javascript Library for Switching Fixed Elements on Scroll',
  'readme-title': 'Library for Switching Fixed Elements on Scroll',
  immerser: 'immerser',
  'menu-link-reasoning': 'Reasoning',
  'menu-link-how-to-use': 'How to Use',
  'menu-link-how-it-works': 'How it Works',
  'menu-link-options': 'Options',
  'menu-link-recipes': 'Recipes',
  'language-switcher':
    '<span class="language__link language__link--active">english</span><a href="./ru.html" class="language__link">по-русски</a>',
  github: 'github',
  copyright: '&copy; %%THIS_YEAR%% &mdash; Vladimir Lysov, Chelyabinsk, Russia',
  'custom-font-body-classname': '',
  'why-immerser-title': 'Why Immerser?',
  'why-immerser-content': `
<p>
  Sometimes designers create complex logic and fix parts of&nbsp;the interface.
  Also they colour page sections contrasted. How to&nbsp;deal with this mess?
</p>
<p>
  Immerser comes to&nbsp;help you. It&rsquo;s a&nbsp;javascript library to&nbsp;change fixed elements on&nbsp;scroll.
</p>
<p>
  Immerser fast, because it&nbsp;calculates states once on&nbsp;init.
  Then it&nbsp;watches the scroll position and schedules redraw document in&nbsp;the next event loop tick with requestAnimationFrame.
  Script changes transform property, so&nbsp;it&nbsp;uses graphic hardware acceleration.
</p>
<p>
  Immerser is&nbsp;written on&nbsp;typescript. Only&nbsp;%%BUNDLESIZE%%Kb gzipped.
</p>
`,

  'terms-title': 'Terms',
  'terms-content': `
<p>
<code class="highlighter" data-highlighter="[data-immerser]">Immerser root</code>&nbsp;&mdash; is&nbsp;the parent
container for your fixed parts <code class="highlighter" data-highlighter="[data-immerser-solid], .emoji">solids</code>.
Actually, solids are positioned absolutely to&nbsp;fixed immerser root. The
<code class="highlighter" data-highlighter="[data-immerser-layer]">layers</code> are sections of&nbsp;your page.
Also you may want to&nbsp;add
<code class="highlighter" data-highlighter="[data-immerser-solid='pager']">pager</code> to&nbsp;navigate through layers
and indicate active state.
</p>
`,

  'install-title': 'Install',
  'install-npm-label': '<p>Using npm:</p>',
  'install-yarn-label': '<p>Using yarn:</p>',
  'install-browser-label': '<p>Or if you want to use immerser in browser as global variable:</p>',

  'prepare-your-markup-title': 'Prepare Your Markup',
  'prepare-your-markup-content': `
<p>First, setup fixed container as&nbsp;the immerser root container, and add the&nbsp;<code>data-immerser</code> attribute.</p>
<p>Next place absolutely positioned children into the immerser parent and add&nbsp;<code>data-immerser-solid="solid-id"</code> to&nbsp;each.</p>
<p>Then add&nbsp;<code>data-immerser-layer</code> attribute to&nbsp;each section and pass configuration as
<code>solidClassnamesByLayerId</code> option to&nbsp;immerser. Config should contain <abbr title="JavaScript Object Notation">JSON</abbr> describing what class should be
applied on&nbsp;each solid element, when it's&nbsp;over a&nbsp;section.</p>
<p>Also feel free to&nbsp;add <code>data-immerser-pager</code> to&nbsp;create a pager for your layers.</p>
`,

  'apply-styles-title': 'Apply styles',
  'apply-styles-content': `
<p>
  Apply colour and background styles to&nbsp;your layers and solids according to&nbsp;your classname configuration passed in&nbsp;options.
  I&rsquo;m using <a href="https://en.bem.info/methodology/"><abbr title="Block Element Modifier">BEM</abbr> methodology</a> in&nbsp;this example.
</p>
`,

  'dont-import-if-umd-line-1': `You don't have to import immerser`,
  'dont-import-if-umd-line-2': `if you're using it in browser as global variable`,

  'initialize-immerser-title': 'Initialize Immerser',
  'initialize-immerser-content': `<p>Include immerser in&nbsp;your code and create immerser instance with options.</p>`,

  'callback-on-init': 'callback on init event',
  'callback-on-mount': 'callback on mount event',
  'callback-on-unmount': 'callback on unmount event',
  'callback-on-destroy': 'callback on destroy event',
  'callback-on-structure-change': 'callback on DOM structure change event',
  'callback-on-layout-change': 'callback on layer size recalculation event',
  'callback-on-active-layer-change': 'callback on active layer change event',
  'callback-on-layer-progress-change': 'callback on layer progress change event',

  'how-it-works-title': 'How it Works',
  'how-it-works-content': `
<p>First, immerser gathers information about the layers, solids, window and document. Then it&nbsp;creates a&nbsp;statemap for each layer, containing all necessary information, when the layer is&nbsp;partially and fully in&nbsp;viewport.</p>
<p>After that immerser modifies <abbr title="Document Object Model">DOM</abbr>, cloning all solids into mask containers for each layer and applying the classnames given in&nbsp;configuration. If&nbsp;you have added a&nbsp;pager, immerser also creates links for layers.</p>
<p>Finally, immerser binds listeners to&nbsp;scroll and resize events. On&nbsp;resize, it&nbsp;will meter layers, the window and document heights again and recalculate the statemap.</p>
<p>On&nbsp;scroll, immerser moves a&nbsp;mask of&nbsp;solids to&nbsp;show part of&nbsp;each solid group according to&nbsp;the layer below.</p>
`,

  'options-title': 'Options',
  'options-content': `
<p>
  You can pass options to immerser as an object parameter.
</p>
`,

  option: 'option',
  event: 'event',
  type: 'type',
  arguments: 'arguments',
  default: 'default',
  description: 'description',
  name: 'name',

  'option-solidClassnamesByLayerId':
    'Nested lookup table: layer id → solid id → CSS class that immerser adds to that solid on that layer. Configuration example <a href="#initialize-immerser">is shown above</a>',
  'option-autoMount': 'If true, constructor mounts immerser immediately',
  'option-selectorRoot': 'Parent element used only for selector lookup during mount',
  'option-fromViewportWidth': 'Minimum viewport width in pixels, breakpoint at which immerser mounts',
  'option-pagerThreshold': 'Portion of viewport height that must overlap the next layer before pager switches',
  'option-hasToUpdateHash': 'Whether to update the page hash to the active layer id when active layer changes',
  'option-scrollAdjustThreshold':
    'Pixel threshold near section edges that triggers scroll snapping when exceeded. Pass zero to disable scroll snapping',
  'option-scrollAdjustDelay': 'Delay in ms before running scroll snapping after user scroll stops',
  'option-pagerLinkActiveClassname': 'Class for the pager link pointing to the active layer',
  'option-hasExternalScroll':
    'If true, immerser will not attach its own scroll handler. Intended for use with an external scroll controller and syncScroll calls',
  'option-hasExternalRenderer':
    'If true, skips most DOM mutation routine. Intended for use with render frameworks such as React, Vue.js, and others',
  'option-debug': 'Enables warning logging. Defaults to true in development, false otherwise',
  'option-on': 'Initial event handlers map keyed by event name',
  'events-title': 'Events',
  'events-content':
    '<p>You can subscribe to events via the <code>on</code> option or by calling the <code>on</code> or <code>once</code> method on an immerser instance.</p>',
  'event-init': 'Emitted after initialization',
  'event-mount': 'Emitted after immerser mounts and is ready to work',
  'event-unmount': 'Emitted after unmount when viewport width is below fromViewportWidth',
  'event-destroy': 'Emitted after instance destroy',
  'event-structureChange': 'Emitted after DOM structure synchronization',
  'event-layoutChange': 'Emitted after layer size recalculation changes',
  'event-activeLayerChange': 'Emitted after active layer changes',
  'event-layerProgressChange': 'Emitted after layer progress changes',
  'event-stateChange': 'Emitted after any immerser event so external renderers can read current public fields',

  'public-fields-title': 'Public fields and methods',
  'public-field-mount':
    'Mounts immerser when viewport width passes the fromViewportWidth breakpoint: discovers DOM, prepares markup, calculates layer sizes, and attaches event listeners',
  'public-field-unmount':
    'Unmounts immerser: cleans markup owned by immerser and keeps resize handling active for breakpoint remount',
  'public-field-updateOptions': 'Updates runtime options and applies minimal side effects without remounting',
  'public-field-destroy':
    'Fully destroys immerser: unmounts it, removes resize handling, restores original markup, and clears internal state',
  'public-field-render': 'Schedules structure synchronization, calculations, and redraw after DOM mutations',
  'public-field-syncScroll':
    'Syncs immerser with an externally controlled scroll position. Intended for use with hasExternalScroll=true',
  'public-field-on': 'Registers a persistent immerser event handler',
  'public-field-once': 'Registers a one-time immerser event handler that is removed after the first call',
  'public-field-off': 'Removes a specific handler for the given immerser event',
  'public-field-activeIndex': 'Active layer index derived from scroll position',
  'public-field-isMounted': 'Indicates whether immerser is mounted',
  'public-field-rootNode': 'Root DOM element immerser is attached to',
  'public-field-layerProgressArray': 'Progress of each layer from 0 (off-screen) to 1 (fully visible)',
  'public-field-debug': 'Controls whether immerser reports warnings',

  'cloning-event-listeners-title': 'Cloning Event Listeners',
  'cloning-event-listeners-content': `
<p>
  Since immerser cloning nested nodes by&nbsp;default, all event listeners and data bound on&nbsp;nodes will be lost after
  init. Fortunately, you can markup the&nbsp;immerser yourself. It&nbsp;can be&nbsp;useful when you have event listeners
  on&nbsp;solids, reactive logic or&nbsp;more than classname switching. All you need is&nbsp;to&nbsp;place the number
  of&nbsp;nested immerser masks equal to&nbsp;the number of&nbsp;the layers. Look how I change the smiley emoji
  on&nbsp;the right in&nbsp;this page source.
</p>
`,

  'your-markup': 'your markup',

  'handle-clone-hover-title': 'Handle Clone Hover',
  'handle-clone-hover-content': `
<p>
  As&nbsp;mentioned above, immerser cloning nested nodes to&nbsp;achieve changing on&nbsp;scroll. Therefore if&nbsp;you
  hover a&nbsp;partially visible element, only the&nbsp;visible part will change. If&nbsp;you want to&nbsp;synchronize all cloned links, just
  pass
  <code>data-immerser-synchro-hover="hoverId"</code> attribute. It&nbsp;will share <code>_hover</code> class between all
  nodes with this <code>hoverId</code> when the mouse is&nbsp;over one of&nbsp;them. Add <code>_hover</code> selector alongside your
  <code>:hover</code> pseudoselector to&nbsp;style your interactive elements.
</p>
`,
  'handle-dom-change-title': 'Handle <abbr title="Document Object Model">DOM</abbr> change',
  'handle-dom-change-content': `
<p>
  Immerser is not aware of changes in <abbr title="Document Object Model">DOM</abbr>, if you dynamically add or remove nodes. If you change height of the document 
  and want immerser to recalculate and redraw solids, call <code>render</code> method on the immerser instance.
</p>
`,
  'external-scroll-engine-title': 'External Scroll Engine',
  'external-scroll-engine-content': `
<p>
  If you drive scrolling with a custom scroll engine, for example Locomotive Scroll, disable immerser scroll listener with
  <code>hasExternalScroll=true</code> flag and call <code>syncScroll</code> method every time the engine updates position.
  Immerser will only redraw masks without attaching another scroll handler. Keep in mind that immerser will not optimize calls this way, and performance optimization is client responsibility.
</p>
`,
  'recipes-changing-dom': 'make any manipulations, that changes <abbr title="Document Object Model">DOM</abbr> flow',
  'recipes-redraw-immerser': 'then tell immerser redraw things',
  'recipes-disable-scroll-handling-with-external-scroll':
    'turn off immerser scroll handling when using a custom engine',
  'recipes-sync-with-external-engine': 'subscribe to engine scroll event to run sync immerser',
  'ai-usage-title': '<abbr title="Artificial Intelligence">AI</abbr> usage note',
  'ai-usage-content': `<p>The core of the library was written in 2019 and significantly improved in 2022, before <abbr title="Artificial Intelligence">AI</abbr>-assisted programming became a thing. In later iterations, <abbr title="Artificial Intelligence">AI</abbr> was used as a supporting tool for infrastructure tasks, documentation updates, and generation of code generation.</p>
<p>For me, <abbr title="Artificial Intelligence">AI</abbr> is just another tool alongside linters, bundlers, and other means of speeding up and simplifying work. I am lazy, and my laziness pushes me toward inventing better tools.</p>
<p>I use <abbr title="Artificial Intelligence">AI</abbr> openly and consider it important to state this explicitly, because for some people it can be a deciding factor.</p>`,
};
