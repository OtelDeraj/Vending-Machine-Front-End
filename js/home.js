$(document).ready(function(){
    $(".addMoney").click(addFunds);
    function getAllItems(){
        $.ajax({
            type: "GET",
            url: "http://tsg-vending.herokuapp.com/items",
        })
        .done(function(data){

            $("#itemMenu").empty();
            console.log(data);

            $.each(data, function(i, d){

                $("#itemMenu").append(`
                <div class="card col-md-3 itemCard" style="display: inline-block">
                    <div class="card-header">
                        <p>${d.id}</p>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${d.name}</h5>
                    
                        <p class="card-text">$${d.price.toFixed(2)}</p>
                        <h6 class="card-subtitle mb-2 text-muted">Quantity Left: ${d.quantity}</h6>
                        <button class="badge-pill selectItem">Select Item</button>
                    </div>
                </div>
                `);
            });

        }).fail(function(jqXHR, textStatus, errorThrown){
            alert("You ARE the weakest link.");
        });
    }

    function addFunds(event){
        let funds = $("#fundsDisplay").val();
        if(funds.length === 0) {
            funds = 0;
        } else {
            funds = parseFloat(funds);
        }
        switch(event.target.id){
            case "dollarBtn":
                funds += 1.00;
                break;
            case "quarterBtn":
                funds += 0.25;
                break;
            case "dimeBtn":
                funds += 0.10;
                break;
            case "nickelBtn":
                funds += 0.05;
                break;
        }
        $("#fundsDisplay").val(funds.toFixed(2).toString());
    }

    getAllItems();
});