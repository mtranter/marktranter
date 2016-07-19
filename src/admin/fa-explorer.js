export default class {
    getFaClasses(){
        var capture = /\.(fa-\w+)::before/g
        var allRules = [];
            var sSheetList = document.styleSheets;
            for (var sSheet = 0; sSheet < sSheetList.length; sSheet++)
            {
                var ruleList = document.styleSheets[sSheet].cssRules;
                for (var rule = 0; rule < ruleList.length; rule ++)
                {
                    if(ruleList[rule].selectorText){
                        var result;
                        while((result = capture.exec(ruleList[rule].selectorText)) !== null) {
                            allRules.push(result[1])
                        }
                    }
                        
                }
            }
            return allRules.sort();
    }
}