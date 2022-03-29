
const Operators = {
    EQUALS: '=',
    EQUALS2: '==',
    EQUALS3: '===',
    NOT_EQUAL: '!=',
    LESS_THAN: '<',
    GREATER_THAN: '>',
    LESS_THAN_OR_EQUAL: '<=',
    GREATER_THAN_OR_EQUAL: '>=',
    IS: 'is',
    INSTANCE: 'instanceof',
    IS_NOT: 'is not',
    NOT: 'not' 

}
function getInheritanceChain(targetObject){
    const list = [];
    let obj = targetObject;
    while(!obj.constructor || obj.constructor.name !== 'Object'){
        obj = obj.__proto__;
        list.push(obj.constructor.name);
    }
    return list;
}
function selector(scope, filters){
    const descendants = getDescendants(scope);
    if(filters && filters.length){
        return descendants.filter(item => filters.filter(_item => executeFilter(item, _item)).length === filters.length);
    }
    else{
        return descendants;
    } 
}
function getDescendants(scope, _collection){
    let collection = _collection ? _collection : [];
    if(scope.children){
        scope.children.forEach(item => {
            collection.push(item);
            getDescendants(item, collection);
        });
    }
    return collection;
}
function executeFilter(object, evaluator){
    console.log(evaluator);
    console.log(object);
    console.log(getInheritanceChain(object).includes(evaluator));
    const property = evaluator.property;
    const operator = evaluator.operator;
    const value = evaluator.value;
    switch(operator){
        case Operators.IS:
        case Operators.INSTANCE:{
            return getInheritanceChain(object).includes(value);
        }
        case Operators.IS_NOT:
        case Operators.NOT:{
            return !getInheritanceChain(object).includes(value);
        }
        case Operators.EQUALS:
        case Operators.EQUALS2:
        case Operators.EQUALS3:{
            return object[property] === value;
        }
        case Operators.NOT_EQUAL:{
            return object[property] !== value;
        }
        case Operators.GREATER_THAN:{
            return object[property] > value;
        }
        case Operators.LESS_THAN:{
            return object[property] < value;
        }
        case Operators.GREATER_THAN_OR_EQUAL:{
            return object[property] >= value;
        }
        case Operators.LESS_THAN_OR_EQUAL:{
            return object[property] <= value;
        }
        default:{
            return getInheritanceChain(object).includes(evaluator)
        }
    }
}

export { getDescendants, selector };