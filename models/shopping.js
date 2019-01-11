//Shopping list
module.exports = function Shopping(shoppingItems) {
    this.items = shoppingItems.items || {};
    this.totalQty = shoppingItems.totalQty || 0;
    this.totalPrice = shoppingItems.totalPrice || 0;

    /*If the users checks the item, then in the shopping list page items quantity
    and price is displayed along with the item name
     */
    this.add = function(item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            haveItem = this.items[id] = {item: item, qty: 0, price: 0, id: id};
        }
        haveItem.qty++;
        haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty++;
        this.totalPrice += haveItem.item.price;
    };

    //Creating the array for the shoppingList
    this.shoppingArr = function() {
        var shoppingList = [];
        for (var id in this.items) {
            shoppingList.push(this.items[id]);
        }
        //console.log(shoppingList);
        return shoppingList;
    };

    //Helps user to decrease the quantity of item  that has been moved to the shoppingList
    this.decrement = function (item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            haveItem = this.items[id] = {item: item, qty: 0, price: 0, id: id};
        }
        haveItem.qty--;
        haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty--;
        this.totalPrice -= haveItem.item.price;

        if(haveItem.qty < 1){ // zero or negative, basic check for zero but covering negative is extra safety
            delete this.items[id];
        }


    };

    //Helps user to increase the quantity of item while that has been moved to the shoppingList
    this.increment = function (item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            haveItem = this.items[id] = {item: item, qty: 0, price: 0, id: id};
        }
        haveItem.qty++;
        haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty++;
        this.totalPrice += haveItem.item.price;


    };

    //Help user to remove the item that has been moved to the shoppingList
    this.remove = function (item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            return;
        }
        //haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty -= haveItem.qty;
        this.totalPrice -= haveItem.price;

        delete this.items[id];
    };
};
