$(document).ready(function(){
    $(".addMoney").click(addFunds);
    $("#changeReturn").click(returnChange);
    $("#makePurchase").click(makePurchase);
    let isSuccessful = false;
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
                        <p style="font-weight: bold" class="card-title">${d.name}</p>
                    
                        <p class="card-text">$${d.price.toFixed(2)}</p>
                        <h6 class="card-subtitle mb-2 text-muted">Quantity Left: ${d.quantity}</h6>
                        <button id="${d.id}" class="badge-pill selectItem">Select Item</button>
                    </div>
                </div>
                `);

                $(`#${d.id}`).click(selectItem);
            });

        }).fail(function(jqXHR, textStatus, errorThrown){
            alert("You ARE the weakest link.");
        });
    }



    function addFunds(event){
        checkIsSuccessful();
        let funds = $("#fundsDisplay").val();
            funds = parseFloat(funds);
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

    function makePurchase(){
        let funds = $("#fundsDisplay").val();
        let itemId = $("#itemNumDisplay").val();

        $.ajax({
                type: "POST",
                url: `http://tsg-vending.herokuapp.com/money/${funds}/item/${itemId}`,
            }).done(function(data){
                clearAllInputs();
                displayMessage("Thank You!!!");
                displayChange(data);
                getAllItems();
                isSuccessful = true;
            }).fail(function(jqXHR, textStatus, errorThrown){
                displayMessage(`${jqXHR.responseJSON.message}`);
            })
    }

    function selectItem(event){
        checkIsSuccessful();
        $("#itemNumDisplay").val(event.currentTarget.id);
    }

    function displayChange(change){
        let changeString = "";
        for(let coin in change){
            if(change[coin] > 0){
                changeString += `${change[coin]} ${coin}, `;
            }
        }
        if(changeString.length < 1) changeString = "No Change"
        $("#changeDisplay").val(changeString);

    }

    function displayMessage(message){
        $("#messageDisplay").val(message);
    }

    function returnChange(){
        checkIsSuccessful();
        // get the value of funds
        let fundString = $("#fundsDisplay").val();
        if(fundString.length < 1) return clearAllInputs();
        let funds = parseFloat(fundString);
        
        // calculate coins {quarters: 0, dimes: 0, nickels: 0, pennies: 0}
        let change = {
            quarters: 0,
            dimes: 0,
            nickels: 0,
            pennies: 0
        }
        while(funds.toFixed(2) > 0){
            switch(true){
                case funds.toFixed(2) >= 0.25:
                    change.quarters += 1;
                    funds -= 0.25;
                    break;
                case funds.toFixed(2) >= 0.10:
                    change.dimes += 1;
                    funds -= 0.10;
                    break;
                case funds.toFixed(2) >= 0.05:
                    change.nickels += 1;
                    funds -= 0.05;
                    break;
                case funds.toFixed(2) >= 0.01:
                    change.pennies += 1;
                    funds -= 0.01;
                    break;
            }
        }
        clearAllInputs();
        displayChange(change);
        // pass coin object into displayChange
    }

    function clearAllInputs(){
        $("#fundsDisplay").val("0.00");
        $("#messageDisplay").val("");
        $("#itemNumDisplay").val("");
        $("#changeDisplay").val("");
    }

    function checkIsSuccessful(){
        if(isSuccessful){
            clearAllInputs();
            isSuccessful = false;
        }
    }

    getAllItems();
});