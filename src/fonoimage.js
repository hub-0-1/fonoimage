import Vue from 'vue';
import _ from 'lodash';
const Fabric = require("fabric").fabric;

import './style.less';
import Image from './images/image.svg';
import Ellipse from './images/ellipse.svg';

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
        configuration: {parametres:{}},
        mode: 'normal',
        fonofone_actif: null,
        fonofones: {} 
      },
      i18n,
      methods: {
        exporter: function () {
          console.log(JSON.stringify(this.canva));
        },
        ajouter_zone: function (x, y, w, h) {

          // Fonctionnalites
          let container_fonofone = document.createElement("div");
          this.$refs.panneau_fonofone.appendChild(container_fonofone);

          let fonofone = new Fonofone(container_fonofone, 'dauphin');

          // Visuel
          var ellipse = new Fabric.Ellipse({
            top: y, left: x, rx: w, ry: h,
            fill: 'blue'
          }); 
          ellipse.on('selected', (options) => {
            this.fonofone_actif = fonofone;
          });
          this.canva.add(ellipse);
        }
      },
      computed: { },
      mounted: function () {
        let application = this.$refs.application_fonoimage;

        this.canva = new Fabric.Canvas('canva-fonoimage', {
          width: application.offsetWidth,
          height: application.offsetHeight
        });

        this.canva.on('mouse:down', (options) => {
          if(!options.target) { 

            // Reset affichage
            this.fonofone_actif = null; 

            let shadow_el = document.createElement('div');
            shadow_el.className = "shadow";
            
            application.appendChild(shadow_el);

            // Ecouter creation
            this.canva.on('mouse:up', (options) => {
              this.canva.off('mouse:move');
              application.removeChild(shadow_el);
            });

            this.canva.on('mouse:move', (options) => {
              console.log(options);
            });
          }
        });

        this.ajouter_zone(0, 0, 20, 50);
      },
      template: `
      <div class="fonoimage">
        <menu class="horizontal">
          Menu
        </menu>
        <section class="principal">
          <menu class="vertical">
            <div class="icone-wrapper" @click="mode = 'ajout'">
              <img src="${Ellipse}">
            </div>
          </menu>
          <div class="app-fonoimage" ref="application_fonoimage">
            <canvas id="canva-fonoimage" ref="canva_fonoimage"></canvas>
            <div class="panneau-fonofone" :class="{actif: fonofone_actif}" ref="panneau_fonofone">
            </div>
          </div>
        </section>
      </div>`
    });
  }
}
