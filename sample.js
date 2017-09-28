function foo() {
	var a = 2;
	bar();
}

function bar() {
	console.log( a );
}

foo(); //undefined