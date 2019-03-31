import jp from 'jsonpath/jsonpath.min';

export const suggestions = [
    {
        'description': 'pick a value in a collection',
        'value': '[]',
        'setCarretAt': 1,
        'scopes': ['array']
    },
    {
        'description': 'get collection size',
        'value': '.length',
        'scopes': ['array']
    },
    {
        'description': 'access a specific property',
        'value': '.',
        'setCarretAt': 1,
        'scopes': ['array', 'object']
    },
    {
        'description': 'search recursively for a property',
        'value': '..',
        'setCarretAt': 2,
        'scopes': ['array', 'object']
    },
    {
        'description': 'filter a collection',
        'value': '?()',
        'setCarretAt': 2,
        'scopes': ['[]']
    },
    {
        'description': 'filter a collection - by one of it`s item value',
        'value': '@.',
        'setCarretAt': 2,
        'scopes': ['?()', '===']
    },
    {
        'value': ' ',
        'setCarretAt': 1,
        'scopes': []
    },
    {
        'description': 'equals',
        'value': '===',
        'scopes': [' ']
    },
    {
        'description': 'lesser',
        'value': '<',
        'scopes': [' ']
    },
    {
        'description': 'lesser or equals',
        'value': '<=',
        'scopes': [' ']
    },
    {
        'description': 'greater',
        'value': '>',
        'scopes': [' ']
    },
    {
        'description': 'greater or equals',
        'value': '>=',
        'scopes': [' ']
    },
    {
        'description': 'and',
        'value': '&&',
        'scopes': [' ']
    },
    {
        'description': 'or',
        'value': '||',
        'scopes': [' ']
    },
    {
        'value': 'all_properties',
        'scopes': ['.']
    },
    {
        'value': 'all_properties_of_parent_array',
        'scopes': ['@.']
    },
    {
        'value': 'all_properties_recursively',
        'scopes': ['..']
    },
    {
        'description': 'select an item by it\'s index relatively to the size of the collection',
        'value': '(@.length-1)',
        'setCarretAt': 12,
        'scopes': ['[]']
    },
    {
        'description': 'select a range of item by their indexes',
        'value': '0:1',
        'setCarretAt': 0,
        'scopes': ['[]']
    },
    {
        'description': 'retrieves last item in a collection',
        'value': '-1:',
        'scopes': ['[]']
    },
    {
        'description': 'get all values',
        'value': '.*',
        'scopes': ['array', 'object']
    },
    {
        'description': 'get all values',
        'value': '*',
        'scopes': ['[]', '.']
    },
];

export const getSuggestions = (jsonPath, caretPosition, jsonToTestAgainst) => {
    try {
        if (caretPosition !== jsonPath.length) {
            throw new Error('Force to eval options according to carret positions');
        }
        const filteredJson = jp.query(jsonToTestAgainst, jsonPath)[0];
        if (Array.isArray(filteredJson)) {
            return suggestions.filter(s => s.scopes.includes('array'));
        } else {
            // Get last jsonpath to offer available suggestions 
            const parentJsonPath = jsonPath.substring(0, jsonPath.lastIndexOf('.') + 1);
            // Compute extra json path value, to be used to filter available suggestions
            const filterSuggestionJsonPath = jsonPath.substring(jsonPath.lastIndexOf('.') + 1);
            let additionalSuggestions = [];
            if (parentJsonPath) {
                const appliableScopes = suggestions.filter(s => parentJsonPath.endsWith(s.value));
                additionalSuggestions = guessSuggestionsFromScopes(appliableScopes, caretPosition, parentJsonPath, jsonToTestAgainst);
            }
            return [...additionalSuggestions.filter(s => s.value.includes(filterSuggestionJsonPath) && s.value !== filterSuggestionJsonPath), ...suggestions.filter(s => s.scopes.includes('object'))];
        }
    } catch (e) {
        const appliableScopes = suggestions.filter(s => {
            if (typeof s.setCarretAt !== undefined) {
                const valueToBeBeforeCarret = s.value.substring(0, s.setCarretAt);
                const valueToBeAfterCarret = s.value.substring(s.setCarretAt);
                const jsonPathPartBeforeCarret = jsonPath.substring(0, caretPosition);
                const jsonPathPartAfterCarret = jsonPath.substring(caretPosition);

                return jsonPathPartBeforeCarret.endsWith(valueToBeBeforeCarret) && jsonPathPartAfterCarret.startsWith(valueToBeAfterCarret);
            }

            return jsonPath.endsWith(s.value);
        });
        return guessSuggestionsFromScopes(appliableScopes, caretPosition, jsonPath, jsonToTestAgainst);
    }
};

const guessSuggestionsFromScopes = (scopes, carretPosition, jsonPath, jsonToTestAgainst) => {
    if (!scopes || scopes.length === 0) {
        return [];
    }

    return flatten(scopes.map(appliableScope => {
        // Check if there is any conditions on carret position for appliableScope
        if (appliableScope.setCarretAt) {
            if (jsonPath.length - carretPosition === appliableScope.setCarretAt) {
                return flatten(evalAllProperties(
                    suggestions.filter(s => s.scopes.includes(appliableScope.value)),
                    carretPosition,
                    jsonPath,
                    jsonToTestAgainst
                )) || [];
            } else {
                return flatten(evalAllProperties(
                    suggestions.filter(s => s.scopes.includes(appliableScope.value)),
                    carretPosition,
                    jsonPath,
                    jsonToTestAgainst
                )) || [];
            }
        } else {
            return flatten(evalAllProperties(
                suggestions.filter(s => s.scopes.includes(appliableScope.value)),
                carretPosition,
                jsonPath,
                jsonToTestAgainst
            ));
        }
    }));
};

const flatten = (arr) => {
    return [].concat(...arr);
};

export const evalAllProperties = (suggestions, carretPosition, jsonPath, jsonToTestAgainst) => {
    //console.log({suggestions, carretPosition, jsonPath, jsonToTestAgainst})
    return suggestions.map(s => {
        if (s.value === 'all_properties') {
            const jsonPathToObject = jsonPath.substring(0, jsonPath.length - 1);
            try {
                const filteredJson = jp.query(jsonToTestAgainst, jsonPathToObject)[0];

                const properties = Object.keys(filteredJson);

                return properties.map(p => ({
                    value: p,
                    description: 'property',
                    scopes: ['object']
                }));
            } catch (e) {
                // ignore error
                return [];
            }


        } else if (s.value === 'all_properties_recursively') {
            const jsonPathToObject = jsonPath.substring(0, jsonPath.length - 2);
            try {
                const filteredJson = jp.query(jsonToTestAgainst, jsonPathToObject)[0];

                const properties = Array.from(new Set(getAllPropertiesRecursively(filteredJson)));
                return properties.map(p => ({
                    value: p,
                    description: 'property',
                    scopes: ['object']
                }));
            } catch (e) {
                // ignore error
                return [];
            }
        } else if (s.value === 'all_properties_of_parent_array') {
            //"$.d[1].df.f[?(@.t === 'tf' && @.{cursorHere}truc === 'd' && @.defined)]"
            // 1. split at cursor, take first part
            //"$.d[1].df.f[?(@.t === 'tf' && @."
            const splittedJsonPathAtCursor = jsonPath.substring(0, carretPosition);
            // 2. Search for last "[" index, then split at this index, take first part
            //"$.d[1].df.f" 
            const lastIndexOfOpennedArray = splittedJsonPathAtCursor.lastIndexOf('[');
            const jsonPathToParentArray = splittedJsonPathAtCursor.substring(0, lastIndexOfOpennedArray);
            // 3. We then want to evaluate all unique properties in f array at first level 
            try {
                const filteredJson = jp.query(jsonToTestAgainst, jsonPathToParentArray)[0];
                const properties = Array.from(new Set(getAllPropertiesAtFirstLevel(filteredJson)));
                return properties.map(p => ({
                    value: p + ' ',
                    setCarretAt: p.length-1,
                    description: 'property',
                    scopes: ['object']
                }));
            } catch(e) {
                return [];
            }
        } else {
            return s;
        }
    });
};

const getAllPropertiesRecursively = (objectOrArray) => {
    if (Array.isArray(objectOrArray)) {
        return flatten(objectOrArray.map(arrayEntry => {
            return getAllPropertiesRecursively(arrayEntry);
        })).filter(p => p !== null && typeof p !== 'undefined');
    } else if (typeof objectOrArray === 'object') {
        const keys = Object.keys(objectOrArray);
        const subkeys = keys.map(key => {
            return getAllPropertiesRecursively(objectOrArray[key]);
        }).filter(k => k !== null);
        return flatten([...keys, ...subkeys]).filter(p => p !== null && typeof p !== 'undefined');
    } else {
        return null;
    }
};

const getAllPropertiesAtFirstLevel = (objectOrArray) => {
    if (Array.isArray(objectOrArray)) {
        return flatten(objectOrArray.map(arrayEntry => {
            return getAllPropertiesAtFirstLevel(arrayEntry);
        })).filter(p => p !== null && typeof p !== 'undefined');
    } else if (typeof objectOrArray === 'object') {
        const keys = Object.keys(objectOrArray);
        return flatten(keys).filter(p => p !== null && typeof p !== 'undefined');
    } else {
        return null;
    }
};