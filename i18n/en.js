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
  Immerser is&nbsp;written on&nbsp;vanilla&nbsp;js. Only&nbsp;%%BUNDLESIZE%%Kb gzipped.
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
<p>Then add&nbsp;<code>data-immerser-layer</code> attribute to&nbsp;each section and pass configuration in
<code>data-immerser-layer-config='{"solid-id": "classname-modifier"}'</code>. Otherwise, you can pass configuration as
<code>solidClassnameArray</code> option to&nbsp;immerser. Config should contain JSON describing what class should be
applied on&nbsp;each solid element, when it's&nbsp;over a&nbsp;section.</p>
<p>Also feel free to&nbsp;add <code>data-immerser-pager</code> to&nbsp;create a pager for your layers.</p>
`,

  'apply-styles-title': 'Apply styles',
  'apply-styles-content': `
<p>
  Apply colour and background styles to&nbsp;your layers and solids according to&nbsp;your classname configuration passed in&nbsp;data attribute or&nbsp;options.
  I&rsquo;m using <a href="https://en.bem.info/methodology/">BEM methodology</a> in&nbsp;this example.
</p>
`,

  'dont-import-if-umd-line-1': `You don't have to import immerser`,
  'dont-import-if-umd-line-2': `if you're using it in browser as global variable`,
  'data-attribute-will-override-this-option-line-1': 'this option will be overridden by options',
  'data-attribute-will-override-this-option-line-2': 'passed in data-immerser-layer-config attribute in each layer',

  'initialize-immerser-title': 'Initialize Immerser',
  'initialize-immerser-content': `<p>Include immerser in&nbsp;your code and create immerser instance with options.</p>`,

  'callback-on-init': 'callback on init',
  'callback-on-bind': 'callback on bind',
  'callback-on-unbind': 'callback on unbind',
  'callback-on-destroy': 'callback on destroy',
  'callback-on-active-layer-change': 'callback on active layer change',

  'how-it-works-title': 'How it Works',
  'how-it-works-content': `
<p>First, immerser gathers information about the layers, solids, window and document. Then it&nbsp;creates a&nbsp;statemap for each layer, containing all necessary information, when the layer is&nbsp;partially and fully in&nbsp;viewport.</p>
<p>After that immerser modifies DOM, cloning all solids into mask containers for each layer and applying the classnames given in&nbsp;configuration. If&nbsp;you have added a&nbsp;pager, immerser also creates links for layers.</p>
<p>Finally, immerser binds listeners to&nbsp;scroll and resize events. On&nbsp;resize, it&nbsp;will meter layers, the window and document heights again and recalculate the statemap.</p>
<p>On&nbsp;scroll, immerser moves a&nbsp;mask of&nbsp;solids to&nbsp;show part of&nbsp;each solid group according to&nbsp;the layer below.</p>
`,

  'options-title': 'Options',
  'options-content': `
<p>
  You can pass options to immerser as data-attributes on layers or as object as function parameter. Data-attributes are
  processed last, so they override the options passed to the function.
</p>
`,

  option: 'option',
  type: 'type',
  default: 'default',
  description: 'description',

  'option-solidClassnameArray':
    'Array of layer class configurations. Overriding by config passed in data-immerser-layer-config for corresponding layer. Configuration example <a href="#initialize-immerser">is shown above</a>',
  'option-fromViewportWidth': 'A viewport width, from which immerser will init',
  'option-pagerThreshold': 'How much next layer should be in viewport to trigger pager',
  'option-hasToUpdateHash': 'Flag to control changing hash on pager active state change',
  'option-scrollAdjustThreshold':
    'A distance from the viewport top or bottom to the section top or bottom edge in pixels. If the current distance is below the threshold, the scroll adjustment will be applied. Will not adjust, if zero passed',
  'option-scrollAdjustDelay': 'Delay after user interaction and before scroll adjust',
  'option-pagerLinkActiveClassname': 'Added to each pager link pointing to active',
  'option-isScrollHandled': 'Binds scroll listener if true. Set to false if you\'re using remote scroll controller',
  'option-onInit': 'Fired after initialization. Accept an immerser instance as the only parameter',
  'option-onBind': 'Fired after binding DOM. Accept an immerser instance as the only parameter',
  'option-onUnbind': 'Fired after unbinding DOM. Accept an immerser instance as the only parameter',
  'option-onDestroy': 'Fired after destroy. Accept an immerser instance as the only parameter',
  'option-onActiveLayerChange':
    'Fired after active layer change. Accept active layer index as first parameter and an immerser instance as second',

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
  'handle-dom-change-title': 'Handle DOM change',
  'handle-dom-change-content': `
<p>
  Immerser is not aware of changes in DOM, if you dynamically add or remove nodes. If you change height of the document 
  and want immerser to recalculate and redraw solids, call <code>onDOMChange</code> method on the immerser instance.
</p>
`,
};
