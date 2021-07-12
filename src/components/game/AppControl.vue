<template>
	<div id="control-container">

		<div class="pointer-type-control">
			<v-btn
				v-for="(btn, i) in pointerBtns"
				:key="'control-btn-' + i"
  				icon
				outlined
				class="pointer-type-btn"
				:class="btn.type == activeType ? 'btn-active' : ''"
				@click="setPointerType(btn.type)"
			>
				<v-icon 
					dense 
					class="btn-icon"
				>
					mdi-{{btn.icon}}
				</v-icon>
			</v-btn>
		</div>
		
		<div class="menu-control">
			<v-dialog
				v-model="isMenuOpen"
				:width="fieldWidth + rowsWidth"
				persistent
			>
				<template v-slot:activator="{ on }">
					<v-btn
						icon
						outlined
						class="menu-btn"
						:class="menuBtnClass"
						v-on="on"
					>
						<v-icon 
							dense
							class="btn-icon"
						>
							mdi-{{menuBtnIcon}}
						</v-icon>
					</v-btn>
				</template>

				<v-card class="menu-card">
					<div class="menu-title">Дополнительно</div>
					<div 
						v-for="(menuGroup, j) in settings"
						:key="'menu-group-' + j"
					>
						<v-divider class="menu-line"></v-divider>
						<div class="menu-subtitle">
							{{menuGroup.title}}:
						</div>
						<div
							v-for="(menuItem, i) in menuGroup.items"
							:key="'menu-item-' + j + '-' + i"
							class="menu-switch-container"
						>
							<v-switch
								v-model="menuLocalSettings[j].items[i].value"
								:label="menuItem.propertyName"
								hide-details
								class="menu-switch"
							></v-switch>
						</div>
					</div>
					
					<v-divider class="menu-line"></v-divider>

					<v-card-actions class="justify-end">
						<v-btn 
							text 
							color="red"
							@click="menuCloseClick"
						>
							close
						</v-btn>

						<v-btn 
							text 
							color="primary"
							@click="menuSaveClick"
						>
							save
						</v-btn>
					</v-card-actions>
					
				</v-card>
			</v-dialog>
			
		</div>
		
		
	</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

// возвращает состояние settings (только id и value)
const resetMenuLocalSettings = (settings) => {
	return settings.map((group) => {
		return {
			id: group.id,
			items: group.items.map((item) => {
				return {
					id: item.propertyID,
					value: item.value,
				}
			})
		}
	})
}

export default {
	created () {
		// запоминаем настройки
		this.menuLocalSettings = resetMenuLocalSettings(this.settings)
	},

	data: () => ({
		// кнопки для типов указателя
		pointerBtns: [
			{
				icon: 'checkbox-multiple-blank',
				type: -1,
			},
			{
				icon: 'checkbox-intermediate',
				type: 1,
			},
			{
				icon: 'close-box-outline',
				type: 2,
			},
			{
				icon: 'checkbox-blank-outline',
				type: 0,
			},
			{
				icon: 'help-box',
				type: 3,				
			},
		],

		// открыто ли меню
		isMenuOpen: false,

		// настройки (изменяются раньше глобальных)
		menuLocalSettings: [],

	}),
	computed: {
		...mapGetters('field', {
			activeType: 'getPoinerType',
			fieldWidth: 'getFieldWidth',
			settings: 'getSettings',
		}),
		...mapGetters('nums', {
			rowsWidth: 'getRowsWidth',
		}),

		// иконка кнопки меню (два значения чтоб можно было поменять)
		menuBtnIcon (){
			return this.isMenuOpen ? 'tune-variant' : 'tune-variant'
		},
		// стиль кнопок
		menuBtnClass (){
			return {
				'btn-active': this.isMenuOpen
			}
		},

	},
	methods: {
		...mapActions ('field', {
			setPointerType: 'setPointerType',
			setProperty: 'setProperty',
		}),

		// закрытие меню (без сохранения)
		menuCloseClick () {
			// закрываем
			this.isMenuOpen = false
			// синхронизируем локальные настройки с глобальными
			this.menuLocalSettings = resetMenuLocalSettings(this.settings)
		},

		// сохранение настроек и закрытие меню
		menuSaveClick () {
			//  закрываем
			this.isMenuOpen = false
			// запоминаем глобальное
			let currSettings = this.settings

			currSettings.forEach((group, j) => {
				group.items.forEach((item, i) => {
					
					// сравниваем с локальным
					if (this.menuLocalSettings[j].items[i].value != item.value) {
						// меняем
						this.setProperty({
							id: item.propertyID,
							value: this.menuLocalSettings[j].items[i].value,
						})

					}

				})
			});

			// на всякий случай синхронизируем
			this.menuLocalSettings = resetMenuLocalSettings(this.settings)
		},
	}
}
</script>

<style lang="scss" scoped>
	@import '../../assets/scss/_vars.scss';

	.menu-card {
		min-height: 200px;
		height: auto;
		overflow: hidden;

		.menu-title {
			font-size: 24px;
			padding: 20px 0 0 20px;
		}

		.menu-subtitle {
			padding: 10px 0 5px 25px;
		}

		.menu-switch-container {
			margin: 0 20px 10px 40px;
		}

		.menu-switch-container > .menu-switch {
			margin: 0;
		}

		.menu-line {
			margin-top: 20px;
		}
	}

	@media (max-width: 360px) {
		.menu-card {
			.menu-title {
				font-size: 20px;
				padding: 15px 0 0 0;
				text-align: center;
			}
			.menu-line {
				margin-top: 10px;
			}
			.menu-subtitle {
				padding: 10px 0 5px 30px;
			}
			.menu-switch-container {
				margin: 0 20px 10px 20px;
			}
		}
		
	}

	#control-container {
		box-sizing: border-box;
		margin-top: 0px;
		width: 100%;
		height: 64px;
		background-color: $control-bg;
		border: 3px solid #000000;
		border-top: none;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;

		.pointer-type-control {

			.pointer-type-btn {
				margin: 0 5px 0 10px;
				border-width: 2px;
				border-color: $control-pointer-type;

				.btn-icon{
					color: $control-pointer-type;
				}
			}
			.pointer-type-btn.btn-active {
				border-width: 3px;
				border-color: $control-pointer-type-active;
				pointer-events: none;
				margin: 0 4px 0 9px;
		
				.btn-icon {
					color: $control-pointer-type-active;
				}
			}
		}

		
		.menu-control {
			.menu-btn {
				margin-right: 10px;
				border-width: 2px;
				border-color: $control-pointer-type;

				.btn-icon{
					color: $control-pointer-type;
				}
			}
			.menu-btn.btn-active {
				border-color: $control-pointer-type-active;

				.btn-icon{
					color: $control-pointer-type-active;
					transform: rotate(360deg);
				}
			}
		}
	}
</style>



