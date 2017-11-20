$(".dropdown-menu li a").click(function(){
  $(this).parents(".selectRegion").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".selectRegion").find('.btn').val($(this).data('value'));
});

var facts = [
	"The activation of Aatrox's Massacre can be heard faintly across the map.",
	"Jhin's favorite food is dumplings.",
	"Twitch can recall while invisible.",
	"After complaints from the community, Riot lowered Taric's V-neck even further.",
	"Vi in Latin means, 'with force' ",
	"Akali's dance is a reference to Beyonce's 'Single Ladies'",
	"Bard and Rek'Sai are the only champions that speak no actual words.",
	"According to Riot, Yasuo uses Patene to keep his hair flowing.",
	"Poros are actually sheeps in disguise.",
	"Ahri is a reference to the nine-tail fox in Korean folklore."
]

function newFact() {
	var randomNumber= Math.floor(Math.random() * (facts.length));
	document.getElementById('quoteFact').innerHTML = facts[randomNumber];
}
