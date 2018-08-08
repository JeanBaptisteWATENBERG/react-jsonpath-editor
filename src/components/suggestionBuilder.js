import jp from 'jsonpath/jsonpath.min';

const suggestions = [
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
        'scopes': ['array', 'object']
    },
    {
        'description': 'search recursively for a property',
        'value': '..',
        'scopes': ['array', 'object']
    },
    {
        'value': 'all_properties',
        'scopes': ['.']
    },
    {
        'value': 'all_properties_recursively',
        'scopes': ['..']
    },
    {
        'description': 'filter a collection',
        'value': '?(@)',
        'setCarretAt': 3,
        'scopes': ['[]']
    },
    {
        'description': 'select an item by it\'s index relatively to the size of the collection',
        'value': '(@.length-1)',
        'setCarretAt': 10,
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
        const appliableScopes = suggestions.filter(s => jsonPath.endsWith(s.value));
        return guessSuggestionsFromScopes(appliableScopes, caretPosition, jsonPath, jsonToTestAgainst);
    }
};

const guessSuggestionsFromScopes = (scopes, carretPosition, jsonPath, jsonToTestAgainst) => {
    if (scopes.length > 0) {
        // Check if there is any conditions on carret position for appliableScope
        const appliableScope = scopes[scopes.length - 1];
        if (appliableScope.setCarretAt) {
            if (jsonPath.length - carretPosition === appliableScope.setCarretAt) {
                return suggestions.filter(s => s.scopes.includes(appliableScope.value));
            } else {
                return [];
            }
        } else {
            return flatten(evalAllProperties(
                suggestions.filter(s => s.scopes.includes(appliableScope.value)),
                jsonPath,
                jsonToTestAgainst
            ));
        }
    } else {
        return [];
    }
};

const flatten = (arr) => {
    return [].concat(...arr);
};

export const evalAllProperties = (suggestions, jsonPath, jsonToTestAgainst) => {
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