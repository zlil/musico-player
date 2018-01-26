import Player from '../components/MusicoPlayer.vue';


export const routes = [
  { path:'/', component: Player, meta: { title: 'Musico' } },
  { path:'*', redirect: '/' },
];
