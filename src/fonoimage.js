import Vue from 'vue';
import _ from 'lodash';

import './style.less';

import VueI18n from 'vue-i18n';
import i18n from './traductions.js';
Vue.use(VueI18n);

window.Fonoimage = class Fonoimage {
  constructor (el, archive, ctx_audio) {
    this.app = new Vue({
      el,
      components: { },
      data: {
        el, archive, ctx_audio,
        configuration: {parametres:{}}
      },
      i18n,
      methods: { },
      computed: { },
      mounted: function () {

      },
      template: `
      <div class="fonoimage">
        <menu>
          Menu
        </menu>
        <section class="app-fonoimage">
          Fonoimage
        </section>
      </div>`
    });
  }
}
