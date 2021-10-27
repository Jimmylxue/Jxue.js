import Watcher from './watcher'
import DirectivError, { warn } from './error'
import Jvue from './jvue'
import { baseConfig } from './baseInterface'
import { textUpdate, showUpdate, modelUpdate, htmlUpdate } from './update'
import { DirectiveType } from './directive'

export function getVal(vm: baseConfig, expr): string {
	// 根据表达式取出对应的数据
	// 数据有可能是  student.name  student.age
	return expr.split('.').reduce((data, current) => {
		return data[current]
	}, vm.data)
}

export function getContentValue(vm, expr): string {
	// 遍历表达式  将内容重新替换成完整的内容返回
	return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
		return getVal(vm, args[1])
	})
}

export function transferText(node: HTMLElement, expr: string, vm): void {
	/**
	 *  expr => {{a}}  {{student.name}}
	 */
	// 执行转 reactive
	console.log('TEXT_DIRECTIVE')
	let fn = textUpdate
	let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
		let reactive = args[1]
		new Watcher(vm, reactive, () => {
			fn(node, getContentValue(vm, expr))
		})
		return getVal(vm, reactive)
	})
	fn(node, content)
}

/**
 * 事件处理
 *  v-on
 */
export function onDirective(
	node: HTMLElement,
	expr: string,
	vm: baseConfig,
	eventName: any,
	app: Jvue
): void {
	console.log('ON(@)_DIRECTIVE')
	node.addEventListener(eventName, e => {
		console.log(vm, expr, 'onDirective')
		vm.method[expr].call(app, e)
	})
}

/**
 * 指令处理
 *  v-show
 */
export function showDirective(
	node: HTMLElement,
	value: string,
	vm: baseConfig
): void {
	console.log('SHOW_DIRECTIVE')
	let fn = showUpdate
	new Watcher(vm, value, () => {
		fn(node, vm, value)
	})
	fn(node, vm, value)
}

/**
 * 指令处理
 *  v-model
 */

export function modelDirective(
	// 目前只有 input标签 支持v-model
	node: HTMLInputElement,
	reactive: string,
	vm: baseConfig,
	app: Jvue
): void {
	console.log('MODEL_DIRECTIVE', node.tagName)
	if (node.tagName !== 'INPUT') {
		// throw new DirectivError(1, `${node.tagName}无法使用model指令`);
		warn(`${node.tagName}无法使用model指令`)
	}
	console.log('定！！')
	node.addEventListener('input', (e: any) => {
		let inputValue = e.target.value
		/**
		 * 手动触发修改 相当于执行一次bind指令 触发页面更新
		 */
		app[reactive] = inputValue
		console.log('改变了', reactive, app)
	})
	let fn = modelUpdate
	new Watcher(vm, reactive, () => {
		fn(node, vm, reactive)
	})
	fn(node, vm, reactive)
}

/**
 * 指令处理
 *  v-html
 */
export function htmlDirective(
	node: HTMLInputElement,
	reactive: string,
	vm: baseConfig
): void {
	let fn = htmlUpdate
	let value = getVal(vm, reactive)
	new Watcher(vm, reactive, () => {
		fn(node, value)
	})
	fn(node, value)
}

export function getDirectiveType(expr: string): number {
	// 判断表达式 是否是vue的特殊指令
	// v-if=" " @click=""
	let flag = null
	if (expr.split('-')[0] === 'v') {
		let str = expr.slice(2)
		switch (str.split('=')[0]) {
			case 'if':
				flag = DirectiveType.IF_DIRECTIVE
				break
			case 'show':
				flag = DirectiveType.SHOW_DIRECTIVE
				break
			case 'on':
				flag = DirectiveType.ABBR_DIRECTIVE
				break
			case 'model':
				flag = DirectiveType.MODEL_DIRECTIVE
				break
			case 'html':
				flag = DirectiveType.HTML_DIRECTIVE
				break
			default:
				flag = DirectiveType.NONE_DIRECTIVE
		}
	} else if (expr.startsWith('@')) {
		flag = DirectiveType.ABBR_DIRECTIVE
	} else {
		flag = DirectiveType.NONE_DIRECTIVE
	}
	return flag
}
