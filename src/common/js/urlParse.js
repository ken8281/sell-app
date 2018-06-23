/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */

 export function urlParse () {
 	let urlSearch = window.location.search;
 	let obj = {};
 	let re = /[?&][^?&]+=[^?&]+/g;
 	let arr = urlSearch.match(re);
 	if (arr) {
 		arr.forEach((item) => {
 			let temp = item.substring(1).split('=');
 			let key = decodeURIComponent(temp[0]);
 			let value = decodeURIComponent(temp[1]);
 			obj[key] = value;
 		});
 	}
 	return obj;
 }