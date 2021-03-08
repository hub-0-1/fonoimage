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
        zone_actif: null,
        zones: {}
      },
      i18n,
      methods: {
        exporter: function () {
          console.log(JSON.stringify(this.canva));
        },
        ajouter_zone: function (x, y, w, h) {
          let nouvelle_zone = {id: `zone-${Date.now()}-${Math.round(Math.random() * 50)}`};
          this.zones[nouvelle_zone.id] = nouvelle_zone;

          // Fonctionnalites
          nouvelle_zone.container_fonofone = document.createElement("div");
          nouvelle_zone.fonofone = new Fonofone(nouvelle_zone.container_fonofone, 'dauphin');
          this.$refs.panneau_fonofone.appendChild(nouvelle_zone.container_fonofone);

          // Visuel
          var ellipse = new Fabric.Ellipse({
            top: y, left: x, rx: w, ry: h,
            stroke: 'blue',
            strokeWidth: 5,
            fill: 'transparent'
          }).on('selected', () => { 
            this.afficher_fonofone(nouvelle_zone); 
          });

          this.canva.add(ellipse);
          this.afficher_fonofone(nouvelle_zone);
        },
        afficher_fonofone: function (zone_active) {
          this.zone_actif = zone_active;

          // Cacher les autres zones
          _.each(this.zones, (zone) => { zone.container_fonofone.style.display = "none"; });

          // Afficher la zone selectionnee
          this.zone_actif.container_fonofone.style.display = "initial";
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
            this.zone_actif = null; 

            // Creation d'une nouvelle zone
            if(this.mode == "ajout:pret") {
              this.mode = "ajout:encours";
              let init_event = options.e;
              let coords = [{
                x: options.absolutePointer.x,
                y: options.absolutePointer.y
              }];

              // Affichage shadow
              this.$refs.shadow.style.left = options.e.clientX + "px";
              this.$refs.shadow.style.top = options.e.clientY + "px";
              this.$refs.shadow.style.width = 0;
              this.$refs.shadow.style.height = 0;

              // Creer a la fin du drag
              this.canva.on('mouse:up', (options) => {
                this.canva.off('mouse:move');
                this.canva.off('mouse:up');

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
                this.$refs.shadow.style.width = (options.e.clientX - init_event.clientX) + "px";
                this.$refs.shadow.style.height = (options.e.clientY - init_event.clientY) + "px";
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
            <div class="panneau-fonofone" :class="{actif: zone_actif}" ref="panneau_fonofone">
            </div>
          </div>
        </section>
        <div class="shadow" :class="{actif: mode == 'ajout:encours'}" ref="shadow"></div>
      </div>`
    });
  }
}
