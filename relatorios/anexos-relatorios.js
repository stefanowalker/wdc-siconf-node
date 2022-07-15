
console.log("dentro anexos-relatorios.js");

(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    console.log("DENTRO FUNCAO getSchema");

    const myCols = [
      { id: "esfera",
        dataType: tableau.dataTypeEnum.int,
      },
      { id: "demonstrativo",
        dataType: tableau.dataTypeEnum.string,
      },
      { id: "anexo",
        dataType: tableau.dataTypeEnum.int,
      }
    ];

    let myTableSchema = {
      id: "anexos-relatorios",
      alias: "anexos-relatorios",
      columns: myCols,
    };

    schemaCallback([myTableSchema]);

  };

  myConnector.getData = function (table, doneCallback) {
    console.log("DENTRO FUNCAO getData");

    let tableData = [];
    var i = 0;
    var offset = 0;
    var temmais = false;
    var limitepaginacao = 0; 

    do {

      $.getJSON(
        "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/anexos-relatorios?&offset=" + offset,
        function (resp) {
          console.log ("resp.limit = ", resp.limit);
          limitepaginacao = resp.limit; 

          console.log ("resp.hasMore = ", resp.hasMore); 
          temmais = resp.hasMore;

          // Iterate over the JSON object

          for (i = 0, len = resp.items.length; i < len; i++) {
            tableData.push({
              esfera: resp.items[i].esfera,
              demonstrativo: resp.items[i].demonstrativo,
              anexo: resp.items[i].anexo,
            });
          }

          table.appendRows(tableData);
          doneCallback();
          console.log("iterou sobre o objeto");
        }
      ); // fim json

      offset = offset + limitepaginacao; // aumenta o valor do inicio da proxima paginacao

    } while (temmais);
  };

  tableau.registerConnector(myConnector);
  console.log(" tableau.registerConnector(myConnector); ");

})();
// fim function self-involking 


document.querySelector("#getData").addEventListener("click", getData);

function getData() {
  tableau.connectionName = "ANEXOS-RELATORIOS SICONF";
  tableau.submit();
}

