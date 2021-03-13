export default {
  props: [canva, coords_ellipse, ctx_audio, stream_enregistrement],
  data: function () {
    return { 
      noeud_sortie: this.ctx_audio.createGain(),
      stream_enregistrement: this.stream_enregistrement
    }
  },
  methods: {
  },
  computed: {
  },
  mounted: function () {

    // Creer le visuel
    var ellipse = new Fabric.Ellipse({
      top: coords_ellipse.y,
      left: coords_ellipse.x,
      rx: coords_ellipse.w,
      ry: coords_ellipse.h,
      stroke: 'blue',
      strokeWidth: 5,
      fill: 'transparent'
    }).on('selected', () => { 
      this.afficher_fonofone(nouvelle_zone); 
    });

    this.canva.add(ellipse);
    this.fonofone = new Fonofone(this.$refs.container_fonofone, {
      ctx_audio: this.ctx_audio,
      noeud_sortie: this.noeud_sortie
    });
  },
  template: ` <div ref="container_fonofone"></div> `
};
