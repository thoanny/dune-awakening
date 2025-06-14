import './assets/main.css';
import 'tippy.js/dist/tippy.css';

import { createApp } from 'vue';
import router from './router';
import VueTippy from 'vue-tippy';

import App from './App.vue';

createApp(App)
	.use(router)
	.use(
		VueTippy,
		// optional
		{
			directive: 'tippy', // => v-tippy
			component: 'tippy', // => <tippy/>
			componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
			defaultProps: {
				placement: 'auto-end',
				allowHTML: true,
				followCursor: true,
			}, // => Global default options * see all props
		},
	)
	.mount('#app');
