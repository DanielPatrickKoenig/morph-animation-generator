
const Operators = {
    EQUALS: '=',
    EQUALS2: '==',
    EQUALS3: '===',
    NOT_EQUAL: '!=',
    LESS_THAN: '<',
    GREATER_THAN: '>',
    LESS_THAN_OR_EQUAL: '<=',
    GREATER_THAN_OR_EQUAL: '>='

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
function castValue(v){
    const table = {
        'false': false
    };
    
    return table[v] !== undefined ? table[v] : (!isNaN(v) ? Number(v) : v);
}
function stringToEvaluator(evaluator){
    const validOperators = Object.keys(Operators).map(item => Operators[item]).filter(item => evaluator.includes(item));
    if(validOperators.length){
        const selectedOperator = validOperators.sort((a, b) => a.length - b.length).reverse()[0];
        const chunks = evaluator.split(selectedOperator);
        return {property: chunks[0], operator: selectedOperator, value: castValue(chunks[1])};
    }
    else{
        return evaluator;
    }
}
function executeFilter(object, evaluator){
    console.log(evaluator);
    console.log(object);
    console.log(getInheritanceChain(object).includes(evaluator));
    if(evaluator.split){
        evaluator = stringToEvaluator(
            evaluator
            .trim()
            .split('')
            .filter((item, index, arr) => !(index === 0 && item === '[') && !(index === arr.length - 1 && item === ']'))
            .join('')
        );

    }
    console.log(evaluator);
    const property = evaluator.property;
    const operator = evaluator.operator;
    const value = evaluator.value;
    switch(operator){
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