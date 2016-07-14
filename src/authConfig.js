var configForDevelopment = {
    loginRedirect: '/#welcome',  
	providers: {        
		facebook:{
			clientId:'1078560385532336'
		}
	}
};

var configForProduction = {
	providers: {
		facebook:{
			clientId:'1078560385532336'
		}
	}
};
var config ;
if (window.location.hostname==='localhost') {
	config = configForDevelopment;
}
else{
	config = configForProduction;
}


export default config;