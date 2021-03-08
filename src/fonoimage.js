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
      data: {
        archive,
        configuration: {parametres:{}},
        mode: 'normal',
        fonofone_actif: null,
        zones: {}
      },
      i18n,
      methods: {
        exporter: function () {
          console.log(JSON.stringify(this.canva));
        },
        ajouter_zone: function (x, y, w, h) {
          let zone = {id: `zone-${Date.now()}-${Math.round(Math.random() * 50)}`};
          this.zones[zone.id] = zone;

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

          // Si on ne clique pas sur une zone
          if(!options.target) { 

            // Cacher les fonofones
            this.fonofone_actif = null; 

            if(this.mode == "ajout:pret") {
              this.mode = "ajout:encours";
              let coords = [{
                x: options.absolutePointer.x,
                y: options.absolutePointer.y
              }];

              // Affichage shadow
              console.log(options.e.clientX, options.e.clientY);
              this.$refs.shadow.style.left = options.e.clientX + "px";
              this.$refs.shadow.style.right = options.e.clientX + "px";
              this.$refs.shadow.style.top = options.e.clientY + "px";
              this.$refs.shadow.style.bottom = options.e.clientY + "px";

              // Creer a la fin du drag
              this.canva.on('mouse:up', (options) => {
                this.canva.off('mouse:move');
                coords.push({
                  x: options.absolutePointer.x,
                  y: options.absolutePointer.y
                })

                this.ajouter_zone(
                  Math.min(coords[0].x, coords[1].x), // x
                  Math.min(coords[0].y, coords[1].y), // y
                  Math.abs(coords[0].x - coords[1].x) / 2, // width
                  Math.abs(coords[0].y - coords[1].y) / 2// height
                );

                this.mode = "normal";
              });

              // Afficher le shadow
              this.canva.on('mouse:move', (options) => {
                this.$refs.shadow.style.right = options.e.clientX + "px";
                this.$refs.shadow.style.bottom = options.e.clientY + "px";
                console.log(options.e.clientX, options.e.clientY);
              });
            }
          }
        });
      },
      template: `
      <div class="fonoimage">
        <menu class="horizontal">
          Menu
        </menu>
        <section class="principal">
          <menu class="vertical">
            <div class="icone-wrapper" @click="mode = 'ajout:pret'">
              <img src="${Ellipse}">
            </div>
            <div class="icone-wrapper">
              <img src="${Image}">
            </div>
          </menu>
          <div class="app-fonoimage" ref="application_fonoimage">
            <canvas id="canva-fonoimage" ref="canva_fonoimage"></canvas>
            <div class="panneau-fonofone" :class="{actif: fonofone_actif}" ref="panneau_fonofone">
            </div>
          </div>
        </section>
        <div class="shadow" :class="{actif: mode == 'ajout:encours'}" ref="shadow"></div>
      </div>`
    });
  }
}
