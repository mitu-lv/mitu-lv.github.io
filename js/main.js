var shared = {

}


document.addEventListener("DOMContentLoaded", function(event) {
	var pg = document.getElementsByClassName("pg")[0];
	// var readonly = shared.readonly = document.getElementsByClassName("readonly")[0];
    // var blocks = shared.blocks = BlockFactory.create(readonly, 5, 5);

    var game = shared.game = desa(pg);

    game();

    // var inp = document.getElementsByClassName("inp")[0];
    // shared.inp = BlockFactory.create(inp, 1, 5);
});
