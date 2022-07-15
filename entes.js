
console.log("This is working...");

(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    console.log("DENTRO FUNCAO getSchema");
    const myCols = [
      {
        id: "cod_ibge",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "ente",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "capital",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "regiao",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "uf",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "esfera",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "exercicio",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "populacao",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "cnpj",
        dataType: tableau.dataTypeEnum.string,
      },
    ];

    let myTableSchema = {
      id: "entes",
      alias: "entes",
      columns: myCols,
    };

    schemaCallback([myTableSchema]);
    console.log("CHAMOU schemaCallBack");

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
        //"https://apidatalake.tesouro.gov.br/ords/siconfi/tt/entes",
        "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/entes?&offset=" + offset,
        function (resp) {
          console.log ("resp.limit = ", resp.limit);
          limitepaginacao = resp.limit; 

          console.log ("resp.hasMore = ", resp.hasMore); 
          temmais = resp.hasMore;

          // Iterate over the JSON object

          for (i = 0, len = resp.items.length; i < len; i++) {
            tableData.push({
              cod_ibge: resp.items[i].cod_ibge,
              ente: resp.items[i].ente,
              capital: resp.items[i].capital,
              regiao: resp.items[i].regiao,
              uf: resp.items[i].uf,
              esfera: resp.items[i].esfera,
              exercicio: resp.items[i].exercicio,
              populacao: resp.items[i].populacao,
              cnpj: resp.items[i].cnpj,
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
  tableau.connectionName = "SICONF conexão ENTE";
  tableau.submit();
}

