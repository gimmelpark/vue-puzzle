
import 'vue-resize/dist/vue-resize.css'

import Vue from 'vue'
import Vuex from 'vuex'


import field from './puzzle/field'
import data from './puzzle/data'
import nums from './puzzle/nums'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		field,
		data,
		nums
	},
	strict: process.env.NODE_ENV !== 'production'
})
