import Vue from 'vue';
import _ from 'lodash';
const Fabric = require("fabric").fabric;

import './style.less';

import VueI18n from 'vue-i18n';
import i18n from './traductions.js';
Vue.use(VueI18n);

window.Fonoimage = class Fonoimage {
  constructor (el, archive) {
    this.app = new Vue({
      el,
      components: { },
      data: {
        el, archive,
        configuration: {parametres:{}}
      },
      i18n,
      methods: { },
      computed: { },
      mounted: function () {
        let application = this.$refs.application_fonoimage;
        
        this.canva = new Fabric.Canvas('canva-fonoimage', {/*
          width: application.offsetWidth,
          height: application.offsetHeight
        */});

        this.canva.on('mouse:down', (e) => {

          // Si on clique sur le background
          if(!e.target) {
            console.log('click');
          }
        })

        var rect = new Fabric.Rect({
          top : 0,
          left : 0,
          width : 60,
          height : 70,
          fill : 'red',
          stroke: 'black',
          strokeWidth: '2'
        });

        var ellipse = new Fabric.Ellipse({
          top: 200,
          left: 200,
          rx: 20,
          ry: 40,
          fill : 'blue',
          stroke: 'black',
          strokeWidth: '2'
        });

        ellipse.on('mouse.down', function (e) {
          console.log('ellipse', e.target);
        })

        rect.on('mouse.down', function (e) {
          console.log(e.target);
        })

        this.canva.add(rect);
        this.canva.add(ellipse);
      },
      template: `
      <div class="fonoimage">
        <menu>
          Menu
        </menu>
        <section class="app-fonoimage" ref="application_fonoimage">
          <canvas id="canva-fonoimage" ref="canva_fonoimage"></canvas>
        </section>
      </div>`
    });
  }
}
