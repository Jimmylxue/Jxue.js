import { changeContentValue, getVal } from './compileTools'
import { baseConfig } from './baseInterface'

export function textUpdate(node: HTMLElement, text: string): void {
	node.textContent = text
}

export function showUpdate(
	node: HTMLElement,
	vm: baseConfig,
	reactive: string
): void {
	console.log(getVal(vm, reactive), 'flag')
	if (getVal(vm, reactive)) {
		node.style.display = 'block'
	} else {
		node.style.display = 'none'
	}
}

export function modelUpdate(
	node: HTMLInputElement,
	vm: baseConfig,
	reactive: string
): void {
	node.value = getVal(vm, reactive)
}

export function htmlUpdate(node: HTMLElement, text: string) {
	/**
	 * innerHTML的功能实际上是非常强大的
	 *  相当于修改的是容器下面的html代码 而不是单纯的只是修改容器下的我文本信息
	 *  如果传递innerhtml的值是富文本，那么这里的逻辑实际上是会先将富文本的内容以代码的形式放到容器里面
	 *  最终浏览器再进行渲染  功能非常之强大
	 */
	node.innerHTML = text
}

export function forUpdate(node: HTMLElement, arr: object, vm): void {
	/**
	 * for循环 --
	 * 	这里有优化空间 直接使用真实DOM操作了 浪费性能的
	 */
	let fragment: DocumentFragment = document.createDocumentFragment()
	let innerHtml = node.innerHTML
	let parent = node.parentNode
	Object.values(arr).map(item => {
		let value = changeContentValue(vm, innerHtml, item)
		node.innerHTML = value
		let tempNode = node.cloneNode(true)
		fragment.appendChild(tempNode)
	})
	;(parent as HTMLElement).innerHTML = ''
	parent.appendChild(fragment)
}
